import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRSVP } from '@/contexts/RSVPContext';
import { RSVPEntry, ViewMode } from '@/types/rsvp';
import { RSVPCard } from '@/components/wedding/RSVPCard';
import { SearchBar, FilterType } from '@/components/wedding/SearchBar';
import { EditPanel } from '@/components/wedding/EditPanel';
import { DeleteConfirmDialog } from '@/components/wedding/DeleteConfirmDialog';
import { cn } from '@/lib/utils';

export default function ResponsesPage() {
  const { rsvps, updateRsvp, deleteRsvp } = useRSVP();
  const [searchParams] = useSearchParams();
  
  // Get filter from URL (e.g., ?filter=diet_allergy)
  const filterFromUrl = searchParams.get('filter') as FilterType;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Initialize state from URL if present, otherwise default to 'all'
  const [filterType, setFilterType] = useState<FilterType>(filterFromUrl || 'all');
  const [editingRsvp, setEditingRsvp] = useState<RSVPEntry | null>(null);
  const [deletingRsvp, setDeletingRsvp] = useState<RSVPEntry | null>(null);

  // Sync state if the URL changes while the user is already on the page
  useEffect(() => {
    if (filterFromUrl) {
      setFilterType(filterFromUrl);
    }
  }, [filterFromUrl]);

  // === REFINED FILTERING LOGIC ===
  const filteredRsvps = useMemo(() => {
    let data = [...rsvps]; // Use spread to ensure we're working with a fresh copy

    // 1. Apply Dropdown/Tab Filter
    if (filterType !== 'all') {
      data = data.filter(rsvp => {
        if (filterType === 'attending') return rsvp.attending === 'yes';
        if (filterType === 'declined') return rsvp.attending === 'no';
        if (filterType === 'pending') return rsvp.attending === 'pending';
        if (filterType === 'diet_allergy') {
          const hasDiet = rsvp.dietaryRequirements && rsvp.dietaryRequirements.trim().length > 0;
          const hasAllergy = rsvp.allergies && rsvp.allergies.trim().length > 0;
          return hasDiet || hasAllergy;
        }
        return true;
      });
    }

    // 2. Apply Search Query Filter (Checks Guest Name AND Email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(rsvp => {
        const nameMatch = (rsvp.guestName?.toLowerCase() || '').includes(query);
        const emailMatch = (rsvp.email?.toLowerCase() || '').includes(query);
        return nameMatch || emailMatch;
      });
    }

    return data;
  }, [rsvps, searchQuery, filterType]);

  const handleDownloadCsv = () => {
    const headers = ['Guest Name', 'Email', 'Status', 'Guest Count', 'Message', 'Dietary Req', 'Allergies', 'Date'];
    
    const rows = filteredRsvps.map(rsvp => [
      rsvp.guestName || '',
      rsvp.email || '',
      rsvp.attending || '',
      rsvp.guestCount?.toString() || '0',
      `"${(rsvp.message || '').replace(/"/g, '""')}"`,
      `"${(rsvp.dietaryRequirements || '').replace(/"/g, '""')}"`,
      `"${(rsvp.allergies || '').replace(/"/g, '""')}"`,
      new Date(rsvp.createdAt).toLocaleDateString('en-GB'),
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-rsvps-${filterType}-${new Date().toISOString().split('T')[0]}.csv`;
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <h1 className="font-sans font-bold text-[18px] sm:text-5xl text-heading uppercase tracking-tight">
            RESPONSES
          </h1>
          <span className="flex items-center justify-center min-w-[2rem] h-8 sm:h-10 px-2.5 rounded-lg bg-accent text-white text-sm sm:text-base font-semibold">
            {filteredRsvps.length}
          </span>
        </div>
        <p className="mt-2 text-muted-foreground">
          Manage all your guest responses in one place.
        </p>
      </motion.div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onDownloadCsv={handleDownloadCsv}
        filterType={filterType}
        onFilterChange={setFilterType}
      />

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

      {filteredRsvps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-lg text-muted-foreground font-medium">
            {searchQuery 
              ? `No guests found matching "${searchQuery}"` 
              : filterType !== 'all'
                ? `No guests found for this filter.`
                : 'No responses yet.'}
          </p>
        </motion.div>
      )}

      <EditPanel
        rsvp={editingRsvp}
        isOpen={!!editingRsvp}
        onClose={() => setEditingRsvp(null)}
        onSave={updateRsvp}
      />

      <DeleteConfirmDialog
        rsvp={deletingRsvp}
        isOpen={!!deletingRsvp}
        onClose={() => setDeletingRsvp(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}