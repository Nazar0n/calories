import { DocumentData } from "firebase/firestore";

export function transformDates<T>(obj: T, toTimestamps: boolean): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformDates(item, toTimestamps)) as T;
  } else if (toTimestamps && obj instanceof Date) {
    return obj.getTime() as T;
  } else if (
    !toTimestamps &&
    typeof obj === "number" &&
    obj > 0 &&
    obj < 9999999999999
  ) {
    return new Date(obj) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        transformDates(value, toTimestamps),
      ])
    ) as T;
  }
  return obj;
}

export const handleDocumentSnapshot = (snapshot: DocumentData) => {
  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...transformDates(snapshot.data(), false),
    id: snapshot.id,
  };
};

export const handleCollectionSnapshot = (snapshot: DocumentData) => {
  return snapshot.docs.map((doc: DocumentData) => ({
    ...transformDates(doc.data(), false),
    id: doc.id,
  }));
};
