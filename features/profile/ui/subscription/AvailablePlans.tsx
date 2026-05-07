import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { type BillingCycle } from "../../hooks/useSubscription";
import { NAMESPACE } from "./i18n";

interface AvailablePlansProps {
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
}

export default function AvailablePlans({ billingCycle, setBillingCycle }: AvailablePlansProps) {
  const { t } = useTranslation(NAMESPACE);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: billingCycle === "monthly" ? 0 : tabWidth,
      useNativeDriver: true,
      tension: 180,
      friction: 18,
    }).start();
  }, [billingCycle, tabWidth, slideAnim]);

  return (
    <Fragment>
      <Title level="h6">{t("availablePlans.title")}</Title>

      <View style={styles.cycleToggle} onLayout={(e) => setTabWidth((e.nativeEvent.layout.width - 6) / 2)}>
        <Animated.View
          style={[styles.slidingPill, { width: tabWidth, transform: [{ translateX: slideAnim }] }]}
        />
        <Pressable style={styles.cycleTab} onPress={() => setBillingCycle("monthly")}>
          <Text variant="span" color={billingCycle === "monthly" ? "primary" : "default"}>
            {t("availablePlans.monthly")}
          </Text>
        </Pressable>
        <Pressable style={styles.cycleTab} onPress={() => setBillingCycle("yearly")}>
          <Text variant="span" color={billingCycle === "yearly" ? "primary" : "default"}>
            {t("availablePlans.yearly")}
          </Text>
        </Pressable>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  cycleToggle: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    marginTop: 12,
  },
  slidingPill: {
    position: "absolute",
    top: 3,
    left: 3,
    bottom: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  cycleTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});
