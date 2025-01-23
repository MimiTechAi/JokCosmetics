export type NotificationType = 'email' | 'sms' | 'whatsapp';

export interface NotificationQueue {
  id: string;
  booking_id: string;
  notification_type: NotificationType;
  recipient: string;
  message_template: string;
  sent: boolean;
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  content: string;
  variables: string[];
}
