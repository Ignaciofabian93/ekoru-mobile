import Input from "@/components/shared/Input/Input";
import Select, { Option } from "@/components/shared/Select/Select";
import { Title } from "@/components/shared/Title/Title";
import Colors from "@/constants/Colors";
import { PHONE_PREFIXES, isoToFlag } from "@/constants/phonePrefixes";
import { ContactMethod } from "@/types/enums";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { NAMESPACE } from "./i18n";

export type ContactFormValues = {
  phone: string;
  phonePrefix: string;
  website: string;
  preferredContactMethod: ContactMethod | "";
  instagram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
};

interface ContactFormProps {
  values: ContactFormValues;
  onChange: <K extends keyof ContactFormValues>(key: K, value: string) => void;
}

const CONTACT_METHOD_VALUES: ContactMethod[] = [
  "EMAIL",
  "WHATSAPP",
  "PHONE",
  "INSTAGRAM",
  "FACEBOOK",
  "WEBSITE",
  "TIKTOK",
];

const PREFIX_OPTIONS: Option[] = PHONE_PREFIXES.map((p) => ({
  label: `${isoToFlag(p.iso)} (${p.dialCode})`,
  value: p.dialCode,
}));

export default function ContactForm({ values, onChange }: ContactFormProps) {
  const { t } = useTranslation(NAMESPACE);

  const contactMethodOptions: Option[] = CONTACT_METHOD_VALUES.map((m) => ({
    label: t(`contactMethod_${m}`),
    value: m,
  }));

  return (
    <>
      <Title level="h6" weight="semibold" style={styles.sectionTitle}>
        {t("contact")}
      </Title>
      <View style={styles.card}>
        {/* ── Phone ──────────────────────────────────────────────────────────── */}
        <View style={styles.phoneFieldWrap}>
          <Text style={styles.phoneLabel}>{t("phone")}</Text>
          <View style={styles.phoneRow}>
            <View style={styles.phonePrefixWrap}>
              <Select
                options={PREFIX_OPTIONS}
                value={values.phonePrefix}
                onChange={(v) => onChange("phonePrefix", v as string)}
                placeholder="+?"
                width="full"
                searchEnabled
                noResultsText={t("noResults") ?? "No results"}
              />
            </View>
            <View style={styles.phoneInputWrap}>
              <Input
                value={values.phone}
                onChangeText={(v) => onChange("phone", v)}
                placeholder={t("phonePlaceholder")}
                type="number"
                width="full"
              />
            </View>
          </View>
        </View>

        <Input
          label={t("website")}
          value={values.website}
          onChangeText={(v) => onChange("website", v)}
          placeholder={t("websitePlaceholder")}
        />
        <Select
          label={t("preferredContactMethod")}
          options={contactMethodOptions}
          value={values.preferredContactMethod || undefined}
          placeholder={t("preferredContactMethodPlaceholder")}
          onChange={(v) => onChange("preferredContactMethod", v as string)}
          searchEnabled={false}
        />

        {/* ── Social media ─────────────────────────────────────────────────── */}
        <Title level="h6" weight="semibold" style={styles.subSectionTitle}>
          {t("socialMedia")}
        </Title>
        <View style={styles.socialGrid}>
          <View style={styles.socialItem}>
            <Input
              label="Instagram"
              value={values.instagram}
              onChangeText={(v) => onChange("instagram", v)}
              placeholder="@username"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.socialItem}>
            <Input
              label="Facebook"
              value={values.facebook}
              onChangeText={(v) => onChange("facebook", v)}
              placeholder="@page"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.socialGrid}>
          <View style={styles.socialItem}>
            <Input
              label="TikTok"
              value={values.tiktok}
              onChangeText={(v) => onChange("tiktok", v)}
              placeholder="@username"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.socialItem}>
            <Input
              label="LinkedIn"
              value={values.linkedin}
              onChangeText={(v) => onChange("linkedin", v)}
              placeholder="profile-name"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 8,
    marginHorizontal: 20,
  },
  subSectionTitle: {
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    gap: 16,
  },
  phoneFieldWrap: {
    gap: 6,
  },
  phoneLabel: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: Colors.foreground,
  },
  phoneRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  phonePrefixWrap: {
    width: 120,
  },
  phoneInputWrap: {
    flex: 1,
  },
  socialGrid: {
    flexDirection: "row",
    gap: 12,
  },
  socialItem: {
    flex: 1,
  },
});
