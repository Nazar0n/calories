import { FC } from "react";
import { View } from "react-native";
import NutritionProgress from "./NutritionProgress";
import { StyleSheet } from "react-native";

type NutritionDiagramsProps = {
  proteins: number;
  fats: number;
  carbs: number;
  style?: any;
};

const NutritionDiagrams: FC<NutritionDiagramsProps> = ({
  proteins,
  fats,
  carbs,
  style,
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <NutritionProgress
        name="Proteins"
        grams={proteins}
        maxGrams={112}
        size={70}
      />
      <NutritionProgress name="Fats" grams={fats} maxGrams={70} size={70} />
      <NutritionProgress name="Carbs" grams={carbs} maxGrams={171} size={70} />
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
