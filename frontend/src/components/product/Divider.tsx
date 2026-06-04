import { cn } from "@/lib/utils";

type DividerProps = {
  className?: string;
};

const Divider = ({
  className,
}: DividerProps) => {
  return (
    <div
      className={cn(
        "flex my-16 items-start h-2 border-primary w-3/4 bg-linear-to-r from-primary via-dark to-primary-divider",
        className
      )}
    />
  );
};

export default Divider;
