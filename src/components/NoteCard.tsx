import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock, Edit, Trash2, RotateCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  color?: string;
  onClick?: () => void;
  clickable?: boolean;
  onRestore?: () => void;
  onDelete?: () => void;
}

const NoteCard = ({ id, title, content, lastModified, color = "bg-card", onClick, clickable, onRestore, onDelete }: NoteCardProps) => {
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;
  const showClock = !!lastModified;
  return (
    <Card
      className={`group relative p-6 bg-gradient-card shadow-card hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 border border-border dark:bg-gradient-to-br dark:from-[#232326] dark:via-[#18181b] dark:to-[#2d2d3a] dark:shadow-lg dark:border-border/70 ${clickable ? 'cursor-pointer hover:-translate-y-2 hover:scale-105 will-change-transform' : ''}`}
      onClick={onClick}
    >
      {(onRestore || onDelete) && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRestore ? (
                <>
                  <DropdownMenuItem onClick={onRestore}>
                    <RotateCw className="h-4 w-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Permanently
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 dark:text-white">
          {title || "Untitled Note"}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed dark:text-gray-300">
          {truncatedContent}
        </p>
        <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border/50 dark:text-gray-400">
          {showClock && <Clock className="h-3 w-3 mr-1" />}
          {lastModified}
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;