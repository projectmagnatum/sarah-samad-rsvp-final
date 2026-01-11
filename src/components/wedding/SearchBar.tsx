import { Search, Download, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types/rsvp';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDownloadCsv: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onDownloadCsv,
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 mb-8"
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search guests by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-base bg-card/50 border-border/50 focus:border-primary/50 rounded-xl"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <div className="flex items-center rounded-xl bg-muted/50 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "rounded-lg px-3",
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
              "rounded-lg px-3",
              viewMode === 'list' 
                ? "bg-card shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Download CSV */}
        <Button
          onClick={onDownloadCsv}
          className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download CSV</span>
        </Button>
      </div>
    </motion.div>
  );
}
