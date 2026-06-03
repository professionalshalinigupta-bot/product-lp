import nodemailer from "nodemailer";
import type { CompleteOrder } from "@/lib/order-schema";
import { businessOrderEmail, customerOrderEmail } from "@/lib/email-templates";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function transporter() {
  return nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(requireEnv("SMTP_PORT")),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS")
    }
  });
}

export async function sendOrderEmails(order: CompleteOrder) {
  const brandName = process.env.BRAND_NAME || "shakeweight";
  const businessEmail = requireEnv("BUSINESS_EMAIL");
  const emailFrom = requireEnv("EMAIL_FROM");
  const mailer = transporter();

  await mailer.sendMail({
    from: emailFrom,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessOrderEmail(order, brandName)
  });

  await mailer.sendMail({
    from: emailFrom,
    to: order.email,
    replyTo: businessEmail,
    subject: `Your Order Has Been Received - ${brandName}`,
    html: customerOrderEmail(order, brandName, businessEmail)
  });
}
