export type TNotification = {
  id: number;
  notifiable_type: string;
  notifiable_id: number;
  apps: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at: string;
  created_at: string;
  updated_at: string;
};
