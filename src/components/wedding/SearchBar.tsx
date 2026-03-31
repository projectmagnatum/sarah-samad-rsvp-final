import { Search, Download, LayoutGrid, List, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/rsvp';
import { cn } from '@/lib/utils';

export type FilterType = 'all' | 'attending' | 'declined' | 'pending' | 'diet_allergy';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDownloadCsv: () => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onDownloadCsv,
  filterType,
  onFilterChange,
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-4 mb-8 w-full"
    >
      {/* 1. Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search guests by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-base bg-[color-mix(in_srgb,var(--card)_50%,transparent)] border-[color-mix(in_srgb,var(--border)_50%,transparent)] focus:border-[color-mix(in_srgb,var(--theme)_50%,transparent)] rounded-xl w-full"
        />
      </div>

      {/* 2. Actions Toolbar */}
      <div className="flex flex-row items-center w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] p-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "rounded-lg px-3 h-8",
                viewMode === 'grid' 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "rounded-lg px-3 h-8",
                viewMode === 'list' 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={onDownloadCsv}
            className="h-10 px-4 bg-theme text-button-text hover:bg-[color-mix(in_srgb,var(--theme)_80%,transparent)] rounded-xl gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
        </div>

        <div className="flex-grow" />

        {/* RIGHT GROUP: Filter Dropdown */}
        <div className="relative h-10 min-w-[180px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-heading pointer-events-none z-10">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={filterType}
            onChange={(e) => {
              onFilterChange(e.target.value as FilterType);
              // ADDED: This removes the focus/active highlight after selection
              e.target.blur();
            }}
            className="h-full w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] transition-colors"
          >
            <option value="all">All Entries</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
            <option value="diet_allergy">Diet &amp; Allergy</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-10">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}