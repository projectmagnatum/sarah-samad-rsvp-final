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
  isDeleted?: boolean; 
  
  // UPDATED: Matching your database column names exactly
  dietaryRequirements?: string; 
  allergies?: string;
}

export type ViewMode = 'grid' | 'list';