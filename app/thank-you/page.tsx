import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { formatMoney } from "@/lib/product";

type ThankYouPageProps = {
  searchParams: Promise<{
    orderId?: string;
    productName?: string;
    flavor?: string;
    quantity?: string;
    totalPrice?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const productName = params.productName || "shakeweight";
  const flavor = params.flavor || "Strawberry";
  const quantity = params.quantity || "1";
  const totalPrice = Number(params.totalPrice || 0);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4fbf1] px-4 py-10">
      <section className="w-full max-w-2xl rounded-[2rem] bg-white p-6 text-center shadow-soft sm:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint text-leaf">
          <CheckCircle2 size={42} />
        </div>
        <h1 className="mt-6 text-4xl font-black text-charcoal">Thank you for your order!</h1>
        <p className="mx-auto mt-4 max-w-xl leading-8 text-charcoal/68">Our sales representative will call you soon to confirm your order.</p>
        <div className="mt-8 grid gap-3 rounded-3xl bg-[#f7fbf4] p-5 text-left">
          {params.orderId ? <Row label="Order ID" value={params.orderId} /> : null}
          <Row label="Product ordered" value={productName} />
          <Row label="Flavor" value={flavor} />
          <Row label="Quantity" value={quantity} />
          <Row label="Total price" value={totalPrice ? formatMoney(totalPrice) : "Confirmed on call"} />
          <Row label="Payment method" value="Cash On Delivery" />
        </div>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3 font-black text-white shadow-lg shadow-leaf/20 transition hover:bg-[#286b4b]"
        >
          <Home size={19} />
          Back to Home
        </Link>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-leaf/10 pb-3 last:border-0 last:pb-0">
      <span className="font-semibold text-charcoal/60">{label}</span>
      <span className="text-right font-black text-charcoal">{value}</span>
    </div>
  );
}
