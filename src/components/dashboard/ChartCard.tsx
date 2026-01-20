import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  className,
}: ChartCardProps) {
  return (
    <div className={cn("chart-container", className)}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
