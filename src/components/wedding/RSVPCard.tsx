import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, Trash2, RotateCcw, Users, StickyNote } from 'lucide-react';
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

export function RSVPCard({ rsvp, index, onEdit, onDelete, onRestore, isDeletedView = false, viewMode = 'grid' }: RSVPCardProps) {
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
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn("glass-card rounded-2xl overflow-hidden transition-shadow duration-300", viewMode === 'list' && "flex flex-col p-4 gap-2 items-center")}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="p-6 pb-4 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[color-mix(in_srgb,var(--theme)_10%,transparent)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-script text-2xl text-foreground break-words leading-tight">{rsvp.guestName}</h3>
                {rsvp.attending === 'yes' && (
                  <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /><span className="text-sm">{rsvp.guestCount} guest{rsvp.guestCount !== 1 && 's'}</span>
                  </div>
                )}
              </div>
              <Badge variant="outline" className={cn("shrink-0 font-medium", status.className)}>{status.label}</Badge>
            </div>
          </div>
          <div className="p-6 pt-4">
            <p className="font-serif italic text-lg text-[color-mix(in_srgb,var(--foreground)_90%,transparent)] leading-relaxed min-h-[4.5rem] mb-4">"{rsvp.message}"</p>
            {(rsvp.email || rsvp.dietaryRequirements || rsvp.allergies) && (
              <div className="flex flex-col gap-2 pt-2 items-start">
                {rsvp.email && (
                  <a href={`mailto:${rsvp.email}`} className="block">
                    <Badge className={cn("bg-transparent border-1px border-heading font-bold text-theme transition-all duration-200 hover:bg-theme hover:text-white active:bg-theme active:text-white")}>
                      {rsvp.email}
                    </Badge>
                  </a>
                )}
                {rsvp.dietaryRequirements && (
                  <Badge className="border-none font-normal" style={{ backgroundColor: '#e4e1db' }}>
                    <span className="text-heading">Dietary Requests: {rsvp.dietaryRequirements}</span>
                  </Badge>
                )}
                {rsvp.allergies && (
                  <Badge className="border-none font-normal text-white" style={{ backgroundColor: '#d79696' }}>Allergies: {rsvp.allergies}</Badge>
                )}
              </div>
            )}
            {rsvp.notes && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground">
                <StickyNote className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="whitespace-pre-wrap leading-relaxed">{rsvp.notes}</p>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-[color-mix(in_srgb,var(--muted)_30%,transparent)] flex items-center justify-between border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)]">
            <time className="text-sm text-muted-foreground">{format(new Date(rsvp.createdAt), 'dd/MM/yyyy')}</time>
            <div className="flex items-center gap-1">
              {isDeletedView ? (
                onRestore && <Button variant="ghost" size="sm" onClick={() => onRestore(rsvp)} className="text-muted-foreground hover:text-primary gap-2"><RotateCcw className="w-4 h-4" /><span className="font-semibold text-xs tracking-wide">RESTORE</span></Button>
              ) : (
                <>
                  {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(rsvp)} className="text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></Button>}
                  {onDelete && <Button variant="ghost" size="sm" onClick={() => onDelete(rsvp)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-script text-xl text-foreground text-center w-full break-words">{rsvp.guestName}</h3>
          {(rsvp.email || rsvp.dietaryRequirements || rsvp.allergies) && (
            <div className="flex flex-col gap-1.5 items-center w-full py-1">
              {rsvp.email && (
                <a href={`mailto:${rsvp.email}`}>
                  <Badge className={cn("bg-transparent border-1px border-heading font-normal text-xs px-2 py-0.5 text-heading transition-all duration-200 hover:bg-theme hover:text-white active:bg-theme active:text-white")}>
                    {rsvp.email}
                  </Badge>
                </a>
              )}
              {rsvp.dietaryRequirements && (
                <Badge className="border-none font-normal text-xs px-2 py-0.5" style={{ backgroundColor: '#e4e1db' }}>
                  <span className="text-heading">Dietary Requests: {rsvp.dietaryRequirements}</span>
                </Badge>
              )}
              {rsvp.allergies && (
                <Badge className="border-none font-normal text-white text-xs px-2 py-0.5" style={{ backgroundColor: '#d79696' }}>Allergies: {rsvp.allergies}</Badge>
              )}
            </div>
          )}
          {rsvp.notes && (
            <div className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground w-full">
              <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p className="whitespace-pre-wrap leading-relaxed">{rsvp.notes}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <Badge variant="outline" className={cn("shrink-0 text-xs h-6", status.className)}>{status.label}</Badge>
            {rsvp.attending === 'yes' && <div className="flex items-center gap-1 text-muted-foreground shrink-0 bg-[color-mix(in_srgb,var(--muted)_20%,transparent)] px-2 py-0.5 rounded-full"><Users className="w-3.5 h-3.5" /><span className="text-sm font-medium">{rsvp.guestCount}</span></div>}
            <time className="text-xs text-muted-foreground shrink-0 border-l border-border pl-3 ml-1">{format(new Date(rsvp.createdAt), 'dd/MM/yyyy')}</time>
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
              {isDeletedView ? (
                onRestore && <Button variant="ghost" size="sm" onClick={() => onRestore(rsvp)} title="Restore" className="h-7 px-2 w-auto text-muted-foreground hover:text-primary gap-2"><RotateCcw className="w-3.5 h-3.5" /><span className="font-semibold text-[10px] tracking-wide">RESTORE</span></Button>
              ) : (
                <>
                  {onEdit && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(rsvp)} title="Edit"><Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" /></Button>}
                  {onDelete && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(rsvp)} title="Delete"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" /></Button>}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}