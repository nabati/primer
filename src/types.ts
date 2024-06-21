export type Prompt = {
  id: string;
  content: string;
  reviews: number;
};

export type JournalEntry = {
  id: string;
  content: string;
  user_id: string;
};

export type Event = {
  id?: string;
  date: string;
  value: number;
  habit_id: string;
  user_id: string;
};
