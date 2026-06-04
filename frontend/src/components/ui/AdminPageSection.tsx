import { cn } from '@/lib/utils';
import { ReactNode } from 'react'

type AdminPageSectionProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

const AdminPageSection = ({
  children,
  title,
  description,
  className,
  headerClassName,
  contentClassName,
}: AdminPageSectionProps) => {
  return (
        <section className={cn("px-4 py-8 md:px-8 lg:px-12", className)}>
          {(title || description) && (
            <div className={cn("mb-4", headerClassName)}>
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
  )
}

export default AdminPageSection