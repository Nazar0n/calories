import { db } from "@/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { DayData } from "./Day";
import { convertObjectTimestamps } from "@/utils/firebaseUtils";

export async function createDay(dayData: DayData) {
  try {
    const docRef = await addDoc(
      collection(db, "days"),
      convertObjectTimestamps(dayData)
    );

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
