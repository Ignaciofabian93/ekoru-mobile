import React from "react";
import ChangePasswordForm from "../ui/changePassword/Form";
import Header from "../ui/changePassword/Header";
import { Content, OuterContainer, ScrollContainer } from "../ui/layout/Container";

export default function ChangePasswordScreen() {
  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer enableContentContainerStyle>
        <Header />
        <Content>
          <ChangePasswordForm />
        </Content>
      </ScrollContainer>
    </OuterContainer>
  );
}
