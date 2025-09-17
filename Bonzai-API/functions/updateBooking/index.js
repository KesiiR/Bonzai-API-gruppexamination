import { client } from '../../service/db.js';
import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export const handler = async (event) => {
  try {
    const { guests, bookedRooms, name, checkIn, checkOut } = JSON.parse(event.body);
    const { id } = event.pathParameters;
    const rooms = {
      single: {
        capacity: 1,
        price: 500,
      },
      double: {
        capacity: 2,
        price: 1000,
      },
      suite: {
        capacity: 3,
        price: 1500,
      },
    };

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'BookingID must be provided',
        }),
      };
    }

    // Se till att alla attribut följer med i bokningen
    if (typeof guests != 'number' || !bookedRooms || typeof name != 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'guests, bookedRooms, and name must be provided and valid',
        }),
      };
    }

    const commandForGettingBooking = new GetItemCommand({
      TableName: 'BonzaiTable',
      Key: {
        pk: { S: 'BOOKING' },
        sk: { S: id },
      },
    });

    const bookingResponse = await client.send(commandForGettingBooking);

    if (!bookingResponse.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Could not find booking with matching ID',
        }),
      };
    }

    if (name.toLowerCase() !== bookingResponse.Item.name.S.toLowerCase()) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'The provided name must match the name used when booking',
        }),
      };
    }

    // Skapa variabel för antal rum och kolla så att det bokas något alls och så att det inte bokas fler än 20
    const totalRooms = bookedRooms.reduce(
      (summa, room) => summa + room.amount,
      0
    );

    if (totalRooms > 20) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Amount of rooms must can not exceed 20',
        }),
      };
    }

    if (totalRooms < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Amount of rooms must exceed 0',
        }),
      };
    }

    // Kolla hur många gäster de bokade rummen rymmer och sedan ta reda på om antalet gäster överstiger den gränsen
    const updatedCapacity = bookedRooms.reduce(
      (summa, room) => summa + rooms[room.type].capacity * room.amount,
      0
    );

    if (updatedCapacity < guests) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Not enough housing booked for the provided amount of guests',
        }),
      };
    }

    const totalPrice = bookedRooms.reduce(
      (summa, room) => summa + rooms[room.type].price * room.amount,
      0
    );

    const getAmount = (type) =>
      Array.isArray(bookedRooms)
        ? bookedRooms.find((r) => r.type === type)?.amount ?? 0
        : 0;

    // Kanske lägga till en attribut för hur många rum som totalt bokats
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
        totalPrice = :totalPrice
        `,
      ExpressionAttributeNames: {
        '#single': 'single',
        '#double': 'double',
        '#suite': 'suite',
      },
      ExpressionAttributeValues: {
        ':guests': { N: guests.toString() || '0' },
        ':single': { N: getAmount('single').toString() },
        ':double': { N: getAmount('double').toString() },
        ':suite': { N: getAmount('suite').toString() },
        ':totalPrice': { N: totalPrice.toString() || '0' },
      },

      ReturnValues: 'ALL_NEW',
    });

    const response = await client.send(command);

    console.log(response);

    const updatedBookingConfirmation = {
      id,
      guests,
      singleRooms: getAmount('single'),
      doubleRooms: getAmount('double'),
      suiteRooms: getAmount('suite'),
      totalPrice,
      name,
      checkIn,
      checkOut,
      createdAt: bookingResponse.Item.createdAt.S,
      modifiedAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking updated successfully',
        updatedBookingConfirmation,
      }),
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
