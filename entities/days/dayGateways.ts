import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { transformDates } from '@/utils/firebaseUtils';
import {
  Day,
  DayData,
} from './Day';

export async function createDay(dayData: DayData) {
  try {
    const docRef = await addDoc(
      collection(db, "days"),
      transformDates(dayData, true)
    );

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function fetchDayByDate(userId: string, date: Date): Promise<Day | null> {
  const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const dayRef = doc(db, "days", `${userId}_${dateString}`);
  const daySnap = await getDoc(dayRef);

  if (!daySnap.exists()) {
    return null;
  }

  const data = daySnap.data();

  return {
    ...data,
    id: daySnap.id,
    date: (data.date as Timestamp).toDate(),
    createdAt: (data.createdAt as Timestamp).toDate(),
    intakes: data.intakes.map((intake: any) => ({
      ...intake,
      createdAt: (intake.createdAt as Timestamp).toDate(),
    })),
  } as Day;
}

export async function fetchToday(userId: string): Promise<Day | null> {
  return fetchDayByDate(userId, new Date());
}
