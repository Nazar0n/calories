import { db } from "@/FirebaseConfig";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { Day, DayData } from "./Day";
import { transformDates } from "@/utils/firebaseUtils";

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

export async function fetchToday(userId: string): Promise<Day | null> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const dayRef = doc(db, "days", `${userId}_${today}`);

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
