import PublicSection from "@/components/ui/PublicSection";
import Card from "@/components/ui/Card";
import FAQContent from "@/components/public/FAQContent";
import PurchaseGuideContent from "@/components/public/PurchaseGuideContent";
import ShippingGuideContent from "@/components/public/ShippingGuideContent";
import { useState } from "react";
import Modal from "@/components/forms/Modal";

const helpTopics = [
  {
    id: "faq",
    title: "Frequently Asked Question",
    description:
      "Panduan dari tiap pertanyaan tentang NeoWaves yang sering diajukan oleh pelanggan lainnya.",
    content: <FAQContent />,
  },
  {
    id: "guide",
    title: "How to complete your purchase",
    description:
      "Panduan langkah demi langkah untuk menyelesaikan pesanan Anda dengan aman.",
    content: <PurchaseGuideContent />,
  },
  {
    id: "shipping",
    title: "Shipping Options",
    description:
      "Informasi lengkap mengenai pilihan kurir dan estimasi waktu pengiriman barang.",
    content: <ShippingGuideContent />,
  },
];

const FAQPage = () => {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const activeTopic = helpTopics.find((topic) => topic.id === activeModalId);

  return (
    <PublicSection title="Service for help your shopping">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
        {helpTopics.map((topic, index) => (
          <div key={index} onClick={() => setActiveModalId(topic.id)} className="group cursor-pointer">
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div className="flex flex-col gap-2 px-6 py-8">
                <h3 className="text-2xl font-bold">
                  {topic.title}
                </h3>
                <p className="text-sm text-dark">
                  {topic.description}
                </p>
              </div>
              <div className="aspect-square rounded-b-2xl bg-dark/5" />
            </Card>
          </div>
        ))}
      </div>
      <Modal
        isOpen={activeModalId !== null}
        onClose={() => setActiveModalId(null)}
        title={activeTopic?.title}
      >
        <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">
          {activeTopic?.content}
        </div>
      </Modal>
    </PublicSection>
  );
};

export default FAQPage;
