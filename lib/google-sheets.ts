import { google } from "googleapis";
import type { CompleteOrder } from "@/lib/order-schema";

const columns = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Flavor",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes"
];

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function privateKey() {
  return requireEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
}

function sheetRange(tabName: string) {
  const escapedTabName = tabName.replace(/'/g, "''");
  return `'${escapedTabName}'!A:N`;
}

export async function appendOrderToSheet(order: CompleteOrder) {
  const spreadsheetId = requireEnv("GOOGLE_SHEET_ID");
  const tabName = requireEnv("GOOGLE_SHEET_TAB_NAME");

  const auth = new google.auth.JWT({
    email: requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: privateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(tabName),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.flavor,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes
        ]
      ]
    }
  });
}

export { columns as sheetColumns };
