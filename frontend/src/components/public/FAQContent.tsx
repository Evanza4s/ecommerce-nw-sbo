import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQContent = () => {
  return (
    <div className="flex border-b">
      <Accordion type="single" collapsible defaultValue="faq">
        <AccordionItem value="faq">
          <AccordionTrigger>Apakah produk ini asli?</AccordionTrigger>
          <AccordionContent>lorem ipsum</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq1">
          <AccordionTrigger>Apakah produk ini asli?</AccordionTrigger>
          <AccordionContent>lorem ipsum</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq2">
          <AccordionTrigger>Apakah produk ini asli?</AccordionTrigger>
          <AccordionContent>lorem ipsum</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq3">
          <AccordionTrigger>Apakah produk ini asli?</AccordionTrigger>
          <AccordionContent>lorem ipsum</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQContent;
