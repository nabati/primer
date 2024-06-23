export type Prompt = {
  id: string;
  content: string;
  reviews: number;
};

export type Note = {
  id: string;
  content: string;
  user_id: string;
  updated_at: Date;
  priority_id?: string;
};

export type Event = {
  id?: string;
  date: string;
  value: number;
  habit_id: string;
  user_id: string;
};

export type Action = {
  id: string;
  content: string;
  user_id: string;
  priority_id: string;
  completed_at: Date;
  created_at: Date;
};
