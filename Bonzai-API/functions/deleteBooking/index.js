import { DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { client } from "../../service/db.js"

export const handler = async (event) => {
  try {
    const bookingId = event.pathParameters.id
    const { email } = JSON.parse(event.body)
    if (!bookingId) throw new Error("No booking id provided")
    if (!email) throw new Error("Request failed. No email provided.")

    // import getBooking() för att kunna dubbelkolla om bokningen finns från dynamoDB
    // if(!booking || bookingId !== booking.sk) throw new Error("No booking found")

    await client.send(
      new DeleteItemCommand({
        TableName: "BonzaiTable",
        Key: {
          pk: { S: `BOOKING` },
          sk: { S: bookingId },
        },
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking removed successfully" }),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    }
  }
}
