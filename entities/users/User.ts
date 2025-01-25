export enum Language {
  en = "en",
  ua = "ua",
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  height: number;
  weight: number;
  dayOfBirth: Date;
  email: string;
  language: Language;
  createdAt: Date;
};
