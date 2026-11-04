import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import TextArea from "@/components/Primitives/TextArea/TextArea";
import { colors } from "@/design/tokens";
import { formatPrice } from "@/utils/formatPrice";
import { useLocalSearchParams } from "expo-router";
import { Check, CreditCard, FileText, Send, X } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { type Quotation, type QuotationStatus, type QuoteReply, useQuotations } from "../hooks/useQuotations";
import { NAMESPACE } from "../i18n";
import { isPayable, quotedPrice } from "../utils/quotations";

type Tab = "sent" | "received";

const STATUS_COLOR: Record<QuotationStatus, string> = {
  PENDING: colors.warning,
  ACCEPTED: colors.success,
  DECLINED: colors.danger,
  COMPLETED: colors.success,
  CANCELLED: colors.foregroundSecondary,
  EXPIRED: colors.foregroundSecondary,
};

/** The provider's reply: price, duration and terms, which the client then accepts or declines. */
function ReplyForm({
  quotation,
  busy,
  onSend,
}: {
  quotation: Quotation;
  busy: boolean;
  onSend: (reply: QuoteReply) => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [price, setPrice] = useState(quotation.estimatedPrice ? String(quotation.estimatedPrice) : "");
  const [duration, setDuration] = useState(
    quotation.estimatedDuration ? String(quotation.estimatedDuration) : "",
  );
  const [notes, setNotes] = useState(quotation.providerNotes ?? "");
  const amount = Number(price);
  const valid = price.trim().length > 0 && Number.isFinite(amount) && amount > 0;

  return (
    <View style={styles.form}>
      <View style={styles.formRow}>
        <View style={styles.flex}>
          <Input
            label={t("quotes.respond.price")}
            type="number"
            keyboardType="number-pad"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <View style={styles.flex}>
          <Input
            label={t("quotes.respond.duration")}
            type="number"
            keyboardType="number-pad"
            value={duration}
            onChangeText={setDuration}
          />
        </View>
      </View>
      <TextArea
        label={t("quotes.respond.notes")}
        placeholder={t("quotes.respond.notesPlaceholder")}
        value={notes}
        onChangeText={setNotes}
        maxLength={1000}
      />
      <MainButton
        text={t("quotes.respond.submit")}
        leftIcon={Send}
        size="sm"
        loading={busy}
        disabled={!valid}
        onPress={() =>
          onSend({
            id: quotation.id,
            estimatedPrice: amount,
            estimatedDuration: duration ? Number(duration) : undefined,
            providerNotes: notes.trim() || undefined,
          })
        }
      />
    </View>
  );
}

/**
 * Profile → Cotizaciones (MOB-3), the web's quotes inbox (WEB-4): the quotes I
 * asked for, to accept, decline and pay; and, as a provider, the requests to
 * answer with a price. Paid through Mercado Pago to the provider.
 */
export default function QuotationsScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const quotes = useQuotations({ errorTitle: t("quotes.error") });
  // "Cotizaciones recibidas" opens the provider's side (?tab=received).
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(params.tab === "received" ? "received" : "sent");
  const waiting = quotes.received.filter((q) => q.status === "PENDING").length;
  const list = tab === "sent" ? quotes.sent : quotes.received;

  const date = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        {(["sent", "received"] as const).map((key) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={[styles.tab, tab === key && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === key }}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {t(`quotes.tabs.${key}`)}
              {key === "received" && waiting > 0 ? ` (${waiting})` : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      {quotes.loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={quotes.refreshing} onRefresh={() => void quotes.refetch()} />
          }
        >
          {list.length === 0 ? (
            <View style={styles.center}>
              <FileText size={40} color={colors.foregroundTertiary} strokeWidth={1.5} />
              <Text style={styles.muted}>{t(`quotes.empty.${tab}`)}</Text>
            </View>
          ) : (
            list.map((quotation) => {
              const price = quotedPrice(quotation);
              const hasPrice = price !== null;
              return (
                <View key={quotation.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title} numberOfLines={2}>
                      {quotation.title}
                    </Text>
                    <Text style={[styles.status, { color: STATUS_COLOR[quotation.status] }]}>
                      {quotation.paidAt ? t("quotes.paid") : t(`quotes.status.${quotation.status}`)}
                    </Text>
                  </View>
                  {quotation.service ? <Text style={styles.service}>{quotation.service.name}</Text> : null}
                  <Text style={styles.muted}>{date(quotation.createdAt)}</Text>
                  <Text style={styles.line}>{quotation.description}</Text>
                  {quotation.clientNotes ? (
                    <Text style={styles.muted}>
                      {t("quotes.clientNotes")}: {quotation.clientNotes}
                    </Text>
                  ) : null}

                  {hasPrice ? (
                    <View>
                      <Text style={styles.muted}>{t("quotes.quotedPrice")}</Text>
                      <Text style={styles.price}>{formatPrice(price)}</Text>
                    </View>
                  ) : null}
                  {quotation.providerNotes ? (
                    <Text style={styles.muted}>
                      {t("quotes.providerNotes")}: {quotation.providerNotes}
                    </Text>
                  ) : null}
                  {quotation.declineReason ? (
                    <Text style={styles.muted}>
                      {t("quotes.declineReason")}: {quotation.declineReason}
                    </Text>
                  ) : null}

                  {/* The client decides only once the provider has put a number on it. */}
                  {tab === "sent" && quotation.status === "PENDING" && !hasPrice ? (
                    <Text style={styles.muted}>{t("quotes.awaitingProvider")}</Text>
                  ) : null}
                  {tab === "sent" && quotation.status === "PENDING" && hasPrice ? (
                    <View style={styles.actions}>
                      <MainButton
                        text={t("quotes.accept")}
                        leftIcon={Check}
                        size="sm"
                        disabled={quotes.busy}
                        onPress={() => void quotes.accept(quotation.id)}
                      />
                      <MainButton
                        text={t("quotes.decline")}
                        leftIcon={X}
                        size="sm"
                        variant="outline"
                        disabled={quotes.busy}
                        onPress={() => void quotes.decline(quotation.id)}
                      />
                    </View>
                  ) : null}
                  {tab === "sent" && isPayable(quotation) && hasPrice ? (
                    <View style={styles.payBlock}>
                      <MainButton
                        text={t("quotes.pay", { amount: formatPrice(price) })}
                        leftIcon={CreditCard}
                        size="sm"
                        loading={quotes.payingId === quotation.id}
                        disabled={quotes.payingId !== null}
                        onPress={() => void quotes.pay(quotation.id)}
                      />
                      <Text style={styles.muted}>{t("quotes.payHint")}</Text>
                    </View>
                  ) : null}
                  {quotation.paidAt ? (
                    <Text style={styles.muted}>{t("quotes.paidOn", { date: date(quotation.paidAt) })}</Text>
                  ) : null}

                  {tab === "received" && quotation.status === "PENDING" ? (
                    <ReplyForm
                      quotation={quotation}
                      busy={quotes.busy}
                      onSend={(reply) => void quotes.respond(reply)}
                    />
                  ) : null}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundTertiary },
  tabs: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: colors.background },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: "Cabin_600SemiBold", fontSize: 14, color: colors.foregroundSecondary },
  tabTextActive: { color: "#fff" },
  list: { padding: 16, gap: 12, flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 48 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 6 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, fontFamily: "Cabin_600SemiBold", fontSize: 16, color: colors.foreground },
  status: { fontFamily: "Cabin_600SemiBold", fontSize: 13 },
  service: { fontFamily: "Cabin_600SemiBold", fontSize: 13, color: colors.primaryDark },
  line: { fontFamily: "Cabin_400Regular", fontSize: 14, color: colors.foreground, lineHeight: 20 },
  price: { fontFamily: "Cabin_700Bold", fontSize: 18, color: colors.foreground },
  muted: { fontFamily: "Cabin_400Regular", fontSize: 13, color: colors.foregroundSecondary },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  payBlock: { gap: 6, marginTop: 6 },
  form: {
    gap: 10,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  formRow: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
});
