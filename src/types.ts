export interface User {
  id: string;
  name: string;
  email: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
  cycleRegularity: string;
  usageGoal: string | null;
}

export interface Cycle {
  id: string;
  userId: string;
  periodStartDate: string;
  periodEndDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: string;
  flowIntensity: string | null;
  crampsLevel: string | null;
  mood: string | null;
  symptoms: string[] | null;
  notes: string | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
