import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-accentAlt/20 dark:text-accentAlt",
        className
      )}
    >
      {children}
    </span>
  );
}
