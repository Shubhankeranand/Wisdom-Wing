import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-border bg-surface p-5 shadow-soft transition hover:shadow-glow",
        className
      )}
      {...props}
    />
  );
}
