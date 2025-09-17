import { nanoid } from "nanoid";
import { client } from "../../service/db.js";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
  try {
    const { guests, bookedRooms, name, email, checkIn, checkOut } = JSON.parse(event.body);


    const bookingId = nanoid(8);

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

    // Räkna ut antal rum.
    let remainingRooms = 20;

    const totalRooms = bookedRooms.reduce(
      (summa, room) => summa + room.amount,
      0
    );
    if (totalRooms > remainingRooms) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Not enough rooms available, ${remainingRooms} rooms left`,
        }),
      };
    }

    // Räkna ut om de finns tillräckligt med rum för antalet gäster
    const totalCapacity = bookedRooms.reduce(
      (summa, room) => summa + rooms[room.type].capacity * room.amount,
      0
    );

    if (guests > totalCapacity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Not enough capacity for guests" }),
      };
    }
    // Räkna ut totalpriset för bokningen
    const totalPrice = bookedRooms.reduce(
      (summa, room) => summa + rooms[room.type].price * room.amount,
      0
    );

    //Exempel på data från frontend
    /* {
     "guests": 5,
    "bookedRooms": [
      { type: "single", amount: 1 },
      { type: "double", amount: 2 },
      { type: "suite", amount: 0 }
    ],
    "name": "Anna Andersson",
    "email": "anna@example.com"
    }
  */

    const getAmount = (type) =>
      Array.isArray(bookedRooms)
        ? bookedRooms.find((r) => r.type === type)?.amount ?? 0
        : 0;

    const command = {
      TableName: "BonzaiTable",
      Item: {
        pk: { S: "BOOKING" },
        sk: { S: bookingId },
        guests: { N: guests.toString() },
        single: { N: getAmount("single").toString() },
        double: { N: getAmount("double").toString() },
        suite: { N: getAmount("suite").toString() },
        name: { S: name },
        email: { S: email },
        totalPrice: { N: totalPrice.toString() },
        checkIn: { S: checkIn },
        checkOut: { S: checkOut },
        createdAt: { S: new Date().toISOString() },
        checkIn: { S: checkIn },
        checkOut: { S: checkOut },
      },
    };

    await client.send(new PutItemCommand(command));

    const response = {
      bookingId,
      guests,
      singleRooms: getAmount("single"),
      doubleRooms: getAmount("double"),
      suiteRooms: getAmount("suite"),
      totalPrice,
      name,
      checkIn,
      checkOut,
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Booking confirmed",
        response,
      }),
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
