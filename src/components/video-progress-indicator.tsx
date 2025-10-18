import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoProgress } from "@/types/database";

interface VideoProgressIndicatorProps {
  progress: VideoProgress | null;
  className?: string;
  showLabel?: boolean;
}

export function VideoProgressIndicator({ 
  progress, 
  className,
  showLabel = false 
}: VideoProgressIndicatorProps) {
  if (!progress) return null;

  const percentage = progress.progress_percentage || 0;
  const isCompleted = progress.completed;

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Completo</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                <span>Em progresso</span>
              </>
            )}
          </div>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            isCompleted ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
