"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { formatMoney, getFlavorOption, product } from "@/lib/product";

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  location: string;
};

function readNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quantity = Math.max(1, Math.floor(readNumber(searchParams.get("quantity"), 1)));
  const pricePerPiece = readNumber(searchParams.get("pricePerPiece"), product.price);
  const deliveryFee = readNumber(searchParams.get("deliveryFee"), product.deliveryFee);
  const expectedTotal = pricePerPiece * quantity + deliveryFee;
  const productName = searchParams.get("productName") || product.name;
  const initialFlavor = searchParams.get("flavor") || product.flavors[0];
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors.includes(initialFlavor) ? initialFlavor : product.flavors[0]
  );
  const flavorOption = getFlavorOption(selectedFlavor);
  const totalPrice = readNumber(searchParams.get("totalPrice"), expectedTotal);

  const [form, setForm] = useState<FormState>({ customerName: "", phone: "", email: "", location: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderSummary = useMemo(
    () => ({ productName, flavor: selectedFlavor, quantity, pricePerPiece, deliveryFee, totalPrice }),
    [productName, selectedFlavor, quantity, pricePerPiece, deliveryFee, totalPrice]
  );

  const validate = () => {
    const nextErrors: Partial<FormState> = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Full name is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.location.trim()) nextErrors.location = "Exact location is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...orderSummary })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Order submission failed. Please try again.");
      }

      const params = new URLSearchParams({
        orderId: result.orderId,
        productName,
        flavor: selectedFlavor,
        quantity: String(quantity),
        totalPrice: String(totalPrice)
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Order submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: flavorOption.soft }}>
      <div className="container-pad">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 font-bold hover:bg-white"
          style={{ color: flavorOption.accent }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <section className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: flavorOption.panel, color: flavorOption.accent }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-charcoal">Cash On Delivery Checkout</h1>
                <p className="mt-1 text-charcoal/60">Fill your details. We will call to confirm your order.</p>
              </div>
            </div>

            <form onSubmit={submitOrder} className="grid gap-5">
              <Field label="Full Name" error={errors.customerName}>
                <input
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                  className="focus-ring w-full rounded-2xl border border-leaf/15 px-4 py-3"
                  placeholder="Enter your full name"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="focus-ring w-full rounded-2xl border border-leaf/15 px-4 py-3"
                  placeholder="Enter your phone number"
                />
              </Field>
              <Field label="Email Address" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="focus-ring w-full rounded-2xl border border-leaf/15 px-4 py-3"
                  placeholder="Enter your email address"
                />
              </Field>
              <Field label="Exact Location" error={errors.location}>
                <textarea
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  className="focus-ring min-h-28 w-full rounded-2xl border border-leaf/15 px-4 py-3"
                  placeholder="Kindly share your exact location"
                />
              </Field>

              <div className="grid gap-4 rounded-3xl p-5 sm:grid-cols-2" style={{ backgroundColor: flavorOption.soft }}>
                <Readonly label="Product Name" value={productName} />
                <div className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-bold text-charcoal/60">Flavor</span>
                  <div className="flex gap-3 overflow-x-auto rounded-2xl border border-white/70 bg-white p-3">
                    {product.flavorOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelectedFlavor(option.name)}
                        className="focus-ring min-w-32 rounded-xl border px-4 py-3 text-left font-black transition"
                        style={{
                          borderColor: selectedFlavor === option.name ? option.accent : "rgba(47, 125, 87, 0.12)",
                          backgroundColor: selectedFlavor === option.name ? option.soft : "#ffffff",
                          color: selectedFlavor === option.name ? option.dark : "#17211d"
                        }}
                      >
                        <span className="block text-xs uppercase tracking-[0.16em]" style={{ color: option.accent }}>
                          Flavor
                        </span>
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Readonly label="Quantity" value={String(quantity)} />
                <Readonly label="Price Per Piece" value={formatMoney(pricePerPiece)} />
                <Readonly label="Total Price" value={formatMoney(totalPrice)} />
              </div>

              {submitError ? <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{submitError}</div> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="focus-ring inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-6 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65"
                style={{ backgroundColor: flavorOption.accent, boxShadow: `0 18px 40px ${flavorOption.glow}` }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                {isSubmitting ? "Submitting Order..." : "Order Now"}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-[2rem] p-6 text-white shadow-soft" style={{ backgroundColor: flavorOption.dark }}>
            <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: flavorOption.panel }}>
              Order summary
            </p>
            <h2 className="mt-3 text-2xl font-black">{productName}</h2>
            <div className="mt-6 space-y-3 text-white/75">
              <SummaryRow label="Quantity" value={String(quantity)} />
              <SummaryRow label="Flavor" value={selectedFlavor} />
              <SummaryRow label="Price per piece" value={formatMoney(pricePerPiece)} />
              <SummaryRow label="Delivery fee" value={formatMoney(deliveryFee)} />
              <SummaryRow label="Payment method" value="Cash On Delivery" />
              <SummaryRow label="Total" value={formatMoney(totalPrice)} strong />
            </div>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 leading-7 text-white/76">
              Your details are submitted securely through the server. No payment is collected online.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-bold text-charcoal">{label}</span>
      {children}
      {error ? <span className="text-sm font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-charcoal/60">{label}</span>
      <input readOnly value={value} className="w-full rounded-2xl border border-leaf/10 bg-white px-4 py-3 font-bold text-charcoal" />
    </label>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-white/15 pt-3 text-xl font-black text-white" : "font-semibold"}`}>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
