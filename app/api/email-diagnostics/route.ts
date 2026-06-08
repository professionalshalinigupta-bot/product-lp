import { NextResponse } from "next/server";
import { emailEnvStatus, verifyEmailTransport } from "@/lib/mailer";

export const dynamic = "force-dynamic";

function missingEmailEnv() {
  const status = emailEnvStatus();
  return Object.entries(status)
    .filter(([, present]) => !present)
    .map(([name]) => name);
}

export async function GET() {
  const missing = missingEmailEnv();

  if (missing.length > 0) {
    console.error("Email diagnostics: missing email environment variables.", { missing });
    return NextResponse.json(
      {
        success: false,
        message: "Email is not fully configured on the server.",
        missing
      },
      { status: 500 }
    );
  }

  try {
    const transport = await verifyEmailTransport();
    return NextResponse.json({
      success: true,
      message: "SMTP connection verified.",
      transport
    });
  } catch (error) {
    console.error("Email diagnostics: SMTP verification failed.", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        success: false,
        message: "SMTP verification failed. Check Vercel backend logs for the provider error."
      },
      { status: 502 }
    );
  }
}
