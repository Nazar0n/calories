import React, {
  useEffect,
  useState,
} from 'react';

import { getAuth } from 'firebase/auth';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { Nutritions } from '@/entities/intakes/Intake';
import { Product } from '@/entities/products/Product';
import { getUserProducts } from '@/entities/products/productGateways';

import CreateProductForm from './CreateProductForm';

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

export default function SelectProduct({
  visible,
  onSelect,
  onCancel,
}: SelectProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [grams, setGrams] = useState<number>(0);
  const [isCreating, setIsCreating] = useState(false);

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
      setGrams(0);
      setIsCreating(false);
    }
  }, [visible]);

  const handleConfirmGrams = () => {
    if (selectedProduct && grams) {
      onSelect(selectedProduct, Number(grams));
      setSelectedProduct(null);
      setGrams(0);
    }
  };

  if (!visible) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.container}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Select Product
            </Text>

            <Button
              mode="contained"
              onPress={() => setIsCreating(!isCreating)}
              style={styles.createButton}
            >
              {isCreating ? "Cancel Creating" : "Create New Product"}
            </Button>
          </View>

          <View style={styles.contentContainer}>
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
              <Text style={styles.emptyText}>
                No products found. Create some first!
              </Text>
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item: product }) => (
                  <Card
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
                )}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
              />
            )}
          </View>

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
                  value={grams.toString()}
                  onChangeText={(text) => setGrams(Number(text))}
                  keyboardType="number-pad"
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
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  header: {
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    minHeight: 0,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 8,
  },
  nutritionInfo: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  loader: {
    padding: 32,
  },
  emptyText: {
    textAlign: "center",
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
    backgroundColor: "#fff",
    margin: 16,
  },
  gramsTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  gramsInput: {
    marginBottom: 16,
  },
  gramsButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  gramsButton: {
    flex: 1,
  },
  createButton: {
    marginBottom: 16,
  },
});
