import {
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
} from 'react-native-paper';
import { NutritionGoals } from '@/entities/users/User';

type NutritionGoalsFormProps = {
  initialGoals: NutritionGoals;
  onSave: (goals: NutritionGoals) => Promise<void>;
  loading?: boolean;
};

export default function NutritionGoalsForm({
  initialGoals,
  onSave,
  loading = false,
}: NutritionGoalsFormProps) {
  const [maxCalories, setMaxCalories] = useState(
    initialGoals.maxCalories.toString()
  );
  const [maxProteins, setMaxProteins] = useState(
    initialGoals.maxProteins.toString()
  );
  const [maxFats, setMaxFats] = useState(initialGoals.maxFats.toString());
  const [maxCarbs, setMaxCarbs] = useState(initialGoals.maxCarbs.toString());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMaxCalories(initialGoals.maxCalories.toString());
    setMaxProteins(initialGoals.maxProteins.toString());
    setMaxFats(initialGoals.maxFats.toString());
    setMaxCarbs(initialGoals.maxCarbs.toString());
  }, [initialGoals]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const goals: NutritionGoals = {
        maxCalories: parseInt(maxCalories) || 0,
        maxProteins: parseInt(maxProteins) || 0,
        maxFats: parseInt(maxFats) || 0,
        maxCarbs: parseInt(maxCarbs) || 0,
      };
      await onSave(goals);
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
    } finally {
      setSaving(false);
    }
  };

  const isValid =
    maxCalories &&
    maxProteins &&
    maxFats &&
    maxCarbs &&
    !isNaN(parseInt(maxCalories)) &&
    !isNaN(parseInt(maxProteins)) &&
    !isNaN(parseInt(maxFats)) &&
    !isNaN(parseInt(maxCarbs));

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Цільові значення харчування
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Налаштуйте свої денні цілі по калоріям та макронутрієнтам
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          label="Калорії (kcal)"
          value={maxCalories}
          onChangeText={setMaxCalories}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          disabled={loading || saving}
          left={<TextInput.Icon icon="fire" />}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.halfInput}>
          <TextInput
            label="Білки (г)"
            value={maxProteins}
            onChangeText={setMaxProteins}
            keyboardType="numeric"
            mode="outlined"
            disabled={loading || saving}
            left={<TextInput.Icon icon="food-drumstick" />}
          />
        </View>
        <View style={styles.halfInput}>
          <TextInput
            label="Жири (г)"
            value={maxFats}
            onChangeText={setMaxFats}
            keyboardType="numeric"
            mode="outlined"
            disabled={loading || saving}
            left={<TextInput.Icon icon="food-variant" />}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.halfInput}>
          <TextInput
            label="Вуглеводи (г)"
            value={maxCarbs}
            onChangeText={setMaxCarbs}
            keyboardType="numeric"
            mode="outlined"
            disabled={loading || saving}
            left={<TextInput.Icon icon="bread-slice" />}
          />
        </View>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={!isValid || loading || saving}
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="content-save"
      >
        Зберегти
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

