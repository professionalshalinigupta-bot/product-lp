import nodemailer from "nodemailer";
import type { CompleteOrder } from "@/lib/order-schema";
import { businessOrderEmail, customerOrderEmail } from "@/lib/email-templates";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  businessEmail: string;
  emailFrom: string;
  brandName: string;
};

export type EmailEnvStatus = {
  smtpHost: boolean;
  smtpPort: boolean;
  smtpUser: boolean;
  smtpPass: boolean;
  businessEmail: boolean;
  senderEmail: boolean;
  brandName: boolean;
};

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export function emailEnvStatus(): EmailEnvStatus {
  return {
    smtpHost: Boolean(firstEnv(["SMTP_HOST"])),
    smtpPort: Boolean(firstEnv(["SMTP_PORT"])),
    smtpUser: Boolean(firstEnv(["SMTP_USER", "GMAIL_USER"])),
    smtpPass: Boolean(firstEnv(["SMTP_PASS", "GMAIL_APP_PASSWORD"])),
    businessEmail: Boolean(firstEnv(["BUSINESS_EMAIL"])),
    senderEmail: Boolean(firstEnv(["EMAIL_FROM", "SENDER_EMAIL"])),
    brandName: Boolean(firstEnv(["BRAND_NAME", "NEXT_PUBLIC_BRAND_NAME"]))
  };
}

function requireAnyEnv(names: string[]) {
  const value = firstEnv(names);
  if (!value) throw new Error(`Missing required email environment variable: ${names.join(" or ")}`);
  return value;
}

function smtpConfig(): SmtpConfig {
  const portText = firstEnv(["SMTP_PORT"]) || "465";
  const port = Number(portText);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid SMTP_PORT. Use 465 for Gmail SSL or 587 for STARTTLS.");
  }

  const user = requireAnyEnv(["SMTP_USER", "GMAIL_USER"]);
  const businessEmail = requireAnyEnv(["BUSINESS_EMAIL"]);
  const senderEmail = firstEnv(["EMAIL_FROM", "SENDER_EMAIL"]) || user;

  return {
    host: firstEnv(["SMTP_HOST"]) || "smtp.gmail.com",
    port,
    secure: port === 465,
    user,
    pass: requireAnyEnv(["SMTP_PASS", "GMAIL_APP_PASSWORD"]),
    businessEmail,
    emailFrom: senderEmail.includes("<") ? senderEmail : `${firstEnv(["BRAND_NAME", "NEXT_PUBLIC_BRAND_NAME"]) || "shakeweight"} <${senderEmail}>`,
    brandName: firstEnv(["BRAND_NAME", "NEXT_PUBLIC_BRAND_NAME"]) || "shakeweight"
  };
}

function transporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
}

export async function verifyEmailTransport() {
  const config = smtpConfig();
  const mailer = transporter(config);
  await mailer.verify();

  return {
    host: config.host,
    port: config.port,
    secure: config.secure,
    userDomain: config.user.split("@")[1] || "unknown"
  };
}

export async function sendOrderEmails(order: CompleteOrder) {
  const config = smtpConfig();
  const mailer = transporter(config);

  await mailer.sendMail({
    from: config.emailFrom,
    to: config.businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessOrderEmail(order, config.brandName)
  });

  await mailer.sendMail({
    from: config.emailFrom,
    to: order.email,
    replyTo: config.businessEmail,
    subject: `Your Order Has Been Received - ${config.brandName}`,
    html: customerOrderEmail(order, config.brandName, config.businessEmail)
  });
}
