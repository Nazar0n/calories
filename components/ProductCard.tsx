import React from 'react';

import {
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';
import {
  Card,
  IconButton,
  Text,
} from 'react-native-paper';

import { Product } from '@/entities/products/Product';

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
  onDelete: (product: Product) => void;
};

function ProductCard({ product, onPress, onDelete }: ProductCardProps) {
  const handleDelete = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onDelete(product);
  };

  return (
    <Card style={styles.card} onPress={() => onPress(product)}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium">{product.name}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={handleDelete}
          />
        </View>
        <View style={styles.nutritionInfo}>
          <Text>Calories: {product.nutrition.calories}</Text>
          <Text>Proteins: {product.nutrition.proteins}g</Text>
          <Text>Fats: {product.nutrition.fats}g</Text>
          <Text>Carbs: {product.nutrition.carbs}g</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  nutritionInfo: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default ProductCard;
