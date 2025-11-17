import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import {
  DEFAULT_NUTRITION_GOALS,
  NutritionGoals,
  User,
} from './User';

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();
    
    return {
      ...data,
      id: userSnap.id,
      dayOfBirth: (data.dayOfBirth as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
      nutritionGoals: data.nutritionGoals || DEFAULT_NUTRITION_GOALS,
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser(
  userId: string,
  userData: Omit<User, 'id' | 'createdAt' | 'nutritionGoals'> & {
    nutritionGoals?: NutritionGoals;
  }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const now = new Date();
    
    await setDoc(userRef, {
      ...userData,
      nutritionGoals: userData.nutritionGoals || DEFAULT_NUTRITION_GOALS,
      createdAt: Timestamp.fromDate(now),
      dayOfBirth: Timestamp.fromDate(userData.dayOfBirth),
    });
    
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserNutritionGoals(
  userId: string,
  nutritionGoals: NutritionGoals
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      nutritionGoals,
    });
    
    console.log('Nutrition goals updated successfully');
  } catch (error) {
    console.error('Error updating nutrition goals:', error);
    throw error;
  }
}

export async function updateUser(
  userId: string,
  userData: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    const updateData: any = { ...userData };
    
    if (userData.dayOfBirth) {
      updateData.dayOfBirth = Timestamp.fromDate(userData.dayOfBirth);
    }
    
    await updateDoc(userRef, updateData);
    
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

