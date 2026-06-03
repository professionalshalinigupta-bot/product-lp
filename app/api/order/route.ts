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
      console.error("Order saved, but email notification failed:", emailError);
      return NextResponse.json(
        {
          success: false,
          orderId: order.orderId,
          error: "Order was saved, but email notification failed. Please check your email credentials."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error("Order submission failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Order submission failed. Please try again."
      },
      { status: 500 }
    );
  }
}
