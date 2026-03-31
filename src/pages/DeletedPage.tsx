import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useRSVP } from '@/contexts/RSVPContext';
import { RSVPEntry } from '@/types/rsvp';
import { RSVPCard } from '@/components/wedding/RSVPCard';
import { DeleteConfirmDialog } from '@/components/wedding/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
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

export default function DeletedPage() {
  const { deletedRsvps, restoreRsvp, permanentlyDeleteRsvp, permanentlyDeleteAll } = useRSVP();
  
  const [deletingRsvp, setDeletingRsvp] = useState<RSVPEntry | null>(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleRestore = (rsvp: RSVPEntry) => {
    restoreRsvp(rsvp.id);
  };

  const handlePermanentDelete = (rsvp: RSVPEntry) => {
    setDeletingRsvp(rsvp);
  };

  const confirmPermanentDelete = (id: string) => {
    permanentlyDeleteRsvp(id);
    setDeletingRsvp(null);
  };

  const handleDeleteAll = () => {
    permanentlyDeleteAll();
    setShowDeleteAllDialog(false);
  };

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-sans font-bold text-[18px] sm:text-5xl text-heading">
              DELETED
            </h1>
            <p className="mt-2 text-muted-foreground">
              Responses you've removed. Restore or permanently delete them.
            </p>
          </div>

          {deletedRsvps.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteAllDialog(true)}
              className="text-destructive hover:text-destructive hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] border-[color-mix(in_srgb,var(--destructive)_30%,transparent)] gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Permanently
            </Button>
          )}
        </div>
      </motion.div>

      {/* Deleted Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {deletedRsvps.map((rsvp, index) => (
            <div key={rsvp.id} className="relative">
              <RSVPCard
                rsvp={rsvp}
                index={index}
                viewMode="grid"
                isDeletedView
                onRestore={handleRestore}
              />
              {/* Permanent delete button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                onClick={() => handlePermanentDelete(rsvp)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {deletedRsvps.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">
            No deleted responses
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Responses you delete will appear here for recovery.
          </p>
        </motion.div>
      )}

      {/* Single Item Delete Confirmation */}
      <DeleteConfirmDialog
        rsvp={deletingRsvp}
        isOpen={!!deletingRsvp}
        onClose={() => setDeletingRsvp(null)}
        onConfirm={confirmPermanentDelete}
        isPermanent
      />

      {/* Delete All Confirmation */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center font-script text-2xl">
              Delete All Forever?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This will permanently delete all {deletedRsvps.length} responses in the trash. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-[color-mix(in_srgb,var(--destructive)_90%,transparent)]"
            >
              Delete All Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
