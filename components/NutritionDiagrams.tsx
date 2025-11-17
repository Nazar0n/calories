import { FC } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import NutritionProgress from './NutritionProgress';

type NutritionDiagramsProps = {
  proteins: number;
  fats: number;
  carbs: number;
  maxProteins: number;
  maxFats: number;
  maxCarbs: number;
  style?: any;
};

const NutritionDiagrams: FC<NutritionDiagramsProps> = ({
  proteins,
  fats,
  carbs,
  maxProteins,
  maxFats,
  maxCarbs,
  style,
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <NutritionProgress
        name="Білки"
        grams={proteins}
        maxGrams={maxProteins}
        size={70}
      />
      <NutritionProgress
        name="Жири"
        grams={fats}
        maxGrams={maxFats}
        size={70}
      />
      <NutritionProgress
        name="Вуглеводи"
        grams={carbs}
        maxGrams={maxCarbs}
        size={70}
        style={{ marginBottom: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
});

export default NutritionDiagrams;
