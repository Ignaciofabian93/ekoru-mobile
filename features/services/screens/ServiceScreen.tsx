import MainButton from "@/components/Primitives/Button/MainButton";
import { colors } from "@/design/tokens";
import { useStartConversation } from "@/features/chat/hooks/useChatQueries";
import useTrackItemView from "@/features/tracking/hooks/useTrackItemView";
import useAppRouter from "@/hooks/useAppRouter";
import { useSeller } from "@/store/useAuthStore";
import { displaySellerName } from "@/utils/displaySellerName";
import { formatDuration } from "@/utils/formatDuration";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { type Href, Stack, useLocalSearchParams } from "expo-router";
import {
  CalendarPlus,
  FileText,
  Info,
  MessageCircle,
  Star,
  User,
  UserRound,
  Wrench,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import useService, { type ServiceDetail } from "../hooks/useService";
import { NAMESPACE } from "../i18n";
import BookingForm from "../ui/BookingForm";
import QuoteForm from "../ui/QuoteForm";

/** A service (MOB-3): what it is, how it is priced, and booking or messaging the provider. */
export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { service, loading } = useService(id ?? "");
  useTrackItemView({ itemType: "SERVICE", itemId: service?.id, sellerId: service?.sellerId });
  const { t } = useTranslation(NAMESPACE);

  if (loading && !service) {
    return (
      <>
        <Stack.Screen options={{ title: t("detail.title") }} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </>
    );
  }
  if (!service) {
    return (
      <>
        <Stack.Screen options={{ title: t("detail.title") }} />
        <View style={styles.center}>
          <Text style={styles.muted}>{t("detail.notFound")}</Text>
        </View>
      </>
    );
  }
  return <ServiceDetailView service={service} />;
}

/** The price line, as the web's price panel words it for each pricing model. */
function usePriceLine(service: ServiceDetail) {
  const { t } = useTranslation(NAMESPACE);
  if (service.pricingType === "QUOTATION" || service.basePrice == null) {
    return {
      prefix: null,
      price:
        service.pricingType === "QUOTATION" ? t("detail.summary.onQuotation") : t("detail.summary.noPrice"),
      suffix: service.pricingType === "QUOTATION" ? t("detail.summary.onQuotationHint") : null,
    };
  }
  return {
    prefix: service.pricingType === "PACKAGE" ? t("detail.summary.from") : null,
    price: formatPrice(service.basePrice),
    suffix: service.pricingType === "HOURLY" ? t("detail.summary.perHour") : null,
  };
}

