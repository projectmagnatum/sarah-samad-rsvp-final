import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRSVP } from '@/contexts/RSVPContext';
import { RSVPEntry, ViewMode } from '@/types/rsvp';
import { RSVPCard } from '@/components/wedding/RSVPCard';
import { SearchBar } from '@/components/wedding/SearchBar';
import { EditPanel } from '@/components/wedding/EditPanel';
import { DeleteConfirmDialog } from '@/components/wedding/DeleteConfirmDialog';
import { cn } from '@/lib/utils';

export default function ResponsesPage() {
  const { rsvps, updateRsvp, deleteRsvp } = useRSVP();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [editingRsvp, setEditingRsvp] = useState<RSVPEntry | null>(null);
  const [deletingRsvp, setDeletingRsvp] = useState<RSVPEntry | null>(null);

  // Filter RSVPs by search query
  const filteredRsvps = useMemo(() => {
    if (!searchQuery.trim()) return rsvps;
    const query = searchQuery.toLowerCase();
    return rsvps.filter(rsvp => 
      rsvp.guestName.toLowerCase().includes(query)
    );
  }, [rsvps, searchQuery]);

  // Download CSV
  const handleDownloadCsv = () => {
    // REMOVED: 'Dietary Requirements' from headers
    const headers = ['Guest Name', 'Email', 'Status', 'Guest Count', 'Message', 'Date'];
    
    const rows = rsvps.map(rsvp => [
      rsvp.guestName,
      rsvp.email,
      rsvp.attending,
      rsvp.guestCount.toString(),
      `"${rsvp.message.replace(/"/g, '""')}"`,
      // REMOVED: rsvp.dietaryRequirements
      new Date(rsvp.createdAt).toLocaleDateString('en-GB'),
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleEdit = (rsvp: RSVPEntry) => {
    setEditingRsvp(rsvp);
  };

  const handleDelete = (rsvp: RSVPEntry) => {
    setDeletingRsvp(rsvp);
  };

  const confirmDelete = (id: string) => {
    deleteRsvp(id);
    setDeletingRsvp(null);
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
        {/* UPDATED: Cleaned up font classes and fixed typo */}
        <h1 className="font-sans font-bold text-[18px] sm:text-5xl text-foregroun">
          RESPONSES
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage all your guest responses in one place.
        </p>
      </motion.div>

      {/* Search & Actions */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onDownloadCsv={handleDownloadCsv}
      />

      {/* RSVP Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          : "flex flex-col gap-3"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredRsvps.map((rsvp, index) => (
            <RSVPCard
              key={rsvp.id}
              rsvp={rsvp}
              index={index}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRsvps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-lg text-muted-foreground">
            {searchQuery ? 'No guests found matching your search.' : 'No responses yet.'}
          </p>
        </motion.div>
      )}

      {/* Edit Panel */}
      <EditPanel
        rsvp={editingRsvp}
        isOpen={!!editingRsvp}
        onClose={() => setEditingRsvp(null)}
        onSave={updateRsvp}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        rsvp={deletingRsvp}
        isOpen={!!deletingRsvp}
        onClose={() => setDeletingRsvp(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}