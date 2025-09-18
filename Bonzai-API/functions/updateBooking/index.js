import { client } from '../../service/db.js';
import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import {
  validateName,
  validateGuests,
  validateRooms,
  validateDates,
  validateRequired,
  validateRemainingRooms,
  validateTotalGuestCapacity,
  validateArrayIsNotEmpty,
} from '../validation/validateRequest.js';
import {
  getTotalBookedRoomCount,
  getTotalGuestCapacity,
  getTotalBookingPrice,
  getRoomCountByType,
} from '../../utils/bookingUtils.js';
import {
  errorResponse,
  successResponse,
} from '../../responses/errorHandling.js';

export const handler = async (event) => {
  try {
    // Hämtar och parser inkommande datan
    const { guests, bookedRooms, name, checkIn, checkOut } = JSON.parse(
      event.body
    );
    const { id } = event.pathParameters;

    if (!id) {
      return errorResponse(400, 'BookingID must be provided');
    }

    // Validerar alla fält i bodyn
    const reqError = validateRequired(
      { guests, bookedRooms, name, checkIn, checkOut },
      ['guests', 'bookedRooms', 'name', 'checkIn', 'checkOut']
    );
    if (reqError) return errorResponse(400, reqError);

    const nameError = validateName(name);
    if (nameError) return errorResponse(400, nameError);

    const guestsError = validateGuests(guests);
    if (guestsError) return errorResponse(400, guestsError);

    const roomsError = validateRooms(bookedRooms);
    if (roomsError) return errorResponse(400, roomsError);

    const dateError = validateDates(checkIn, checkOut);
    if (dateError) return dateError;

    // Hämtar befintlig bokning från DynamoDB
    const commandForGettingBooking = new GetItemCommand({
      TableName: 'BonzaiTable',
      Key: {
        pk: { S: 'BOOKING' },
        sk: { S: id },
      },
    });

    const bookingResponse = await client.send(commandForGettingBooking);

    // Om ingen bokning hittas returnera fel
    if (!bookingResponse.Item) {
      return errorResponse(400, 'Could not find booking with matching ID');
    }
    // Kollar att det angivna namnet matchar det som finns i databasen
    if (name.toLowerCase() !== bookingResponse.Item.name.S.toLowerCase()) {
      return errorResponse(
        401,
        'The provided name must match the name used when booking'
      );
    }
    // Kontroll att minst ett rum har bokats
    const noBookedRoomError = validateArrayIsNotEmpty(
      bookedRooms,
      'At least one room must be booked.'
    );
    if (noBookedRoomError) {
      return errorResponse(400, noBookedRoomError);
    }

    // Beräknar uppdaterad rumsinformation
    const totalRooms = getTotalBookedRoomCount(bookedRooms);
    const remainingRooms = 20;
    const totalRoomsError = validateRemainingRooms(totalRooms, remainingRooms);
    if (totalRoomsError) return errorResponse(400, totalRoomsError);

    // Kollar att den totala kapaciteten räcker för antalet gäster
    const updatedCapacity = getTotalGuestCapacity(bookedRooms);
    const roomsCapacityError = validateTotalGuestCapacity(
      updatedCapacity,
      guests
    );
    if (roomsCapacityError) {
      return errorResponse(400, roomsCapacityError);
    }
    // Räkna ut totalpriset för bokningen
    const totalPrice = getTotalBookingPrice(bookedRooms);

    // Tidpunkt för uppdateringen
    const now = new Date().toISOString();

    // Förbereder och uppdaterar bokningen i DynamoDB
    const command = new UpdateItemCommand({
      TableName: 'BonzaiTable',
      Key: {
        pk: { S: 'BOOKING' },
        sk: { S: id },
      },
      UpdateExpression: `
        SET 
        guests = :guests,
        #single = :single,
        #double = :double,
        #suite = :suite,
        totalRooms = :totalRooms,
        totalPrice = :totalPrice,
        checkIn = :checkIn,
        checkOut = :checkOut,
        modifiedAt = :modifiedAt
        `,
      ExpressionAttributeNames: {
        '#single': 'single',
        '#double': 'double',
        '#suite': 'suite',
      },
      ExpressionAttributeValues: {
        ':guests': { N: guests.toString() },
        ':single': { N: getRoomCountByType(bookedRooms, 'single').toString() },
        ':double': { N: getRoomCountByType(bookedRooms, 'double').toString() },
        ':suite': { N: getRoomCountByType(bookedRooms, 'suite').toString() },
        ':totalRooms': { N: totalRooms.toString() },
        ':totalPrice': { N: totalPrice.toString() },
        ':checkIn': { S: checkIn },
        ':checkOut': { S: checkOut },
        ':modifiedAt': { S: now },
      },

      ReturnValues: 'ALL_NEW',
    });

    const response = await client.send(command);

    // Returnerar bekräftelse på uppdaterad bokning
    const updatedBookingConfirmation = {
      id,
      guests,
      singleRooms: getRoomCountByType(bookedRooms, 'single'),
      doubleRooms: getRoomCountByType(bookedRooms, 'double'),
      suiteRooms: getRoomCountByType(bookedRooms, 'suite'),
      totalRooms,
      totalPrice,
      name,
      checkIn,
      checkOut,
      createdAt: bookingResponse.Item.createdAt.S,
      modifiedAt: now,
    };

    return successResponse(200, {
      message: 'Booking updated successfully',
      updatedBookingConfirmation,
    });
  } catch (error) {
    // Fångar och loggar fel
    console.error('Error creating booking:', error);
    return errorResponse(500, 'Internal server error');
  }
};
