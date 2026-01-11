import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { RSVPEntry } from '@/types/rsvp';

interface RSVPContextType {
  rsvps: RSVPEntry[];
  deletedRsvps: RSVPEntry[];
  addRsvp: (rsvp: Omit<RSVPEntry, 'id' | 'createdAt' | 'updatedAt' | 'wedding_id'>) => Promise<void>;
  updateRsvp: (id: string, updates: Partial<RSVPEntry>) => Promise<void>;
  deleteRsvp: (id: string) => Promise<void>;
  restoreRsvp: (id: string) => Promise<void>;
  permanentlyDeleteRsvp: (id: string) => Promise<void>;
  permanentlyDeleteAll: () => Promise<void>;
  stats: {
    totalGuests: number;
    attending: number;
    totalHeadcount: number;
  };
  loading: boolean;
}

const RSVPContext = createContext<RSVPContextType | undefined>(undefined);

export function RSVPProvider({ children }: { children: ReactNode }) {
  const [allEntries, setAllEntries] = useState<RSVPEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminWeddingId, setAdminWeddingId] = useState<string | null>(null);

  // 0. Helper: Fetch the Admin's Wedding ID
  const fetchAdminDetails = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_permissions')
      .select('wedding_id')
      .eq('user_id', user.id)
      .single();

    if (data) setAdminWeddingId(data.wedding_id);
  };

  // 1. Fetch Data
  const fetchRSVPs = async () => {
    try {
      // selecting columns EXACTLY as they appear in your database screenshot
      const { data, error } = await supabase
        .from('rsvps')
        .select(`
          id,
          wedding_id,
          guestName,
          attending,
          guestCount,
          message,
          createdAt,
          updatedAt,
          isDeleted
        `)
        // CRITICAL FIX: Using 'createdAt' (camelCase) to match your DB
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setAllEntries((data as any) || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Realtime Listener & Initial Load
  useEffect(() => {
    fetchAdminDetails();
    fetchRSVPs();

    const channel = supabase
      .channel('rsvp_dashboard_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'rsvps' 
        },
        () => fetchRSVPs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Filter Active vs Deleted
  const rsvps = allEntries.filter(r => !r.isDeleted);
  const deletedRsvps = allEntries.filter(r => r.isDeleted);

  // 4. Stats
  const stats = {
    totalGuests: rsvps.length,
    attending: rsvps.filter(r => r.attending === 'yes').length,
    totalHeadcount: rsvps
      .filter(r => r.attending === 'yes')
      .reduce((sum, r) => sum + (Number(r.guestCount) || 0), 0),
  };

  // 5. Database Actions

  const addRsvp = async (newRsvp: any) => {
    if (!adminWeddingId) {
      console.error("Cannot add guest: Admin wedding ID not found");
      return;
    }

    const dbPayload = {
      wedding_id: adminWeddingId,     // snake_case
      guestName: newRsvp.guestName,   // camelCase
      attending: newRsvp.attending,
      guestCount: newRsvp.guestCount, // camelCase
      message: newRsvp.message,
      isDeleted: false,               // camelCase
      // createdAt is usually handled by default in DB, but if your DB expects it:
      // createdAt: new Date().toISOString()
    };

    const { error } = await supabase.from('rsvps').insert([dbPayload]);
    if (error) throw error;
  };

  const updateRsvp = async (id: string, updates: Partial<RSVPEntry>) => {
    const dbUpdates: any = { updatedAt: new Date().toISOString() };
    
    if (updates.guestName) dbUpdates.guestName = updates.guestName;
    if (updates.guestCount) dbUpdates.guestCount = updates.guestCount;
    if (updates.attending) dbUpdates.attending = updates.attending;
    if (updates.message) dbUpdates.message = updates.message;
    if (updates.isDeleted !== undefined) dbUpdates.isDeleted = updates.isDeleted;

    const { error } = await supabase
      .from('rsvps')
      .update(dbUpdates)
      .eq('id', id);
    if (error) throw error;
  };

  const deleteRsvp = async (id: string) => {
    await updateRsvp(id, { isDeleted: true });
  };

  const restoreRsvp = async (id: string) => {
    await updateRsvp(id, { isDeleted: false });
  };

  const permanentlyDeleteRsvp = async (id: string) => {
    const { error } = await supabase.from('rsvps').delete().eq('id', id);
    if (error) throw error;
  };

  const permanentlyDeleteAll = async () => {
    const idsToDelete = deletedRsvps.map(r => r.id);
    if (idsToDelete.length === 0) return;
    
    const { error } = await supabase.from('rsvps').delete().in('id', idsToDelete);
    if (error) throw error;
  };

  return (
    <RSVPContext.Provider value={{
      rsvps, deletedRsvps, addRsvp, updateRsvp, deleteRsvp, 
      restoreRsvp, permanentlyDeleteRsvp, permanentlyDeleteAll, stats, loading
    }}>
      {children}
    </RSVPContext.Provider>
  );
}

export function useRSVP() {
  const context = useContext(RSVPContext);
  if (!context) throw new Error('useRSVP must be used within RSVPProvider');
  return context;
}