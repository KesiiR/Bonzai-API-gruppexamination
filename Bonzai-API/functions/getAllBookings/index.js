import { client } from "../../service/db.js";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  errorResponse,
  successResponse,
} from "../../responses/errorHandling.js";

export const handler = async (event) => {
  try {
    const queryCommand = new QueryCommand({
      TableName: "BonzaiTable",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "BOOKING" },
      },
    });

    const queryResult = await client.send(queryCommand);

    const allBookings = queryResult.Items.map((item) => {
      const bookingNumber = item.sk.S;
      const numberOfGuests = parseInt(item.guests.N);
      const guestName = item.name.S;

      const singleRoomCount = parseInt(item.single.N);
      const doubleRoomCount = parseInt(item.double.N);
      const suiteRoomCount = parseInt(item.suite.N);
      const totalRoomCount = singleRoomCount + doubleRoomCount + suiteRoomCount;

      const checkIn = item.checkIn?.S;
      const checkOut = item.checkOut?.S;

      return {
        bookingNumber,
        numberOfGuests,
        totalRoomCount,
        guestName,
        checkIn,
        checkOut,
      };
    });

    const response = {
      message: "Hello, All bookings retrieved successfully",
      totalBookings: allBookings.length,
      bookings: allBookings,
    };

    return successResponse(200, response);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return errorResponse(500, "Internal server error");
  }
};
