import { useState } from 'react';

import { getAuth } from 'firebase/auth';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
} from 'react-native-paper';

import { Nutritions } from '@/entities/intakes/Intake';
import { createProduct } from '@/entities/products/productGateways';

type CreateProductFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const initialNutrition: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export default function CreateProductForm({ onSuccess, onCancel }: CreateProductFormProps) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductNutrition, setNewProductNutrition] = useState<Nutritions>(initialNutrition);
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateProduct = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId || !newProductName.trim()) return;

    setCreateLoading(true);
    try {
      await createProduct(userId, newProductName.trim(), newProductNutrition);
      onSuccess();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const nutritionFields: Array<keyof Nutritions> = ["calories", "proteins", "fats", "carbs"];

  return (
    <View style={styles.createForm}>
      <TextInput
        label="Product Name"
        value={newProductName}
        onChangeText={setNewProductName}
        style={styles.input}
      />
      <Text variant="titleMedium" style={styles.subtitle}>Nutrition per 100g</Text>
      <View style={styles.nutritionGrid}>
        {nutritionFields.map((field) => (
          <TextInput
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={String(newProductNutrition[field])}
            onChangeText={(value) =>
              setNewProductNutrition((prev) => ({
                ...prev,
                [field]: Number(value) || 0,
              }))
            }
            keyboardType="number-pad"
            style={styles.nutritionInput}
          />
        ))}
      </View>
      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleCreateProduct}
          loading={createLoading}
          disabled={createLoading || !newProductName.trim()}
          style={styles.button}
        >
          Create
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  createForm: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  nutritionInput: {
    width: '48%',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
}); 