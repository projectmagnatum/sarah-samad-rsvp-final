export interface RSVPEntry {
  id: string;
  wedding_id?: string;
  guestName: string;
  email: string;
  attending: 'yes' | 'no' | 'pending';
  guestCount: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  isNew?: boolean;
  
  // This is the property typescript was complaining about:
  isDeleted?: boolean; 
}

export type ViewMode = 'grid' | 'list';