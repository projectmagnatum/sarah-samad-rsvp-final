import { useState, useEffect } from 'react';
import { RSVPEntry } from '@/types/rsvp';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EditPanelProps {
  rsvp: RSVPEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<RSVPEntry>) => void;
}

export function EditPanel({ rsvp, isOpen, onClose, onSave }: EditPanelProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    attending: 'pending' as 'yes' | 'no' | 'pending',
    guestCount: 1,
    dietaryRequirements: '',
    allergies: '',
    notes: '',
  });

  useEffect(() => {
    if (rsvp) {
      setFormData({
        guestName: rsvp.guestName || '',
        email: rsvp.email || '',
        attending: rsvp.attending || 'pending',
        guestCount: rsvp.guestCount || 0,
        dietaryRequirements: rsvp.dietaryRequirements || '',
        allergies: rsvp.allergies || '',
        notes: rsvp.notes || '',
      });
    }
  }, [rsvp]);

  const handleSave = () => {
    if (rsvp) {
      onSave(rsvp.id, formData);
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className="w-full sm:max-w-md bg-background border-l border-border overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="font-script text-3xl text-heading">Edit Response</SheetTitle>
          <SheetDescription className="text-muted-foreground">Update the guest's RSVP details below.</SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6 text-heading pb-8">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input id="guestName" value={formData.guestName} onChange={(e) => setFormData(p => ({ ...p, guestName: e.target.value }))} className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] font-bold" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] text-theme placeholder:text-gray-400 font-bold placeholder:font-normal" placeholder="e.g. kate@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.attending} onValueChange={(v: any) => setFormData(p => ({ ...p, attending: v }))}>
                <SelectTrigger className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Attending</SelectItem>
                  <SelectItem value="no">Declined</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCount">Guest Count</Label>
              <Input 
                id="guestCount" type="number" min="0" max="10" 
                value={formData.guestCount} 
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData(p => ({ ...p, guestCount: parseInt(e.target.value, 10) || 0 }))} 
                className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] text-theme placeholder:text-gray-400 font-bold placeholder:font-normal" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryRequirements">Dietary Requests</Label>
            <Input id="dietaryRequirements" value={formData.dietaryRequirements} onChange={(e) => setFormData(p => ({ ...p, dietaryRequirements: e.target.value }))} className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] text-theme placeholder:text-gray-400 font-bold placeholder:font-normal" placeholder="e.g. Vegetarian..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input id="allergies" value={formData.allergies} onChange={(e) => setFormData(p => ({ ...p, allergies: e.target.value }))} className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] text-theme placeholder:text-gray-400 font-bold placeholder:font-normal" placeholder="e.g. Nuts..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="bg-[color-mix(in_srgb,var(--card)_50%,transparent)] text-theme placeholder:text-gray-400 font-normal resize-none"
              placeholder="Internal notes about this guest (guests cannot see this)"
              rows={3}
            />
          </div>
        </div>

        <SheetFooter className="mt-8 gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 bg-theme text-button-text">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}