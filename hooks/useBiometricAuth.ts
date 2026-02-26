import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";

export type BiometricType = "fingerprint" | "face" | "iris";

interface UseBiometricAuthReturn {
  isAvailable: boolean;
  supportedTypes: BiometricType[];
  authenticate: (promptMessage?: string) => Promise<boolean>;
}

export default function useBiometricAuth(): UseBiometricAuthReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<BiometricType[]>([]);

  useEffect(() => {
    async function check() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (hasHardware && isEnrolled) {
        setIsAvailable(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setSupportedTypes(
          types.map((t) => {
            if (t === LocalAuthentication.AuthenticationType.FINGERPRINT) return "fingerprint";
            if (t === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) return "face";
            return "iris";
          })
        );
      }
    }
    check();
  }, []);

  const authenticate = async (promptMessage = "Authenticate to continue"): Promise<boolean> => {
    if (!isAvailable) return false;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    return result.success;
  };

  return { isAvailable, supportedTypes, authenticate };
}
