import { useState, useEffect } from 'react';
import { RSVPEntry } from '@/types/rsvp';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditPanelProps {
  rsvp: RSVPEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<RSVPEntry>) => void;
}

export function EditPanel({ rsvp, isOpen, onClose, onSave }: EditPanelProps) {
  // REMOVED: email and message from initial state
  const [formData, setFormData] = useState({
    guestName: '',
    attending: 'pending' as 'yes' | 'no' | 'pending',
    guestCount: 1,
  });

  useEffect(() => {
    if (rsvp) {
      setFormData({
        guestName: rsvp.guestName,
        // REMOVED: email and message mapping
        attending: rsvp.attending,
        guestCount: rsvp.guestCount,
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
        className="w-full sm:max-w-md bg-background border-l border-border"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="font-script text-3xl text-heading">
            Edit Response
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Update the guest's RSVP details below.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6 text-heading">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="bg-card/50"
            />
          </div>

          {/* REMOVED: Email Input Field */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.attending}
                onValueChange={(value: 'yes' | 'no' | 'pending') => 
                  setFormData(prev => ({ ...prev, attending: value }))
                }
              >
                <SelectTrigger className="bg-card/50">
                  <SelectValue />
                </SelectTrigger>
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
                id="guestCount"
                type="number"
                min="0"
                max="10"
                value={formData.guestCount}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  guestCount: parseInt(e.target.value) || 0 
                }))}
                className="bg-card/50"
              />
            </div>
          </div>

          {/* REMOVED: Message Textarea Field */}
          
        </div>

        <SheetFooter className="mt-8 gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-theme text-button-text">
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}