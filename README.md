# shakeweight Cash On Delivery Funnel

Complete Next.js + Tailwind CSS funnel for selling `shakeweight` with Cash On Delivery.

## Pages

- `/` - product landing page
- `/checkout` - COD checkout page
- `/thank-you` - order confirmation page
- `/api/order` - secure server-side order submission route

## Order Flow

1. Customer selects flavor and quantity on the landing page.
2. CTA sends product name, flavor, quantity, price per piece, delivery fee, and total price to `/checkout`.
3. Checkout validates customer name, phone, email, location, product, flavor, quantity, price, and total.
4. `/api/order` creates an Order ID, date/time, status `New Order`, and payment method `Cash On Delivery`.
5. The order is saved to Google Sheets.
6. A business order notification email is sent.
7. A customer order received email is sent.
8. Customer is redirected to `/thank-you`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill the values:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUSINESS_EMAIL=professionalshalinigupta@gmail.com
EMAIL_FROM="shakeweight <professionalshalinigupta@gmail.com>"
BRAND_NAME=shakeweight

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=shakeweight order
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=professionalshalinigupta@gmail.com
SMTP_PASS=

EMAIL_SERVICE_API_KEY=

FRONTEND_URL=http://localhost:3000
```

For Gmail SMTP, use a Gmail App Password for `SMTP_PASS`. Do not use your normal Gmail password.

On Vercel, the email system also accepts these aliases if you prefer the screenshot-style variable names:

```bash
SENDER_EMAIL=professionalshalinigupta@gmail.com
GMAIL_USER=professionalshalinigupta@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
NEXT_PUBLIC_BRAND_NAME=shakeweight
```

`SMTP_USER` and `GMAIL_USER` mean the same thing. `SMTP_PASS` and `GMAIL_APP_PASSWORD` mean the same thing. `EMAIL_FROM` and `SENDER_EMAIL` are both supported.

## Google Spreadsheet Setup

1. Create or open your Google Spreadsheet.
2. Create a sheet/tab named `shakeweight order` or use the tab name you set in `GOOGLE_SHEET_TAB_NAME`.
3. Add these column names in row 1:

```text
Order ID
Date & Time
Customer Name
Phone Number
Email Address
Exact Location
Product Name
Flavor
Quantity
Price Per Piece
Total Price
Payment Method
Order Status
Notes
```

4. Select row 1 and turn on filters from `Data > Create a filter`.
5. For the `Order Status` column, add a dropdown from `Data > Data validation`.
6. Use these dropdown options:

```text
New Order
Order Confirmed
Order Ongoing
Delivered
Cancelled
```

7. Get the Sheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

8. In Google Cloud, create a service account and enable the Google Sheets API.
9. Copy the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
10. Create a JSON key and copy the private key to `GOOGLE_PRIVATE_KEY`.
11. Share the Google Sheet with the service account email as Editor.

If the private key contains line breaks, keep them as escaped `\n` in `.env.local`.

## Run Locally

```bash
npm install
npm run optimize-images
npm run dev
```

Open `http://localhost:3000`.

## Test Order Submission

1. Fill `.env.local` with valid Google Sheets and SMTP credentials.
2. Start the app with `npm run dev`.
3. Visit the landing page and click an order CTA.
4. Fill checkout details with a real email address you can access.
5. Submit the order.
6. Confirm:
   - A new row appears in the Google Sheet.
   - `BUSINESS_EMAIL` receives the order notification.
   - The customer email receives the order received email.
   - The browser redirects to `/thank-you`.

If submission fails, the checkout page shows a clear error message and does not redirect.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add every value from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to your production domain.
5. Deploy.
6. Place one real test order after deployment.

## Editing Product Content

Product copy, price, delivery fee, testimonials, FAQs, and images are managed in:

```text
lib/product.ts
```

No online payment gateway is included. This funnel is built specifically for Cash On Delivery.
