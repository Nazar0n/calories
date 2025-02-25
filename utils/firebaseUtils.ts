import { DocumentData, Timestamp } from "firebase/firestore";

export const convertObjectTimestamps = (doc: any): Object => {
  if (!(doc instanceof Object)) {
    return doc;
  }

  return Object.entries(doc).reduce((acc, [key, value]) => {
    if (value instanceof Timestamp) {
      return {
        ...acc,
        [key]: value.toDate(),
      };
    }

    if (value instanceof Array) {
      return {
        ...acc,
        [key]: value.map(convertObjectTimestamps),
      };
    }

    if (value instanceof Object) {
      return {
        ...acc,
        [key]: convertObjectTimestamps(value),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

export const handleDocumentSnapshot = (snapshot: DocumentData) => {
  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...convertObjectTimestamps(snapshot.data()),
    id: snapshot.id,
  };
};

export const handleCollectionSnapshot = (snapshot: DocumentData) => {
  return snapshot.docs.map((doc: DocumentData) => ({
    ...convertObjectTimestamps(doc.data()),
    id: doc.id,
  }));
};
