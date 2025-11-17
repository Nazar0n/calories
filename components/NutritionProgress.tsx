import { FC } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import CircularProgress from './CircularProgress';

type NutritionProgressProps = {
  grams: number;
  maxGrams: number;
  name: string;
  size?: number;
  style?: any;
};

const NutritionProgress: FC<NutritionProgressProps> = ({
  grams,
  maxGrams,
  name,
  size,
  style,
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <CircularProgress
        value={grams}
        maxValue={maxGrams}
        size={size}
        style={{ fontSize: 10 }}
        inPercent
      />
      <View style={styles.nutritionStats}>
        <Text style={{ fontWeight: "bold" }}>{name}</Text>
        <Text style={styles.currentNutritions}>{grams.toFixed(1)}г</Text>
        <Text>з {maxGrams.toFixed(1)}г</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  nutritionStats: {
    marginLeft: 8,
  },
  currentNutritions: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NutritionProgress;
