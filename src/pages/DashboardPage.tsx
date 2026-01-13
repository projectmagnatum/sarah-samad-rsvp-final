import { motion } from 'framer-motion';
import { Users, Heart, UserCheck, Inbox } from 'lucide-react';
import { useRSVP } from '@/contexts/RSVPContext';
import { StatCard } from '@/components/wedding/StatCard';
import { RSVPCard } from '@/components/wedding/RSVPCard';

export default function DashboardPage() {
  const { rsvps, stats } = useRSVP();
  
  // Get 3 most recent responses for preview
  const recentRsvps = rsvps.slice(0, 3);

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="font-sans font-bold text-[18px] sm:text-5xl text-heading">
          DASHBOARD
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's an overview of your wedding responses.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Entries" 
          value={stats.totalGuests}
          icon={UserCheck} 
          delay={0.1}
        />
        <StatCard
          title="Joyfully Accepting"
          value={stats.attending}
          icon={Heart}
          delay={0.2}
        />
        <StatCard
          title="Total Headcount"
          value={stats.totalHeadcount}
          icon={Users}
          delay={0.3}
        />
      </div>

      {/* Recent Responses Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-[14px] text-heading">
            RECENT RESPONSES
          </h2>
          <a 
            href="/responses" 
            className="text-sm text-accent hover:underline underline-offset-4"
          >
            View all →
          </a>
        </div>

        {recentRsvps.length === 0 ? (
          // NEW: Empty State Card
          <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/50 bg-muted/20">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-sans text-lg font-medium text-foreground">
              No Responses Yet
            </h3>
            <p className="text-muted-foreground mt-1 max-w-xs">
              When guests RSVP, their responses will appear here instantly.
            </p>
          </div>
        ) : (
          // Existing Grid
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentRsvps.map((rsvp, index) => (
              <RSVPCard
                key={rsvp.id}
                rsvp={rsvp}
                index={index}
                viewMode="grid"
                // No onEdit or onDelete passed here, so icons will be hidden
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}