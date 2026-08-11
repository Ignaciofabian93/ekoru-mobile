import React from "react";
import ActivityBreakdown from "../ui/environmentalImpact/ActivityBreakdown";
import CoTrend from "../ui/environmentalImpact/CoTrend";
import Header from "../ui/environmentalImpact/Header";
import InfoSection from "../ui/environmentalImpact/Info";
import Materials from "../ui/environmentalImpact/Materials";
import MetricsSummary from "../ui/environmentalImpact/MetricsSummary";
import RealExamples from "../ui/environmentalImpact/RealExamples";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";

export default function EnvironmentalImpactScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <Content>
          <MetricsSummary />

          <ActivityBreakdown />

          <CoTrend />

          <Materials />

          <RealExamples />

          <InfoSection />
        </Content>
      </ScrollContainer>
    </OuterContainer>
  );
}
