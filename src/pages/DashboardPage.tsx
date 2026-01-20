import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, UserCheck, Inbox, Utensils, AlertCircle } from 'lucide-react';
import { useRSVP } from '@/contexts/RSVPContext';
import { StatCard } from '@/components/wedding/StatCard';
import { RSVPCard } from '@/components/wedding/RSVPCard';

export default function DashboardPage() {
  const { rsvps, stats } = useRSVP();
  
  // 1. Calculate Dietary & Allergy Counts
  const dietaryCount = useMemo(() => {
    return rsvps.filter(r => r.dietaryRequirements && r.dietaryRequirements.trim().length > 0).length;
  }, [rsvps]);

  const allergyCount = useMemo(() => {
    return rsvps.filter(r => r.allergies && r.allergies.trim().length > 0).length;
  }, [rsvps]);

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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Standard Cards (Always Visible) */}
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

        {/* CONDITIONAL: Dietary Requests Card */}
        {dietaryCount > 0 && (
          <StatCard
            title="Dietary Requests"
            value={dietaryCount}
            icon={Utensils}
            delay={0.4}
            // ADDED: Custom background color
            className="bg-[#fcf1ce] border-[#f2c722]"
            action={
              <a href="/responses?filter=diet_allergy" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
                See All &rarr;
              </a>
            }
          />
        )}

        {/* CONDITIONAL: Allergies Card */}
        {allergyCount > 0 && (
          <StatCard
            title="Allergies"
            value={allergyCount}
            icon={AlertCircle}
            delay={0.5}
            // ADDED: Custom background color. 
            // Note: You might need to add 'text-white' here if the default text isn't readable against the dark pink.
            className="bg-[#f6e3e3] border-[#e57373]" 
            action={
               <a href="/responses?filter=diet_allergy" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
                See All &rarr;
              </a>
            }
          />
        )}
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
          // Empty State Card
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
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}