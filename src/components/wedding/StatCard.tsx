import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
  action?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, delay = 0, action, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn("glass-card rounded-2xl p-6 sm:p-8 relative", className)}
    >
      <div className="flex justify-between h-full">
        {/* LEFT SIDE: Title & Value */}
        <div className="flex flex-col justify-between">
          <p className="text-sm font-medium text-heading uppercase tracking-wider relative z-10">
            {title}
          </p>
          
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              delay: delay + 0.2,
            }}
            className="mt-4 text-4xl sm:text-5xl font-light text-foreground relative z-10"
          >
            {value}
          </motion.p>
        </div>
        
        {/* RIGHT SIDE: Icon & Link */}
        <div className="flex flex-col items-end justify-between ml-4">
          <div className="p-3 rounded-xl bg-accent/10 relative z-10">
            <Icon className="w-6 h-6 text-accent" />
          </div>

          {action && (
            <div className="relative z-10 mt-5">
              {action}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}