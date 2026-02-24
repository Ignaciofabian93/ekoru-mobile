import { Text } from "@/components/shared/Text/Text";
import { ScrollView, StyleSheet, View } from "react-native";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide when creating an account, making purchases, or contacting support — including name, email, and location.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your data to operate the platform, process transactions, personalize your experience, and send relevant notifications.",
  },
  {
    title: "3. Sharing Your Information",
    body: "We do not sell your personal data. We may share it with service providers necessary to operate EKORU, or when required by law.",
  },
  {
    title: "4. Location Data",
    body: "With your permission, we collect location data to show nearby listings and suggest relevant content. You can disable this in device settings.",
  },
  {
    title: "5. Cookies and Tracking",
    body: "We use cookies and similar technologies to improve user experience and analyze usage patterns on the platform.",
  },
  {
    title: "6. Data Retention",
    body: "We retain your data as long as your account is active or as needed to provide services. You may request deletion at any time.",
  },
  {
    title: "7. Security",
    body: "We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "8. Children's Privacy",
    body: "EKORU is not directed to children under 13. We do not knowingly collect personal data from minors.",
  },
  {
    title: "9. Your Rights",
    body: "Depending on your region, you may have rights to access, correct, or delete your data. Contact us at privacy@ekoru.com to exercise these rights.",
  },
  {
    title: "10. Changes to This Policy",
    body: "We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification.",
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#9ca3af",
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Cabin_600SemiBold",
    color: "#1f2937",
  },
  sectionBody: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
});
