import { collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, setDoc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { Product } from "./Product";
import { nanoid } from "nanoid/non-secure";
import { Nutritions } from "../intakes/Intake";

// Create a new product
export async function createProduct(userId: string, name: string, nutrition: Nutritions): Promise<Product> {
  const product: Product = {
    id: nanoid(),
    userId,
    name,
    nutrition,
    createdAt: new Date(),
  };

  const docRef = doc(db, "products", product.id);
  await setDoc(docRef, {
    ...product,
    createdAt: Timestamp.fromDate(product.createdAt),
  });

  return product;
}

// Get all products for a user
export async function getUserProducts(userId: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  })) as Product[];
}

// Get a single product by ID
export async function getProduct(productId: string): Promise<Product | null> {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: (data.createdAt as Timestamp).toDate(),
  } as Product;
}

// Update a product
export async function updateProduct(
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, "products", productId);
  await updateDoc(docRef, updates);
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, "products", productId);
  await deleteDoc(docRef);
}

// Search products by name
export async function searchProducts(
  userId: string,
  searchTerm: string
): Promise<Product[]> {
  // Get all user's products first (since Firestore doesn't support direct text search)
  const products = await getUserProducts(userId);
  
  // Filter products by name locally
  const lowercaseSearch = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseSearch)
  );
}
