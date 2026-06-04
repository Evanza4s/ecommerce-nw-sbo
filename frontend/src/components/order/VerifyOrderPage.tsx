import DeliveryInfo from "@/components/checkout/DeliveryInfo";
import DeliverySuccess from "@/components/checkout/DeliverySuccess";
import { VerificationAction } from "@/components/order";
import OrderItems from "@/components/order/OrderItems";
import OrderSummary from "@/components/order/OrderSummary";
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

interface VerifyOrderPageProps {
  orderId?: string;
}

const VerifyOrderPage = ({
  orderId = "ORD-ABC-123566-34423",
}: VerifyOrderPageProps) => {
  return (
    <PageSection
      title="Verifikasi Pesanan Diterima"
      description="Konfirmasi bahwa pesanan Anda telah diterima dengan baik."
    >
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
            <BreadcrumbLink href={userRoutes.orderDetail(orderId)}>{orderId}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Verifikasi Order</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] mt-6">
        <div className="space-y-6">
          <DeliverySuccess />
          <OrderItems />
          <DeliveryInfo />
          <VerificationAction />
        </div>
        <div className="space-y-6">
          <OrderSummary />
        </div>
      </div>
    </PageSection>
  );
};

export default VerifyOrderPage;
