import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { sendOrderEmails } from "@/lib/mailer";
import { type CompleteOrder, orderInputSchema } from "@/lib/order-schema";

export const dynamic = "force-dynamic";

function makeOrderId() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SW-${timestamp}-${random}`;
}

function isAllowedOrigin(request: Request) {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === frontendUrl;
}

function logServerError(message: string, error: unknown, extra?: Record<string, string>) {
  console.error(message, {
    ...extra,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ success: false, error: "This request origin is not allowed." }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = orderInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fix the highlighted order details.",
          details: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const order: CompleteOrder = {
      ...parsed.data,
      orderId: makeOrderId(),
      dateTime: new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "Asia/Kathmandu"
      }).format(new Date()),
      paymentMethod: "Cash On Delivery",
      orderStatus: "New Order",
      notes: ""
    };

    await appendOrderToSheet(order);

    try {
      await sendOrderEmails(order);
    } catch (emailError) {
      logServerError("Order saved, but email notification failed.", emailError, { orderId: order.orderId });
      return NextResponse.json(
        {
          success: false,
          orderId: order.orderId,
          error: "Your order was received, but we could not send the confirmation email right now. Please contact support with your order ID."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    logServerError("Order submission failed.", error);
    return NextResponse.json(
      {
        success: false,
        error: "We could not submit your order right now. Please try again or contact support."
      },
      { status: 500 }
    );
  }
}
