import React from "react";
import { OuterContainer, ScrollContainer } from "../ui/layout/Container";
import AboutSection from "../ui/settings/AboutSection";
import CurrencySection from "../ui/settings/CurrencySection";
import LanguagesSection from "../ui/settings/LanguagesSection";
import NotificationsSection from "../ui/settings/NotificationsSection";
import SecuritySection from "../ui/settings/SecuritySection";

export default function SettingsScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        {/* Notifications */}
        <NotificationsSection />

        {/* Security */}
        <SecuritySection />

        {/* Language */}
        <LanguagesSection />

        {/* Currency */}
        <CurrencySection />

        {/* About */}
        <AboutSection />
      </ScrollContainer>
    </OuterContainer>
  );
}
