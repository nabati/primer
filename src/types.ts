export type User = {
  id: string;
};

export type Prompt = {
  id: string;
  content: string;
  reviews: number;
  lastReviewed: string;
};

export type Note = {
  id: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  priority_id: string | null;
};

export type Habit = {
  id: string;
  title: string;
  user_id: string;
  created_at: Date;
};

export type HabitEvent = {
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
  completed_at: Date | null;
  created_at: Date;
  head_id: string | null;
  indentation: number;
};

export type Priority = {
  id: string;
  title: string;
  user_id: string;
  created_at: Date;
};
