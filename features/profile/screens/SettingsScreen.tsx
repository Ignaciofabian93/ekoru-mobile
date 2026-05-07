import React from "react";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";
import AboutSection from "../ui/settings/AboutSection";
import CurrencySection from "../ui/settings/CurrencySection";
import Header from "../ui/settings/Header";
import LanguagesSection from "../ui/settings/LanguagesSection";
import NotificationsSection from "../ui/settings/NotificationsSection";
import SecuritySection from "../ui/settings/SecuritySection";

export default function SettingsScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <Content>
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
        </Content>
      </ScrollContainer>
    </OuterContainer>
  );
}
