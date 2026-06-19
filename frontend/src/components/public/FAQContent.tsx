"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqApi } from "@/server/modules/faq/api";
import type { FAQ } from "@/server/modules/faq/types";

const FAQContent = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    // Fetch active FAQs, sorted correctly if backend supports it
    faqApi.getAll({ is_active: true, page_size: 100 })
      .then((res) => {
        if (isMounted) {
          const faqList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          if (Array.isArray(faqList) && faqList.length > 0) {
            // Sort them by sort_order
            const sortedFaqs = [...faqList].sort((a, b) => a.sort_order - b.sort_order);
            setFaqs(sortedFaqs);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex border-b border-t py-8 justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="flex border-b py-8 text-center text-slate-500 justify-center">
        Belum ada FAQ yang tersedia.
      </div>
    );
  }

  return (
    <div className="flex border-b w-full">
      <Accordion type="single" collapsible defaultValue={`faq-${faqs[0]?.id}`} className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
            <AccordionTrigger className="text-left font-medium text-slate-800">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQContent;
