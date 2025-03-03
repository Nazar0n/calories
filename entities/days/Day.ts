import { Intake } from "../intakes/Intake";

export type DayData = {
  userId: string;
  date: Date;
  intakes: Intake[];
  createdAt: Date;
};

export type Day = DayData & { id: string };
