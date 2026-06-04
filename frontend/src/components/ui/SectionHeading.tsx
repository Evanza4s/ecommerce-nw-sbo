import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

const SectionHeading = ({
  title,
  description,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h2 className="text-3xl font-bold">{title}</h2>
      {description ? (
        <p className="text-dark/60 max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
