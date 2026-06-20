export interface Resume {
  id: string;
  user_id: string;
  name: string;
  file_url: string | null;
  description: string | null;
  created_at: string;
}
