import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

const PageSection = ({
  children,
  title,
  description,
  className,
  headerClassName,
  contentClassName,
}: PageSectionProps) => {
  return (
    <section className={cn("px-8 py-16 md:px-12 lg:px-20", className)}>
      {(title || description) && (
        <div className={cn("mb-8", headerClassName)}>
          {title ? (
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold text-dark">{title}</h1>
              {description ? (
                <p className="text-dark/60 max-w-3xl">{description}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
};

export default PageSection;
