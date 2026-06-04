import { cn } from "@/lib/utils";
import PageSection from "./PageSection";
import { ReactNode } from "react";

type PublicSectionProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

const PublicSection = ({
  children,
  title,
  description,
  className,
  headerClassName,
  contentClassName,
}: PublicSectionProps) => {
  return (
    <PageSection
      title={title}
      description={description}
      className={cn("px-4 py-16 md:px-8 lg:px-20", className)}
      headerClassName={headerClassName}
      contentClassName={contentClassName}
    >
      {children}
    </PageSection>
  );
};

export default PublicSection;
