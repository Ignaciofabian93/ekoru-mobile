import MainButton from "@/components/Primitives/Button/MainButton";
import { colors } from "@/design/tokens";
import type { Seller } from "@/types/user";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatPrice } from "@/utils/formatPrice";
import { CalendarClock } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CANCELLABLE,
  PROVIDER_MOVES,
  type BookingStatus,
  type ProviderMove,
  type ServiceBooking,
  useBookings,
} from "../hooks/useBookings";
import { NAMESPACE } from "../i18n";

type Tab = "made" | "received";

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: colors.warning,
  CONFIRMED: colors.primary,
  IN_PROGRESS: colors.secondary,
  COMPLETED: colors.success,
  NO_SHOW: colors.foregroundSecondary,
  CANCELLED: colors.danger,
};

/**
 * Profile → Reservas (MOB-3): the bookings I made, and the ones I received as
 * a provider with confirm, start, complete, no-show and cancel. Booked on
 * EKORU, paid to the provider on site (D7). Same rules as the web (WEB-5).
 */
export default function BookingsScreen() {
  const { t, i18n } = useTranslation(NAMESPACE);
  const bookings = useBookings({ errorTitle: t("bookings.error") });
  const waiting = bookings.received.filter((b) => b.status === "PENDING").length;
  const [tab, setTab] = useState<Tab>("made");
  const list = tab === "made" ? bookings.made : bookings.received;

  const confirm = (title: string, message: string, onYes: () => void) =>
    Alert.alert(title, message, [
      { text: t("bookings.dialog.back"), style: "cancel" },
      { text: t("bookings.dialog.yes"), style: "destructive", onPress: onYes },
    ]);

  const cancel = (booking: ServiceBooking) =>
    confirm(t("bookings.dialog.cancelTitle"), t("bookings.dialog.cancelMessage"), () => {
      void bookings.cancel(
        booking.id,
        tab === "made" ? t("bookings.dialog.clientReason") : t("bookings.dialog.providerReason"),
      );
    });

  const move = (booking: ServiceBooking, to: ProviderMove) => {
    if (to === "COMPLETED" || to === "NO_SHOW") {
      confirm(t(`bookings.dialog.${to}Title`), t(`bookings.dialog.${to}Message`), () => {
        void bookings.move(booking.id, to);
      });
    } else {
      void bookings.move(booking.id, to);
    }
  };

  const date = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        {(["made", "received"] as const).map((key) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={[styles.tab, tab === key && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === key }}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {t(`bookings.tabs.${key}`)}
              {key === "received" && waiting > 0 ? ` (${waiting})` : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      {bookings.loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={bookings.refreshing} onRefresh={() => void bookings.refetch()} />
          }
        >
          {list.length === 0 ? (
            <View style={styles.center}>
              <CalendarClock size={40} color={colors.foregroundTertiary} strokeWidth={1.5} />
              <Text style={styles.muted}>{t(`bookings.empty.${tab}`)}</Text>
            </View>
          ) : (
            list.map((booking) => (
              <View key={booking.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceName} numberOfLines={2}>
                    {booking.service?.name ?? t("bookings.unknownService")}
                  </Text>
                  <Text style={[styles.status, { color: STATUS_COLOR[booking.status] }]}>
                    {t(`bookings.status.${booking.status}`)}
                  </Text>
                </View>
                <Text style={styles.line}>
                  {date(booking.scheduledDate)}
                  {booking.scheduledTimeSlot ? ` · ${booking.scheduledTimeSlot}` : ""}
                </Text>
                <Text style={styles.line}>
                  {formatPrice(booking.agreedPrice)} · {t("bookings.paidOnSite")}
                </Text>
                {tab === "received" && booking.client ? (
                  <Text style={styles.muted}>
                    {t("bookings.client")}: {displaySellerName(booking.client as Seller)}
                  </Text>
                ) : null}
                {booking.clientNotes ? (
                  <Text style={styles.muted}>
                    {t("bookings.notes")}: {booking.clientNotes}
                  </Text>
                ) : null}
                {booking.cancellationReason ? (
                  <Text style={styles.muted}>
                    {t("bookings.cancelReason")}: {booking.cancellationReason}
                  </Text>
                ) : null}

                <View style={styles.actions}>
                  {tab === "received" &&
                    (PROVIDER_MOVES[booking.status] ?? []).map((to) => (
                      <MainButton
                        key={to}
                        text={t(`bookings.actions.${to}`)}
                        size="sm"
                        variant={to === "NO_SHOW" ? "outline" : "primary"}
                        disabled={bookings.busy}
                        onPress={() => move(booking, to)}
                      />
                    ))}
                  {CANCELLABLE.includes(booking.status) && (
                    <MainButton
                      text={t("bookings.actions.CANCEL")}
                      size="sm"
                      variant="ghost"
                      disabled={bookings.busy}
                      onPress={() => cancel(booking)}
                    />
                  )}
                </View>
              </View>
            ))
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
  serviceName: { flex: 1, fontFamily: "Cabin_600SemiBold", fontSize: 16, color: colors.foreground },
  status: { fontFamily: "Cabin_600SemiBold", fontSize: 13 },
  line: { fontFamily: "Cabin_500Medium", fontSize: 14, color: colors.foreground },
  muted: { fontFamily: "Cabin_400Regular", fontSize: 13, color: colors.foregroundSecondary },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
});
