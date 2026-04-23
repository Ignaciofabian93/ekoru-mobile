import Input from "@/components/shared/Input/Input";
import { Select, type Option } from "@/components/shared/Select/Select";
import { Title } from "@/components/shared/Title/Title";
import TextArea from "@/components/shared/TextArea/TextArea";
import type { ProductCondition } from "@/types/enums";
import { StyleSheet, View } from "react-native";
import type { PublishFormValues } from "../../types/PublishForm";

const CONDITION_OPTIONS: Option[] = [
  { label: "New", value: "NEW" },
  { label: "Open box", value: "OPEN_BOX" },
  { label: "Like new", value: "LIKE_NEW" },
  { label: "Fair", value: "FAIR" },
  { label: "Poor", value: "POOR" },
  { label: "For parts", value: "FOR_PARTS" },
  { label: "Refurbished", value: "REFURBISHED" },
];

interface Props {
  values: PublishFormValues;
  errors: Partial<Record<keyof PublishFormValues, string>>;
  set: <K extends keyof PublishFormValues>(
    key: K,
    value: PublishFormValues[K],
  ) => void;
}

export default function DetailsStep({ values, errors, set }: Props) {
  return (
    <View style={styles.container}>
      <Title level="h5" weight="semibold" style={styles.title}>
        Product details
      </Title>

      <Input
        label="Product name *"
        placeholder="e.g. Nike Air Max 90"
        value={values.name}
        onChangeText={(v) => set("name", v)}
        errorMessage={errors.name}
        width="full"
      />

      <TextArea
        label="Description"
        placeholder="Describe the product, its history, defects…"
        value={values.description}
        onChangeText={(v) => set("description", v)}
        maxLength={600}
      />

      <Select
        label="Condition *"
        placeholder="Select condition"
        options={CONDITION_OPTIONS}
        value={values.condition}
        onChange={(v) => set("condition", v as ProductCondition)}
        errorMessage={errors.condition}
      />

      <Input
        label="Condition notes"
        placeholder="e.g. Minor scratch on the back"
        value={values.conditionDescription}
        onChangeText={(v) => set("conditionDescription", v)}
        width="full"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Brand"
            placeholder="e.g. Nike"
            value={values.brand}
            onChangeText={(v) => set("brand", v)}
            width="full"
          />
        </View>
        <View style={styles.half}>
          <Input
            label="Color"
            placeholder="e.g. Black"
            value={values.color}
            onChangeText={(v) => set("color", v)}
            width="full"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
