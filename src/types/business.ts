export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  id: string;
  day_of_week: DayOfWeek;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BlockedDate {
  id: string;
  date: Date;
  reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSchedule {
  regularHours: BusinessHours[];
  blockedDates: BlockedDate[];
  holidays: BlockedDate[];
}