function ServiceDetailView({ service }: { service: ServiceDetail }) {
  const { t } = useTranslation(NAMESPACE);
  const { t: tRoot } = useTranslation();
  const me = useSeller();
  const { navigate } = useAppRouter();
  const { start, loading: contacting } = useStartConversation();
  const [imageError, setImageError] = useState(false);
  // One inline form at a time: the booking or the quote request.
  const [open, setOpen] = useState<"booking" | "quote" | null>(null);
  const priceLine = usePriceLine(service);

  const isOwnService = Boolean(me && service.sellerId === me.id);
  const imageUri = getImageUrl(service.displayImage ?? service.images?.[0] ?? undefined);
  // As on the web (WEB-4, WEB-5): a quote-priced service has no number to
  // agree to up front, so it can only be quoted; anything with a price can be
  // booked, paid on site, and quoted too. An accepted quote is paid to the
  // provider through Mercado Pago, so quotes need them connected to Cobros.
  const quoteOnly = service.pricingType === "QUOTATION";
  const canBook = !quoteOnly;
  const canRequestQuote = service.seller?.canReceivePayments !== false;
  const rating = service.averageRating ?? 0;

  const openForm = (form: "booking" | "quote") => {
    if (!me) {
      navigate("/(auth)" as Href);
      return;
    }
    setOpen(form);
  };

  const details: { label: string; value: string }[] = [];
  if (service.pricingType) {
    details.push({
      label: t("detail.details.pricingType"),
      value: t(`detail.pricingTypes.${service.pricingType}`),
    });
  }
  if (service.duration) {
    details.push({
      label: t("detail.details.duration"),
      value: formatDuration(service.duration),
    });
  }
  if (service.isRemoteService != null) {
    details.push({
      label: t("detail.details.remote"),
      value: service.isRemoteService ? t("detail.details.yes") : t("detail.details.no"),
    });
  }
  if (service.serviceRadius) {
    details.push({
      label: t("detail.details.radius"),
      value: t("detail.details.radiusValue", { km: service.serviceRadius }),
    });
  }
  if (service.serviceLocations?.length) {
    details.push({ label: t("detail.details.locations"), value: service.serviceLocations.join(", ") });
  }
  if (service.advanceBookingDays) {
    details.push({
      label: t("detail.details.advanceBooking"),
      value: t("detail.details.advanceBookingValue", { days: service.advanceBookingDays }),
    });
  }

  return (
    <>
      <Stack.Screen options={{ title: service.name }} />
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageBox}>
          {imageUri && !imageError ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.center}>
              <Wrench size={56} color="#9ca3af" strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleBlock}>
            {service.serviceCategory?.subCategory ? (
              <Text style={styles.category}>{service.serviceCategory.subCategory}</Text>
            ) : null}
            <Text style={styles.name}>{service.name}</Text>
            {service.seller ? (
              <View style={styles.inlineRow}>
                <User size={15} color={colors.foregroundSecondary} strokeWidth={1.5} />
                <Text style={styles.muted}>{displaySellerName(service.seller)}</Text>
              </View>
            ) : null}
            <View style={styles.inlineRow}>
              {rating > 0 ? (
                <>
                  <Star size={14} color={colors.accent} fill={colors.accent} strokeWidth={0} />
                  <Text style={styles.rowLabel}>{rating.toFixed(1)}</Text>
                  <Text style={styles.muted}>
                    {t("detail.summary.reviews", { count: service.reviewCount ?? 0 })}
                  </Text>
                </>
              ) : (
                <Text style={styles.muted}>{t("detail.summary.noReviews")}</Text>
              )}
            </View>
            {service.isCurrentlyAvailable != null ? (
              <Text style={[styles.availability, !service.isCurrentlyAvailable && styles.unavailable]}>
                {service.isCurrentlyAvailable
                  ? t("detail.summary.available")
                  : t("detail.summary.unavailable")}
              </Text>
            ) : null}
          </View>

          <View style={styles.priceBox}>
            {priceLine.prefix ? <Text style={styles.muted}>{priceLine.prefix}</Text> : null}
            <Text style={styles.price}>{priceLine.price}</Text>
            {priceLine.suffix ? <Text style={styles.muted}>{priceLine.suffix}</Text> : null}
          </View>

          {service.description ? <Text style={styles.description}>{service.description}</Text> : null}

          {details.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("detail.details.title")}</Text>
              {details.map((row) => (
                <View key={row.label} style={styles.row}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            {isOwnService ? (
              <Notice icon={UserRound} text={t("detail.actions.ownListing")} />
            ) : (
              <>
                {canBook && open !== "booking" && (
                  <MainButton
                    text={t("detail.actions.book")}
                    leftIcon={CalendarPlus}
                    onPress={() => openForm("booking")}
                  />
                )}
                {canBook && open === "booking" && (
                  <BookingForm
                    serviceId={service.id}
                    serviceName={service.name}
                    advanceBookingDays={service.advanceBookingDays}
                    onClose={() => setOpen(null)}
                  />
                )}
                {quoteOnly && canRequestQuote && open !== "quote" && (
                  <MainButton
                    text={t("detail.actions.requestQuote")}
                    leftIcon={FileText}
                    onPress={() => openForm("quote")}
                  />
                )}
                {quoteOnly && !canRequestQuote && (
                  <Notice icon={Info} text={t("detail.actions.quotesUnavailable")} />
                )}
                {open === "quote" && (
                  <QuoteForm serviceId={service.id} serviceName={service.name} onClose={() => setOpen(null)} />
                )}
                {/* The provider is reached through EKORU's chat; their contact
                    details stay private until there is a booking (USR-14). */}
                <MainButton
                  text={tRoot("chat.contactProvider")}
                  leftIcon={MessageCircle}
                  variant={canBook || canRequestQuote ? "outline" : "primary"}
                  loading={contacting}
                  onPress={() => void start({ itemType: "SERVICE", itemId: Number(service.id) })}
                />
                {/* A priced service can still be quoted for a tailored figure. */}
                {!quoteOnly && canRequestQuote && open !== "quote" && (
                  <MainButton
                    text={t("detail.actions.requestQuote")}
                    leftIcon={FileText}
                    variant="ghost"
                    onPress={() => openForm("quote")}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function Notice({ icon: Icon, text }: { icon: typeof Info; text: string }) {
  return (
    <View style={styles.notice}>
      <Icon size={18} color={colors.primary} strokeWidth={2} />
      <Text style={styles.noticeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 200 },
  imageBox: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#f5f5f5" },
  image: { width: "100%", height: "100%" },
  body: { padding: 16, gap: 18 },
  titleBlock: { gap: 6 },
  category: { fontSize: 13, fontFamily: "Cabin_600SemiBold", color: colors.primaryDark },
  name: { fontSize: 22, fontFamily: "Cabin_700Bold", color: colors.foreground, lineHeight: 28 },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  availability: { fontSize: 13, fontFamily: "Cabin_600SemiBold", color: colors.success },
  unavailable: { color: colors.foregroundSecondary },
  priceBox: {
    gap: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
    padding: 14,
  },
  price: { fontSize: 22, fontFamily: "Cabin_700Bold", color: colors.primary },
  muted: { fontSize: 14, fontFamily: "Cabin_400Regular", color: colors.foregroundSecondary },
  description: {
    fontSize: 15,
    fontFamily: "Cabin_400Regular",
    color: colors.foregroundSecondary,
    lineHeight: 22,
  },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontFamily: "Cabin_600SemiBold", color: colors.foreground },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: { fontSize: 14, fontFamily: "Cabin_500Medium", color: colors.foreground },
  rowValue: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primary,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
  },
  noticeText: { flex: 1, fontSize: 14, fontFamily: "Cabin_500Medium", color: colors.foregroundSecondary },
});
