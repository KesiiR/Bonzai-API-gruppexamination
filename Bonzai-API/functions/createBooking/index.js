import { nanoid } from 'nanoid';
import { client } from '../../service/db.js';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  validateDates,
  validateEmail,
  validateName,
  validateGuests,
  validateRooms,
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
import { successResponse, errorResponse } from '../../responses/errorHandling.js';

export const handler = async (event) => {
  try {
    // Hämtar och parser inkommande datan
    const { guests, bookedRooms, name, email, checkIn, checkOut } = JSON.parse(
      event.body
    );
    // Skapar ett bokningsID
    const bookingId = nanoid(8);

    // Validerar alla fält i bodyn
    const reqError = validateRequired(
      { guests, bookedRooms, name, email, checkIn, checkOut },
      ['guests', 'bookedRooms', 'name', 'email', 'checkIn', 'checkOut']
    );
    if (reqError) return errorResponse(400, reqError);

    const emailError = validateEmail(email);
    if (emailError) return errorResponse(400, emailError);

    const nameError = validateName(name);
    if (nameError) return errorResponse(400, nameError);

    const guestsError = validateGuests(guests);
    if (guestsError) return errorResponse(400, guestsError);

    const roomsError = validateRooms(bookedRooms);
    if (roomsError) return errorResponse(400, roomsError);

    //Kör validateDates i validation
    const dateError = validateDates(checkIn, checkOut);
    if (dateError) return errorResponse(400, dateError);

    const noBookedRoomError = validateArrayIsNotEmpty(
      bookedRooms,
      'At least one room must be booked.'
    );
    if (noBookedRoomError) {
      return errorResponse(400, noBookedRoomError);
    }
    // Beräknbar antalet rum och kontrollerar tillgängligheten
    const totalRooms = getTotalBookedRoomCount(bookedRooms);
    let remainingRooms = 20;
    const totalRoomsError = validateRemainingRooms(totalRooms, remainingRooms);
    if (totalRoomsError) {
      return errorResponse(400, totalRoomsError);
    }

    // Kollar att den totala kapaciteten räcker för antalet gäster
    const capacity = getTotalGuestCapacity(bookedRooms);
    const capacityError = validateTotalGuestCapacity(capacity, guests);
    if (capacityError) {
      return errorResponse(400, capacityError);
    }
    // Räkna ut totalpriset för bokningen
    const totalPrice = getTotalBookingPrice(bookedRooms);

    // Tidpunkt när bokningen görs
    const now = new Date().toISOString();

    // Förbereder och skapar bokningen i DynamoDB
    const command = {
      TableName: 'BonzaiTable',
      Item: {
        pk: { S: 'BOOKING' },
        sk: { S: bookingId },
        guests: { N: guests.toString() },
        single: { N: getRoomCountByType(bookedRooms, 'single').toString() },
        double: { N: getRoomCountByType(bookedRooms, 'double').toString() },
        suite: { N: getRoomCountByType(bookedRooms, 'suite').toString() },
        totalRooms: { N: totalRooms.toString() },
        name: { S: name },
        email: { S: email },
        totalPrice: { N: totalPrice.toString() },
        checkIn: { S: checkIn },
        checkOut: { S: checkOut },
        createdAt: { S: now },
      },
    };

    await client.send(new PutItemCommand(command));

    // Returnerar bokningsbekräftelse
    const response = {
      bookingId,
      guests,
      singleRooms: getRoomCountByType(bookedRooms, 'single'),
      doubleRooms: getRoomCountByType(bookedRooms, 'double'),
      suiteRooms: getRoomCountByType(bookedRooms, 'suite'),
      totalRooms,
      totalPrice,
      name,
      checkIn,
      checkOut,
      createdAt: now,
    };
    return successResponse(200, {
      message: 'Booking created successfully',
      response,
    });
  } catch (error) {
    // Fångar och loggar fel
    console.error('Error creating booking:', error);
    return errorResponse(500, 'Internal server error');
  }
};
