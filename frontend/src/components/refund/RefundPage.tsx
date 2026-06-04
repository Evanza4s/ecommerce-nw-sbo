import FormRefund from "@/components/refund/FormRefund";
import RefundHelp from "@/components/refund/RefundHelp";
import RefundPolicy from "@/components/refund/RefundPolicy";
import RefundRequest from "@/components/refund/RefundRequest";
import RefundSummary from "@/components/refund/RefundSummary";
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

interface RefundPageProps {
  orderId?: string;
}

const RefundPage = ({ orderId = "ORD-ABC-123566-34423" }: RefundPageProps) => {
  const orderDetailHref = userRoutes.orderDetail(orderId);

  return (
    <PageSection
      title="Refund Request"
      description="Submit a refund request for your order"
      className="space-y-8"
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={userRoutes.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={userRoutes.orders}>Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={orderDetailHref}>{orderId}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Refund Request</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <RefundRequest />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <FormRefund />
        </div>

        <div className="space-y-6">
          <RefundSummary />
          <RefundPolicy />
          <RefundHelp />
        </div>
      </div>
    </PageSection>
  );
};

export default RefundPage;
