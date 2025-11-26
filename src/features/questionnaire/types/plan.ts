export interface QuittingPlanResponse {
  date: string; // datetime as ISO string
  status: string;
  current: number;
  target: number;
  text: string;
}

export interface QuittingPlan {
  date: Date;
  status: string;
  current: number;
  target: number;
  text: string;
}
