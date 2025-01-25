import { Intake } from "../intakes/Intake";

export type DayData = {
  id: string;
  userId: string;
  date: Date;
  intakes: Intake[];
  createdAt: Date;
};

export type Day = DayData & { id: string };
