import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, CURRENT_WEDDING_ID } from '@/lib/supabase';
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

  const fetchRSVPs = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select(`
          id, wedding_id, guestName, email, attending, guestCount,
          message, createdAt, updatedAt, isDeleted, allergies, dietaryRequirements, notes
        `)
        .eq('wedding_id', CURRENT_WEDDING_ID)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      setAllEntries((data as any) || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
    fetchRSVPs();
    const channel = supabase
      .channel('rsvp_dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps', filter: `wedding_id=eq.${CURRENT_WEDDING_ID}` }, () => fetchRSVPs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const rsvps = allEntries.filter(r => !r.isDeleted);
  const deletedRsvps = allEntries.filter(r => r.isDeleted);

  const stats = {
    totalGuests: rsvps.length,
    attending: rsvps.filter(r => r.attending === 'yes').length,
    totalHeadcount: rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + (Number(r.guestCount) || 0), 0),
  };

  const addRsvp = async (newRsvp: any) => {
    if (!adminWeddingId) return;
    const { error } = await supabase.from('rsvps').insert([{
      wedding_id: adminWeddingId,
      guestName: newRsvp.guestName,
      email: newRsvp.email,
      attending: newRsvp.attending,
      guestCount: newRsvp.guestCount,
      message: newRsvp.message,
      isDeleted: false,
      dietaryRequirements: newRsvp.dietaryRequirements,
      allergies: newRsvp.allergies,
    }]);
    if (error) throw error;
  };

  const updateRsvp = async (id: string, updates: Partial<RSVPEntry>) => {
    const dbUpdates: any = { updatedAt: new Date().toISOString() };
    if (updates.guestName !== undefined) dbUpdates.guestName = updates.guestName;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.guestCount !== undefined) dbUpdates.guestCount = updates.guestCount;
    if (updates.attending !== undefined) dbUpdates.attending = updates.attending;
    if (updates.message !== undefined) dbUpdates.message = updates.message;
    if (updates.isDeleted !== undefined) dbUpdates.isDeleted = updates.isDeleted;
    if (updates.dietaryRequirements !== undefined) dbUpdates.dietaryRequirements = updates.dietaryRequirements;
    if (updates.allergies !== undefined) dbUpdates.allergies = updates.allergies;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase.from('rsvps').update(dbUpdates).eq('id', id);
    if (error) throw error;
  };

  const deleteRsvp = async (id: string) => { await updateRsvp(id, { isDeleted: true }); };
  const restoreRsvp = async (id: string) => { await updateRsvp(id, { isDeleted: false }); };
  const permanentlyDeleteRsvp = async (id: string) => { await supabase.from('rsvps').delete().eq('id', id); };
  const permanentlyDeleteAll = async () => {
    const ids = deletedRsvps.map(r => r.id);
    if (ids.length > 0) await supabase.from('rsvps').delete().in('id', ids);
  };

  return (
    <RSVPContext.Provider value={{ rsvps, deletedRsvps, addRsvp, updateRsvp, deleteRsvp, restoreRsvp, permanentlyDeleteRsvp, permanentlyDeleteAll, stats, loading }}>
      {children}
    </RSVPContext.Provider>
  );
}

export const useRSVP = () => {
  const context = useContext(RSVPContext);
  if (!context) throw new Error('useRSVP must be used within RSVPProvider');
  return context;
};