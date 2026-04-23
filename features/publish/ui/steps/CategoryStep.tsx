import { Select, type Option } from "@/components/shared/Select/Select";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import useDepartments from "@/features/marketplace/hooks/useDepartments";
import type { DepartmentCategory } from "@/features/marketplace/types/Department";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { PublishFormValues } from "../../types/PublishForm";

interface Props {
  values: PublishFormValues;
  errors: Partial<Record<keyof PublishFormValues, string>>;
  set: <K extends keyof PublishFormValues>(
    key: K,
    value: PublishFormValues[K],
  ) => void;
}

export default function CategoryStep({ values, errors, set }: Props) {
  const { departments, loading } = useDepartments();

  const departmentOptions: Option[] = departments.map((d) => ({
    label: d.translation.name,
    value: d.id,
  }));

  const selectedDept = departments.find((d) => d.id === values.departmentId);

  const deptCategoryOptions: Option[] =
    selectedDept?.departmentCategory?.map((dc: DepartmentCategory) => ({
      label: dc.translation.name,
      value: dc.id,
    })) ?? [];

  const selectedDeptCat = selectedDept?.departmentCategory?.find(
    (dc: DepartmentCategory) => dc.id === values.departmentCategoryId,
  );

  const productCategoryOptions: Option[] =
    selectedDeptCat?.productCategory?.map((pc) => ({
      label: pc.translation.name,
      value: pc.id,
    })) ?? [];

  const handleDeptChange = (deptId: string | number) => {
    set("departmentId", Number(deptId));
    set("departmentCategoryId", null);
    set("productCategoryId", null);
  };

  const handleDeptCatChange = (deptCatId: string | number) => {
    set("departmentCategoryId", Number(deptCatId));
    set("productCategoryId", null);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text size="sm" color="secondary">
          Loading categories…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title level="h5" weight="semibold" style={styles.title}>
        Category
      </Title>
      <Text size="sm" color="secondary" style={styles.subtitle}>
        Help buyers find your product by selecting the right category.
      </Text>

      <Select
        label="Department"
        placeholder="Select department"
        options={departmentOptions}
        value={values.departmentId ?? undefined}
        onChange={handleDeptChange}
        searchEnabled
      />

      <Select
        label="Section"
        placeholder="Select section"
        options={deptCategoryOptions}
        value={values.departmentCategoryId ?? undefined}
        onChange={handleDeptCatChange}
        disabled={!values.departmentId}
        searchEnabled
      />

      <Select
        label="Category *"
        placeholder="Select category"
        options={productCategoryOptions}
        value={values.productCategoryId ?? undefined}
        onChange={(v) => set("productCategoryId", Number(v))}
        disabled={!values.departmentCategoryId}
        errorMessage={errors.productCategoryId}
        searchEnabled
      />
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
  subtitle: {
    lineHeight: 20,
  },
  loading: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 40,
  },
});
