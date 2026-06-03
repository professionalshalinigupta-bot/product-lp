"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { product } from "@/lib/product";

type CTAButtonProps = {
  quantity?: number;
  flavor?: string;
  label?: string;
  className?: string;
};

export function CTAButton({ quantity = 1, flavor = product.flavors[0], label = "Order Now", className = "" }: CTAButtonProps) {
  const router = useRouter();

  const goToCheckout = () => {
    const params = new URLSearchParams({
      productName: product.name,
      flavor,
      quantity: String(quantity),
      pricePerPiece: String(product.price),
      deliveryFee: String(product.deliveryFee),
      totalPrice: String(product.price * quantity + product.deliveryFee)
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={goToCheckout}
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3 text-base font-bold text-white shadow-lg shadow-leaf/20 transition hover:-translate-y-0.5 hover:bg-[#286b4b] ${className}`}
    >
      <ShoppingBag size={19} />
      {label}
    </button>
  );
}
