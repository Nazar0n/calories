import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Surface, Card, ActivityIndicator, TextInput, Portal, Modal } from "react-native-paper";
import { useState, useEffect } from "react";
import { Product } from "@/entities/products/Product";
import { getUserProducts, createProduct } from "@/entities/products/productGateways";
import { getAuth } from "firebase/auth";
import { Nutritions } from "@/entities/intakes/Intake";
import React from "react";
import CreateProductForm from "./CreateProductForm";

type SelectProductProps = {
  visible: boolean;
  onSelect: (product: Product, grams: number) => void;
  onCancel: () => void;
};

const initialNutrition: Nutritions = {
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

export default function SelectProduct({ visible, onSelect, onCancel }: SelectProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [grams, setGrams] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductNutrition, setNewProductNutrition] = useState<Nutritions>(initialNutrition);
  const [createLoading, setCreateLoading] = useState(false);

  const loadProducts = async () => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      setLoading(true);
      try {
        const products = await getUserProducts(userId);
        setProducts(products);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      loadProducts();
    } else {
      setSelectedProduct(null);
      setGrams("");
      setIsCreating(false);
      setNewProductName("");
      setNewProductNutrition(initialNutrition);
    }
  }, [visible]);

  const handleConfirmGrams = () => {
    if (selectedProduct && grams) {
      onSelect(selectedProduct, Number(grams));
      setSelectedProduct(null);
      setGrams("");
    }
  };

  const handleCreateProduct = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId || !newProductName.trim()) return;

    setCreateLoading(true);
    try {
      await createProduct(userId, newProductName.trim(), newProductNutrition);
      await loadProducts();
      setIsCreating(false);
      setNewProductName("");
      setNewProductNutrition(initialNutrition);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const nutritionFields: Array<keyof Nutritions> = ["calories", "proteins", "fats", "carbs"];

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Surface style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Select Product</Text>
        
        <Button
          mode="contained"
          onPress={() => setIsCreating(!isCreating)}
          style={styles.createButton}
        >
          {isCreating ? "Cancel Creating" : "Create New Product"}
        </Button>

        {isCreating ? (
          <CreateProductForm
            onSuccess={() => {
              setIsCreating(false);
              loadProducts();
            }}
            onCancel={() => setIsCreating(false)}
          />
        ) : loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No products found. Create some first!</Text>
        ) : (
          <ScrollView style={styles.scrollView}>
            {products.map((product) => (
              <Card
                key={product.id}
                style={styles.card}
                onPress={() => setSelectedProduct(product)}
              >
                <Card.Content>
                  <Text variant="titleMedium">{product.name}</Text>
                  <View style={styles.nutritionInfo}>
                    <Text>Calories: {product.nutrition.calories}</Text>
                    <Text>Proteins: {product.nutrition.proteins}g</Text>
                    <Text>Fats: {product.nutrition.fats}g</Text>
                    <Text>Carbs: {product.nutrition.carbs}g</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        )}

        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.cancelButton}
        >
          Cancel
        </Button>

        <Portal>
          <Modal
            visible={!!selectedProduct}
            onDismiss={() => setSelectedProduct(null)}
            contentContainerStyle={styles.gramsModal}
          >
            <Surface style={styles.gramsContainer}>
              <Text variant="titleLarge" style={styles.gramsTitle}>
                Enter amount in grams
              </Text>
              <TextInput
                label="Grams"
                value={grams}
                onChangeText={setGrams}
                keyboardType="numeric"
                style={styles.gramsInput}
              />
              <View style={styles.gramsButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setSelectedProduct(null)}
                  style={styles.gramsButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleConfirmGrams}
                  disabled={!grams || Number(grams) <= 0}
                  style={styles.gramsButton}
                >
                  Add
                </Button>
              </View>
            </Surface>
          </Modal>
        </Portal>
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
    padding: 16,
  },
  container: {
    maxHeight: '80%',
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollView: {
    maxHeight: 400,
  },
  card: {
    marginBottom: 8,
  },
  nutritionInfo: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loader: {
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 16,
  },
  gramsModal: {
    padding: 20,
  },
  gramsContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    margin: 16,
  },
  gramsTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  gramsInput: {
    marginBottom: 16,
  },
  gramsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gramsButton: {
    flex: 1,
  },
  createButton: {
    marginBottom: 16,
  },
}); 