import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Intake } from "./Intake";
import { DayData } from "../days/Day";
import { db } from "@/FirebaseConfig";
import { nanoid } from "nanoid/non-secure";

type DateOrTimestamp = Date | Timestamp;

/**
 * Рекурсивно проходить об'єкт і конвертує всі дати в Timestamp і навпаки.
 */
function convertDates<T>(obj: T): T {
  if (obj instanceof Date) {
    return Timestamp.fromDate(obj) as T; // Date → Timestamp
  }

  if (obj instanceof Timestamp) {
    return obj.toDate() as T; // Timestamp → Date
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDates(item)) as T; // Обробка масивів
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertDates(value)])
    ) as T;
  }

  return obj; // Якщо це не Date/Timestamp, повертаємо без змін
}

function getCurrentDateString(): string {
  return new Date().toISOString().split("T")[0]; // Отримуємо YYYY-MM-DD
}

export async function addIntake(
  userId: string,
  intake: Omit<Intake, "id" | "dayId" | "createdAt">
) {
  const date = getCurrentDateString();
  const dayRef = doc(db, "days", `${userId}_${date}`);
  const daySnap = await getDoc(dayRef);

  let dayData: DayData;

  if (daySnap.exists()) {
    dayData = daySnap.data() as DayData;
  } else {
    dayData = {
      userId,
      date: new Date(date),
      intakes: [],
      createdAt: new Date(),
    };
    await setDoc(dayRef, dayData);
  }

  const newIntake: Intake = {
    ...intake,
    id: nanoid(),
    dayId: dayRef.id,
    createdAt: new Date(),
    userId,
  };

  const updatedIntakes = [...dayData.intakes, newIntake];

  await updateDoc(dayRef, convertDates({ intakes: updatedIntakes }));

  return newIntake;
}

export async function deleteIntake(userId: string, intakeId: string) {
  const date = getCurrentDateString();
  const dayRef = doc(db, "days", `${userId}_${date}`);
  const daySnap = await getDoc(dayRef);

  if (!daySnap.exists()) {
    throw new Error("Day document not found");
  }

  const dayData = daySnap.data() as DayData;
  const updatedIntakes = dayData.intakes.filter(intake => intake.id !== intakeId);

  // No need to convert dates since they are already in the correct format in Firestore
  await updateDoc(dayRef, { intakes: updatedIntakes });
}
