import React from "react";
import EmptyState from "../ui/favorites/EmptyState";
import Header from "../ui/favorites/Header";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";

export default function FavoritesScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <Content>
          <EmptyState />
        </Content>
      </ScrollContainer>
    </OuterContainer>
  );
}
