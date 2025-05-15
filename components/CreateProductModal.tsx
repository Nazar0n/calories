import { useState } from 'react';

import { getAuth } from 'firebase/auth';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { Nutritions } from '@/entities/intakes/Intake';
import { createProduct } from '@/entities/products/productGateways';

const initialNutrition: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

type CreateProductProps = {
  visible: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CreateProductModal({ visible, onSuccess, onCancel }: CreateProductProps) {
  const [name, setName] = useState("");
  const [nutrition, setNutrition] = useState<Nutritions>(initialNutrition);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId || !name.trim()) return;

    setLoading(true);
    try {
      await createProduct(userId, name.trim(), nutrition);
      onSuccess?.();
      // Reset form
      setName("");
      setNutrition(initialNutrition);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const nutritionFields: Array<keyof Nutritions> = ["calories", "proteins", "fats", "carbs"];

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Surface style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>Create New Product</Text>
          
          <TextInput
            label="Product Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.subtitle}>Nutrition per 100g</Text>
          
          <View style={styles.nutritionGrid}>
            {nutritionFields.map((field) => (
              <TextInput
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={String(nutrition[field])}
                onChangeText={(value) =>
                  setNutrition((prev) => ({
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
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !name.trim()}
              style={styles.button}
            >
              Create
            </Button>
          </View>
        </ScrollView>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  nutritionInput: {
    width: '48%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
}); 