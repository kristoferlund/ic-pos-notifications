import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";

import { CourierClient } from "@trycourier/courier";

type requestBody = {
  idempotencyKey: string;
  email: string;
  phone: string;
  amount: string;
  payer: string;
};

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  console.log(`${event.httpMethod} - ${event.path} - ${event.body}`);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: "Bad Request",
    };
  }

  const body: requestBody = JSON.parse(event.body);

  let amount = Number.parseInt(body.amount);
  amount = amount * Math.pow(10, -9);

  const courier = CourierClient({
    authorizationToken: process.env.COURIER_AUTH_TOKEN,
  });

  const responses = [];

  if (body.email) {
    const { requestId } = await courier.send(
      {
        message: {
          to: {
            email: body.email,
          },
          template: "WJKFSV1362MGZEHW9G7EMMPZDMMW",
          data: {
            amount: amount.toFixed(9),
            payer: body.payer,
          },
        },
      },
      {
        idempotencyKey: body.idempotencyKey,
      }
    );
    responses.push(requestId);
    console.log(`Email sent with requestId: ${requestId}`);
  }

  if (body.phone) {
    const { requestId } = await courier.send(
      {
        message: {
          to: {
            phone_number: body.phone,
          },
          template: "3X4D3DD3J5MBS6GPS5K2ZHESK3HW",
          data: {
            amount: amount.toFixed(9),
            payer: body.payer,
          },
        },
      },
      {
        idempotencyKey: body.idempotencyKey,
      }
    );
    responses.push(requestId);
    console.log(`SMS sent with requestId: ${requestId}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(responses),
  };
};

export { handler };
