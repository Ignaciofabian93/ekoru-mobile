import { Text } from "@/components/shared/Text/Text";
import { ScrollView, StyleSheet, View } from "react-native";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using EKORU, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.",
  },
  {
    title: "2. Use of the Platform",
    body: "EKORU is a marketplace for sustainable products and services. You agree to use it only for lawful purposes and in accordance with these terms.",
  },
  {
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
  },
  {
    title: "4. Listings and Transactions",
    body: "Sellers are responsible for the accuracy of their listings. EKORU does not guarantee the quality, safety, or legality of items listed.",
  },
  {
    title: "5. Prohibited Content",
    body: "You may not list or promote items that are illegal, hazardous, counterfeit, or otherwise violate our community guidelines.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on EKORU, including logos, design, and text, is owned by or licensed to EKORU and may not be reproduced without permission.",
  },
  {
    title: "7. Limitation of Liability",
    body: "EKORU is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    title: "8. Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.",
  },
  {
    title: "9. Contact",
    body: "For questions about these Terms, please contact us at legal@ekoru.com.",
  },
];

export default function TermsOfServiceScreen() {
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
