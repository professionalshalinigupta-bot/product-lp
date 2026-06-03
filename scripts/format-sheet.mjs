import fs from "node:fs";
import { google } from "googleapis";

const envText = fs.readFileSync(".env.local", "utf8");

for (const line of envText.split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  const index = line.indexOf("=");
  if (index === -1) continue;
  const key = line.slice(0, index);
  let value = line.slice(index + 1);
  if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
  process.env[key] = value;
}

const headers = [
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

const statusOptions = ["New Order", "Order Confirmed", "Order Ongoing", "Delivered", "Cancelled"];

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function escapedSheetName(name) {
  return name.replace(/'/g, "''");
}

const auth = new google.auth.JWT({
  email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
const tabName = requiredEnv("GOOGLE_SHEET_TAB_NAME");

const spreadsheet = await sheets.spreadsheets.get({
  spreadsheetId,
  fields: "sheets.properties"
});

const targetSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === tabName);
if (!targetSheet?.properties?.sheetId && targetSheet?.properties?.sheetId !== 0) {
  throw new Error(`Sheet tab not found: ${tabName}`);
}

const sheetId = targetSheet.properties.sheetId;

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: `'${escapedSheetName(tabName)}'!A1:N1`,
  valueInputOption: "USER_ENTERED",
  requestBody: { values: [headers] }
});

await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: {
              frozenRowCount: 1,
              rowCount: Math.max(targetSheet.properties.gridProperties?.rowCount || 1000, 1000),
              columnCount: headers.length
            },
            tabColor: { red: 0.85, green: 0.25, blue: 0.47 }
          },
          fields: "gridProperties(frozenRowCount,rowCount,columnCount),tabColor"
        }
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.09, green: 0.13, blue: 0.11 },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                bold: true,
                fontSize: 11
              }
            }
          },
          fields: "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
          properties: { pixelSize: 42 },
          fields: "pixelSize"
        }
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length },
          cell: {
            userEnteredFormat: {
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
              textFormat: {
                foregroundColor: { red: 0.09, green: 0.13, blue: 0.11 },
                fontSize: 10
              },
              borders: {
                bottom: {
                  style: "SOLID",
                  width: 1,
                  color: { red: 0.88, green: 0.91, blue: 0.89 }
                }
              }
            }
          },
          fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat,borders)"
        }
      },
      {
        addBanding: {
          bandedRange: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length },
            rowProperties: {
              headerColor: { red: 0.09, green: 0.13, blue: 0.11 },
              firstBandColor: { red: 1, green: 1, blue: 1 },
              secondBandColor: { red: 0.98, green: 0.94, blue: 0.96 }
            }
          }
        }
      },
      {
        setBasicFilter: {
          filter: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length }
          }
        }
      },
      {
        setDataValidation: {
          range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 12, endColumnIndex: 13 },
          rule: {
            condition: {
              type: "ONE_OF_LIST",
              values: statusOptions.map((userEnteredValue) => ({ userEnteredValue }))
            },
            strict: true,
            showCustomUi: true
          }
        }
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 8, endColumnIndex: 11 },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "RIGHT",
              numberFormat: { type: "NUMBER", pattern: "#,##0" }
            }
          },
          fields: "userEnteredFormat(horizontalAlignment,numberFormat)"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
          properties: { pixelSize: 190 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
          properties: { pixelSize: 165 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 8 },
          properties: { pixelSize: 150 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: 8, endIndex: 13 },
          properties: { pixelSize: 130 },
          fields: "pixelSize"
        }
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: 13, endIndex: 14 },
          properties: { pixelSize: 220 },
          fields: "pixelSize"
        }
      }
    ]
  }
});

console.log(`Formatted sheet tab: ${tabName}`);
