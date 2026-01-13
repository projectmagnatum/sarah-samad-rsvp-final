import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, Trash2, RotateCcw, Users } from 'lucide-react';
import { RSVPEntry } from '@/types/rsvp';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RSVPCardProps {
  rsvp: RSVPEntry;
  index: number;
  onEdit?: (rsvp: RSVPEntry) => void;
  onDelete?: (rsvp: RSVPEntry) => void;
  onRestore?: (rsvp: RSVPEntry) => void;
  isDeletedView?: boolean;
  viewMode?: 'grid' | 'list';
}

export function RSVPCard({
  rsvp,
  index,
  onEdit,
  onDelete,
  onRestore,
  isDeletedView = false,
  viewMode = 'grid',
}: RSVPCardProps) {
  const statusConfig = {
    yes: { label: 'Attending', className: 'badge-attending' },
    no: { label: 'Declined', className: 'badge-declined' },
    pending: { label: 'Pending', className: 'badge-pending' },
  };

  const status = statusConfig[rsvp.attending];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        // REMOVED: boxShadow: rsvp.isNew ? 'var(--glow-gold)' : undefined,
      }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass-card rounded-2xl overflow-hidden transition-shadow duration-300",
        // REMOVED: rsvp.isNew && "glow-new",
        viewMode === 'list' && "flex flex-col p-4 gap-2 items-center"
      )}
    >
      {viewMode === 'grid' ? (
        /* ================= GRID VIEW ================= */
        <>
          <div className="p-6 pb-4 border-b border-border/50 bg-theme/5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-script text-2xl text-foreground break-words leading-tight">
                  {rsvp.guestName}
                </h3>
                {rsvp.attending === 'yes' && (
                  <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-sm">{rsvp.guestCount} guest{rsvp.guestCount !== 1 && 's'}</span>
                  </div>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={cn("shrink-0 font-medium", status.className)}
              >
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="p-6 pt-4">
            <p className="font-serif italic text-lg text-foreground/90 leading-relaxed min-h-[4.5rem]">
              "{rsvp.message}"
            </p>
          </div>

          <div className="px-6 py-4 bg-muted/30 flex items-center justify-between border-t border-border/50">
            <time className="text-sm text-muted-foreground">
              {format(new Date(rsvp.createdAt), 'dd/MM/yyyy')}
            </time>
            <div className="flex items-center gap-1">
              {isDeletedView ? (
                onRestore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestore(rsvp)}
                    className="text-muted-foreground hover:text-primary gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-semibold text-xs tracking-wide">RESTORE</span>
                  </Button>
                )
              ) : (
                <>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(rsvp)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(rsvp)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ================= LIST VIEW ================= */
        <>
          <h3 className="font-script text-xl text-foreground text-center w-full break-words">
            {rsvp.guestName}
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <Badge 
              variant="outline" 
              className={cn("shrink-0 text-xs h-6", status.className)}
            >
              {status.label}
            </Badge>

            {rsvp.attending === 'yes' && (
              <div className="flex items-center gap-1 text-muted-foreground shrink-0 bg-muted/20 px-2 py-0.5 rounded-full">
                <Users className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{rsvp.guestCount}</span>
              </div>
            )}
            
            <time className="text-xs text-muted-foreground shrink-0 border-l border-border pl-3 ml-1">
              {format(new Date(rsvp.createdAt), 'dd/MM/yyyy')}
            </time>
            
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
              {isDeletedView ? (
                onRestore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestore(rsvp)}
                    title="Restore"
                    className="h-7 px-2 w-auto text-muted-foreground hover:text-primary gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[10px] tracking-wide">RESTORE</span>
                  </Button>
                )
              ) : (
                <>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(rsvp)}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onDelete(rsvp)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}