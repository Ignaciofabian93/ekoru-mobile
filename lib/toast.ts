import Toast from "react-native-toast-message";

type ToastOptions = {
  title?: string;
  message?: string;
  duration?: number;
};

export function showSuccess({ title, message, duration = 3000 }: ToastOptions) {
  Toast.show({ type: "success", text1: title, text2: message, visibilityTime: duration });
}

export function showError({ title, message, duration = 4000 }: ToastOptions) {
  Toast.show({ type: "error", text1: title, text2: message, visibilityTime: duration });
}

export function showInfo({ title, message, duration = 3000 }: ToastOptions) {
  Toast.show({ type: "info", text1: title, text2: message, visibilityTime: duration });
}
