import { cn } from "@/lib/utils";
import { animated } from "@react-spring/web";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/5", className)}
      {...props}
    />
  );
}

export const AnimatedSkeleton = animated(Skeleton);

export { Skeleton };
