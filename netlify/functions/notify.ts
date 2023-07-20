import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";

import { CourierClient } from "@trycourier/courier";

// Define the request body type
type requestBody = {
  idempotencyKey: string;
  email: string;
  phone: string;
  amount: string;
  payer: string;
};

// Define the handler function
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Log the event details
  console.log(`${event.httpMethod} - ${event.path} - ${event.body}`);

  // Check if the HTTP method is POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // Check if the event body exists
  if (!event.body) {
    return {
      statusCode: 400,
      body: "Bad Request",
    };
  }

  // Parse the event body
  const body: requestBody = JSON.parse(event.body);

  // Convert the amount to a number and adjust its scale
  let amount = Number.parseInt(body.amount);
  amount = amount * Math.pow(10, -9);

  // Initialize the Courier client
  const courier = CourierClient({
    authorizationToken: process.env.COURIER_AUTH_TOKEN,
  });

  // Initialize an array to store the responses
  const responses = [];

  // If an email is provided, send an email
  if (body.email) {
    const { requestId } = await courier.send(
      {
        message: {
          to: {
            email: body.email,
          },
          template: "WJKFSV1362MGZEHW9G7EMMPZDMMW",
          data: {
            amount: amount.toFixed(9).replace(/0+$/, ""),
            payer: body.payer,
          },
        },
      },
      {
        idempotencyKey: body.idempotencyKey + "-email",
      }
    );
    responses.push(requestId);
    console.log(`Email sent with requestId: ${requestId}`);
  }

  // If a phone number is provided, send an SMS
  if (body.phone) {
    const { requestId } = await courier.send(
      {
        message: {
          to: {
            phone_number: body.phone,
          },
          template: "3X4D3DD3J5MBS6GPS5K2ZHESK3HW",
          data: {
            amount: amount.toFixed(9).replace(/0+$/, ""),
            payer: body.payer,
          },
        },
      },
      {
        idempotencyKey: body.idempotencyKey + "-sms",
      }
    );
    responses.push(requestId);
    console.log(`SMS sent with requestId: ${requestId}`);
  }

  // Return the responses
  return {
    statusCode: 200,
    body: JSON.stringify(responses),
  };
};

export { handler };
