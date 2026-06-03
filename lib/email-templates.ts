import type { CompleteOrder } from "@/lib/order-schema";

function money(value: number) {
  return `NPR ${value.toLocaleString("en-NP")}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function layout(content: string, brandName: string) {
  return `
  <div style="margin:0;padding:0;background:#f4fbf1;font-family:Arial,Helvetica,sans-serif;color:#17211d;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4fbf1;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #dfeee3;">
            <tr>
              <td style="background:#2f7d57;color:#ffffff;padding:24px 28px;">
                <div style="font-size:24px;font-weight:800;line-height:1.2;">${escapeHtml(brandName)}</div>
                <div style="font-size:13px;opacity:.86;margin-top:6px;">Cash On Delivery Order System</div>
              </td>
            </tr>
            <tr><td style="padding:28px;">${content}</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function detailRow(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:10px 0;color:#5d6b63;font-size:14px;border-bottom:1px solid #edf4ef;">${label}</td>
      <td align="right" style="padding:10px 0;color:#17211d;font-weight:700;font-size:14px;border-bottom:1px solid #edf4ef;">${escapeHtml(String(value))}</td>
    </tr>`;
}

function section(title: string, rows: string) {
  return `
    <div style="margin-top:22px;">
      <h3 style="margin:0 0 8px;font-size:16px;color:#17211d;">${title}</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </div>`;
}

export function businessOrderEmail(order: CompleteOrder, brandName: string) {
  const content = `
    <h1 style="margin:0;font-size:26px;line-height:1.25;color:#17211d;">New product order received</h1>
    <p style="margin:10px 0 0;color:#5d6b63;line-height:1.6;">A new Cash On Delivery order has been submitted from the website.</p>
    <div style="display:inline-block;margin-top:16px;padding:8px 14px;border-radius:999px;background:#e9b949;color:#17211d;font-size:13px;font-weight:800;">${order.orderStatus}</div>
    ${section(
      "Order Details",
      detailRow("Order ID", order.orderId) + detailRow("Date & Time", order.dateTime)
    )}
    ${section(
      "Customer Details",
      detailRow("Customer Name", order.customerName) +
        detailRow("Phone Number", order.phone) +
        detailRow("Email Address", order.email) +
        detailRow("Exact Location", order.location)
    )}
    ${section(
      "Product Details",
      detailRow("Product Name", order.productName) +
        detailRow("Flavor", order.flavor) +
        detailRow("Quantity", order.quantity) +
        detailRow("Price Per Piece", money(order.pricePerPiece)) +
        detailRow("Total Price", money(order.totalPrice))
    )}
    ${section("Payment Details", detailRow("Payment Method", order.paymentMethod) + detailRow("Order Status", order.orderStatus))}
    <div style="margin-top:24px;border-radius:18px;background:#f4fbf1;border:1px solid #dfeee3;padding:18px;color:#17211d;font-weight:800;line-height:1.5;">Please call the customer soon to confirm this order.</div>`;

  return layout(content, brandName);
}

export function customerOrderEmail(order: CompleteOrder, brandName: string, supportEmail: string) {
  const content = `
    <h1 style="margin:0;font-size:26px;line-height:1.25;color:#17211d;">Thank you for your order.</h1>
    <p style="margin:12px 0 0;color:#5d6b63;line-height:1.7;">Hi ${escapeHtml(order.customerName)},</p>
    <p style="margin:8px 0 0;color:#5d6b63;line-height:1.7;">We have received your order successfully. Here are your order details:</p>
    ${section(
      "Your Order",
      detailRow("Order ID", order.orderId) +
        detailRow("Product", order.productName) +
        detailRow("Flavor", order.flavor) +
        detailRow("Quantity", order.quantity) +
        detailRow("Total Price", money(order.totalPrice)) +
        detailRow("Payment Method", order.paymentMethod)
    )}
    <div style="margin-top:24px;border-radius:18px;background:#f4fbf1;border:1px solid #dfeee3;padding:18px;color:#17211d;line-height:1.6;">Our sales representative will call you soon to confirm your order.</div>
    <p style="margin:22px 0 0;color:#5d6b63;line-height:1.7;">For support, reply to this email or contact ${escapeHtml(supportEmail)}.</p>
    <p style="margin:18px 0 0;color:#17211d;font-weight:800;">Thank you,<br/>${escapeHtml(brandName)}</p>`;

  return layout(content, brandName);
}
