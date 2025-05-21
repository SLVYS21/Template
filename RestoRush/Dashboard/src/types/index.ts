export interface Template {
  _id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
  link: string;
  button_text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Frequency {
  period: "day" | "week" | "month" | "year";
  frequency: number;
  from: string;
  to: string;
}

export interface WorkflowFormData {
  name: string;
  all: boolean;
  moderators: boolean;
  oneTime: boolean;
  scheduleAt: string;
  frequency: Frequency;
  account: string;
} 