import { db } from "@/FirebaseConfig";
import { handleCollectionSnapshot } from "@/utils/firebaseUtils";
import { collection, getDocs, query } from "firebase/firestore";

export const fetchUserDays = ({ userId }: { userId: string }) => {
  const q = query(collection(db, `users/${userId}/days`));
  return getDocs(q).then(handleCollectionSnapshot);
};
