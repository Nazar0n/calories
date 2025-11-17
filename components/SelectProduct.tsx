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
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { Product } from '@/entities/products/Product';
import {
  deleteProduct,
  getUserProducts,
} from '@/entities/products/productGateways';
import CreateProductForm from './CreateProductForm';
import ProductCard from './ProductCard';

type SelectProductProps = {
  visible: boolean;
  onSelect: (product: Product, grams: number) => void;
  onCancel: () => void;
};

type ViewState = "loading" | "empty" | "list" | "creating";

export default function SelectProduct({
  visible,
  onSelect,
  onCancel,
}: SelectProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [grams, setGrams] = useState<number>(0);

  const loadProducts = async () => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      setViewState("loading");
      try {
        const products = await getUserProducts(userId);
        setProducts(products);
        setFilteredProducts(products);
        setViewState(products.length === 0 ? "empty" : "list");
      } catch (error) {
        console.error("Error loading products:", error);
        setViewState("empty");
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (product: Product) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      loadProducts();
    } else {
      setSelectedProduct(null);
      setGrams(0);
      setViewState("loading");
    }
  }, [visible]);

  const handleConfirmGrams = () => {
    if (selectedProduct && grams) {
      onSelect(selectedProduct, Number(grams));
      setSelectedProduct(null);
      setGrams(0);
    }
  };

  const renderContent = () => {
    switch (viewState) {
      case "loading":
        return <ActivityIndicator size="large" style={styles.loader} />;
      case "empty":
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Немає продуктів. Створіть декілька!
            </Text>
            <Button mode="outlined" onPress={onCancel}>
              Скасувати
            </Button>
          </View>
        );
      case "creating":
        return (
          <CreateProductForm
            onSuccess={() => {
              setViewState("list");
              loadProducts();
            }}
            onCancel={() => setViewState("list")}
          />
        );
      case "list":
        return (
          <>
            <TextInput
              mode="outlined"
              label="Пошук продуктів"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchInput}
              right={
                searchQuery ? (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => handleSearch("")}
                  />
                ) : null
              }
            />
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item: product }) => (
                <ProductCard
                  product={product}
                  onPress={setSelectedProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            />
          </>
        );
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
              Виберіть продукт
            </Text>

            <Button
              mode="contained"
              onPress={() =>
                setViewState(viewState === "creating" ? "list" : "creating")
              }
              style={styles.createButton}
            >
              {viewState === "creating"
                ? "Скасувати створення"
                : "Створити новий продукт"}
            </Button>
          </View>

          <View style={styles.contentContainer}>{renderContent()}</View>

          {viewState === "list" && (
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.cancelButton}
            >
              Скасувати
            </Button>
          )}

          <Portal>
            <Modal
              visible={!!selectedProduct}
              onDismiss={() => setSelectedProduct(null)}
              contentContainerStyle={styles.gramsModal}
            >
              <Surface style={styles.gramsContainer}>
                <Text variant="titleLarge" style={styles.gramsTitle}>
                  Введіть кількість в грамах
                </Text>
                <TextInput
                  label="Грами"
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
                    Скасувати
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleConfirmGrams}
                    disabled={!grams || Number(grams) <= 0}
                    style={styles.gramsButton}
                  >
                    Додати
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
  searchInput: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
