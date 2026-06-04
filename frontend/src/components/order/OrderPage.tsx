import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderItems from "@/components/order/OrderItems";
import OrderNote from "@/components/order/OrderNote";
import OrderProgress from "@/components/order/OrderProgress";
import OrderSummary from "@/components/order/OrderSummary";
import ShippingOrder from "@/components/order/ShippingOrder";
import TrackingTimeline from "@/components/order/TrackingTimeline";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PageSection from "@/components/ui/PageSection";
import { userRoutes } from "@/lib/user-routes";

interface OrderPageProps {
  orderId?: string;
}

const OrderPage = ({ orderId = "ORD-ABC-123566-34423" }: OrderPageProps) => {
  return (
    <PageSection
      title="Order Details"
      description="Review your order, shipment progress, and delivery information."
      className="space-y-8"
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={userRoutes.orders}>Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{orderId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <OrderProgress />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] mt-6 mb-4">
        <div className="space-y-6">
          <OrderItems />
          <ShippingOrder />
          <OrderNote />
        </div>

        <div className="space-y-6">
          <OrderSummary showAction={false} showHelp={false} />
          <TrackingTimeline />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="default"
          className="gap-2 border-dark text-black"
        >
          <ArrowLeft /> <span>Kembali belanja</span>
        </Button>
      </div>
    </PageSection>
  );
};

export default OrderPage;
