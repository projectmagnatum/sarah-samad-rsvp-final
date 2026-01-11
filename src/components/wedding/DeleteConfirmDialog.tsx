import { AlertTriangle } from 'lucide-react';
import { RSVPEntry } from '@/types/rsvp';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  rsvp: RSVPEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isPermanent?: boolean;
}

export function DeleteConfirmDialog({ 
  rsvp, 
  isOpen, 
  onClose, 
  onConfirm,
  isPermanent = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center font-script text-2xl">
            {isPermanent ? 'Permanently Delete?' : 'Delete Response?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {isPermanent ? (
              <>
                This will permanently remove <span className="font-medium text-foreground">{rsvp?.guestName}</span>'s response. This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete <span className="font-medium text-foreground">{rsvp?.guestName}</span>'s response? You can restore it later from the Deleted section.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => rsvp && onConfirm(rsvp.id)}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPermanent ? 'Delete Forever' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
