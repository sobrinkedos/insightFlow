import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center rounded-lg border-2 border-dashed bg-card/30", className)}>
      <div className="flex flex-col items-center gap-4 text-center p-8">
        <div className="rounded-full bg-primary/10 p-4">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="max-w-md text-muted-foreground">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
