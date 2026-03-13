import { uploadProductImage } from "@/api/products/images";
import { ADD_PRODUCT } from "@/graphql/marketplace/mutations";
import { showError, showSuccess } from "@/lib/toast";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  INITIAL_FORM_VALUES,
  type PublishFormValues,
} from "../types/PublishForm";

export const TOTAL_STEPS = 5;

type FormErrors = Partial<Record<keyof PublishFormValues, string>>;

function validateStep(step: number, values: PublishFormValues): FormErrors {
  const errors: FormErrors = {};

  if (step === 0) {
    if (values.images.length === 0) {
      errors.images = "Add at least one photo.";
    }
  }

  if (step === 1) {
    if (!values.name.trim()) errors.name = "Product name is required.";
    if (!values.condition) errors.condition = "Select a condition.";
  }

  if (step === 2) {
    if (!values.productCategoryId)
      errors.productCategoryId = "Select a category.";
  }

  if (step === 3) {
    if (!values.price.trim() || isNaN(parseFloat(values.price))) {
      errors.price = "Enter a valid price.";
    }
  }

  return errors;
}

export default function usePublishProduct() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<PublishFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const [addProduct] = useMutation(ADD_PRODUCT);

  const set = <K extends keyof PublishFormValues>(
    key: K,
    value: PublishFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setLoading(true);
    try {
      // Upload all images in parallel, then create the product
      const imageUrls = await Promise.all(
        values.images.map((uri) => uploadProductImage(uri)),
      );

      await addProduct({
        variables: {
          input: {
            name: values.name,
            description: values.description || null,
            color: values.color || null,
            brand: values.brand || null,
            price: parseFloat(values.price),
            condition: values.condition || null,
            conditionDescription: values.conditionDescription || null,
            productCategoryId: values.productCategoryId,
            isExchangeable: values.isExchangeable,
            badges: values.badges,
            interests: values.interests,
            images: imageUrls,
          },
        },
      });

      showSuccess({
        title: "Listed!",
        message: "Your product is now live.",
      });
      router.replace("/(tabs)");
    } catch (err) {
      showError({
        title: "Something went wrong",
        message: "Could not publish your product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    values,
    errors,
    loading,
    set,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
