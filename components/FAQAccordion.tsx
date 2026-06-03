"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-leaf/10 rounded-3xl border border-leaf/10 bg-white shadow-soft">
      {faqs.map((faq, index) => (
        <div key={faq.question}>
          <button
            type="button"
            onClick={() => setOpen(open === index ? -1 : index)}
            className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-bold text-charcoal sm:px-7"
          >
            <span>{faq.question}</span>
            <ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180" : ""}`} size={20} />
          </button>
          {open === index ? <p className="px-5 pb-5 leading-7 text-charcoal/70 sm:px-7">{faq.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
