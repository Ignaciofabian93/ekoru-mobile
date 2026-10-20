import { MainButton } from "@/components/Primitives/Button/MainButton";
import { Text } from "@/components/Primitives/Text/Text";
import { Title } from "@/components/Primitives/Title/Title";
import { colors } from "@/design/tokens";
import { ExternalLink } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { usePayoutSetup } from "../hooks/usePayoutSetup";
import { NAMESPACE } from "../i18n";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";

/** Profile → Cobros (MOB-6): where a business's buyers' payments land. */
export default function PayoutSetupScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const { isBusiness, setup, loading, openOnWeb } = usePayoutSetup();

  const state = setup?.connected ? "connected" : setup?.needsReconnect ? "reconnect" : "disconnected";
  const percent = new Intl.NumberFormat(i18n.language, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(setup?.commissionRate ?? 0);

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Content>
          <View style={styles.card}>
            <Title level="h5">{t("payouts.title")}</Title>
            {!isBusiness ? (
              <Text variant="p" color="secondary">
                {t("payouts.businessOnly")}
              </Text>
            ) : loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Text variant="span" color={state === "connected" ? "primary" : "secondary"}>
                  {t(`payouts.status.${state}`)}
                </Text>
                {setup?.accountId ? (
                  <Text variant="small" color="secondary">
                    {t("payouts.account", { id: setup.accountId })}
                  </Text>
                ) : null}
                <Text variant="p">{t(`payouts.explain.${state}`)}</Text>
                <Text variant="small" color="secondary">
                  {t("payouts.commission", { percent })}
                </Text>
                <MainButton
                  text={t(state === "connected" ? "payouts.manageOnWeb" : "payouts.connectOnWeb")}
                  variant={state === "connected" ? "outline" : "primary"}
                  rightIcon={ExternalLink}
                  onPress={() => void openOnWeb()}
                />
                <Text variant="small" color="secondary">
                  {t("payouts.webNote")}
                </Text>
              </>
            )}
          </View>
        </Content>
      </ScrollContainer>
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
});
