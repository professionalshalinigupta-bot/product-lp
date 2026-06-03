"use client";

import Image from "next/image";
import { CheckCircle2, Clock, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantityPicker } from "@/components/QuantityPicker";
import { discountedPrice, formatMoney, getFlavorOption, product } from "@/lib/product";
import { useState } from "react";

const trustItems = [
  { icon: ShieldCheck, label: "Cash on Delivery" },
  { icon: Truck, label: "Fast delivery" },
  { icon: Headphones, label: "Customer support" },
  { icon: Clock, label: "Easy order process" }
];

export function LandingPage() {
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState(product.flavors[0]);
  const flavorOption = getFlavorOption(flavor);
  const total = product.price * quantity + product.deliveryFee;

  return (
    <main className="overflow-hidden">
      <section style={{ backgroundColor: flavorOption.soft }}>
        <div className="container-pad grid min-h-[92vh] items-center gap-12 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <Image
                src="/logo shake.png"
                alt="shakeweight logo"
                width={190}
                height={100}
                priority
                className="h-auto w-32 sm:w-44"
              />
              <CTAButton
                label="Order Now"
                flavor={flavor}
                className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base"
              />
            </div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm" style={{ borderColor: flavorOption.panel, color: flavorOption.accent }}>
              <Sparkles size={16} />
              Same-day first order offer available
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-charcoal sm:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl" style={{ color: flavorOption.accent }}>
              {flavor} flavor. {product.headline}
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-charcoal/72">{product.subheadline}</p>
            <p className="mt-4 max-w-2xl leading-8 text-charcoal/68">{product.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton label="Purchase Now" flavor={flavor} />
              <CTAButton label="Order Now" flavor={flavor} className="bg-charcoal hover:bg-black" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-leaf/10 bg-white p-3 shadow-sm">
                  <item.icon className="mb-2" size={20} style={{ color: flavorOption.accent }} />
                  <p className="text-sm font-bold text-charcoal">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: flavorOption.glow, opacity: 0.55 }} />
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-soft transition-colors duration-300"
              style={{
                background: `radial-gradient(circle at 50% 20%, #ffffff 0%, ${flavorOption.panel} 40%, ${flavorOption.soft} 100%)`
              }}
            >
              <div className="absolute inset-6 rounded-[1.75rem] border border-white/70 bg-white/25" />
              <Image
                src={flavorOption.src}
                alt={flavorOption.alt}
                fill
                priority
                className="object-contain p-7 drop-shadow-2xl"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/88 px-4 py-3 text-center shadow-lg backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: flavorOption.accent }}>
                  Featured flavor
                </p>
                <p className="mt-1 text-2xl font-black" style={{ color: flavorOption.dark }}>
                  {flavor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pad grid gap-12 py-20 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductGallery images={product.flavorOptions} selectedFlavor={flavor} onSelectFlavor={setFlavor} />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: flavorOption.accent }}>
            Product showcase
          </p>
          <h2 className="mt-3 text-3xl font-black text-charcoal sm:text-4xl">{product.name}</h2>
          <p className="mt-4 leading-8 text-charcoal/70">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-2xl p-4" style={{ backgroundColor: flavorOption.soft }}>
                <CheckCircle2 className="mt-0.5 shrink-0" size={20} style={{ color: flavorOption.accent }} />
                <span className="font-semibold text-charcoal/82">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-3xl border border-leaf/12 bg-white p-5 shadow-soft">
            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-charcoal/60">Choose your flavor</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {product.flavors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFlavor(item)}
                    className={`focus-ring min-h-12 rounded-2xl border px-3 py-2 text-sm font-black transition ${
                      flavor === item
                        ? "text-white shadow-lg"
                        : "border-leaf/15 bg-[#f7fbf4] text-charcoal hover:border-leaf/45"
                    }`}
                    style={flavor === item ? { borderColor: flavorOption.accent, backgroundColor: flavorOption.accent } : undefined}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-charcoal/55">Price per piece</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-black text-charcoal">{formatMoney(product.price)}</span>
                  <span className="rounded-full bg-honey/20 px-3 py-1 text-sm font-bold text-charcoal">30% first-order offer</span>
                </div>
                <p className="mt-2 text-sm font-semibold" style={{ color: flavorOption.accent }}>
                  Offer price example: {formatMoney(discountedPrice())}
                </p>
              </div>
              <QuantityPicker value={quantity} onChange={setQuantity} />
            </div>
            <div className="mt-5 grid gap-2 rounded-2xl p-4 text-sm font-semibold text-charcoal/75" style={{ backgroundColor: flavorOption.soft }}>
              <div className="flex justify-between gap-4">
                <span>Selected flavor</span>
                <span>{flavor}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatMoney(product.price * quantity)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Delivery fee</span>
                <span>{formatMoney(product.deliveryFee)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-leaf/10 pt-2 text-lg font-black text-charcoal">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-charcoal/65">{product.offerText}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton quantity={quantity} flavor={flavor} label="Buy Now" />
              <CTAButton quantity={quantity} flavor={flavor} label="Order Now" className="bg-charcoal hover:bg-black" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4fbf1] py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Why buy this product</p>
            <h2 className="mt-3 text-3xl font-black text-charcoal sm:text-4xl">Feel satisfied, energized, and consistent</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.benefitDetails.map((benefit) => (
              <div key={benefit.title} className="rounded-3xl border border-leaf/10 bg-white p-6 shadow-sm">
                <CheckCircle2 className="mb-4 text-leaf" size={26} />
                <h3 className="text-xl font-black text-charcoal">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-charcoal/68">{benefit.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CTAButton flavor={flavor} label="Purchase Now" />
          </div>
        </div>
      </section>

      <section className="container-pad py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Testimonials</p>
          <h2 className="mt-3 text-3xl font-black text-charcoal sm:text-4xl">Trusted by customers building healthier routines</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {product.testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="rounded-3xl border border-leaf/10 bg-white p-6 shadow-sm">
              <blockquote className="leading-8 text-charcoal/72">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-5 font-black text-leaf">— {testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-[#f4fbf1] py-20">
        <div className="container-pad">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">FAQ</p>
            <h2 className="mt-3 text-3xl font-black text-charcoal sm:text-4xl">Questions before you order</h2>
          </div>
          <div className="mt-10">
            <FAQAccordion faqs={product.faqs} />
          </div>
        </div>
      </section>

      <section className="container-pad py-20">
        <div className="rounded-[2rem] bg-charcoal px-5 py-12 text-center text-white shadow-soft sm:px-8">
          <h2 className="mx-auto max-w-3xl text-3xl font-black sm:text-4xl">Ready to make healthy weight management simpler?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/75">
            Order shakeweight today with Cash On Delivery. Our sales representative will call you soon to confirm your order.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CTAButton
              flavor={flavor}
              label="Buy Now"
              className="border-2 border-white bg-honey text-charcoal shadow-xl shadow-black/20 hover:bg-[#f4c95c]"
            />
            <CTAButton flavor={flavor} label="Order Now" />
          </div>
        </div>
      </section>
    </main>
  );
}
