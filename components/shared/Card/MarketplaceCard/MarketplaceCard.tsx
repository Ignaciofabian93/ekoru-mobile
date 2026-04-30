import type { Product } from "@/features/marketplace/types/Product";
import { useState } from "react";
import { type StyleProp, type ViewStyle, StyleSheet, View } from "react-native";
import CardBackSide from "./BackSide";
import CardFrontSide from "./FrontSide";

interface Props {
  product: Product;
  onPress?: () => void;
  onShowImpact?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function MarketplaceCard({
  product,
  onPress = () => {},
  onShowImpact = () => {},
  style,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Front face — hidden when flipped */}
      <View
        style={[styles.face, { opacity: isFlipped ? 0 : 1 }]}
        pointerEvents={isFlipped ? "none" : "auto"}
      >
        <CardFrontSide product={product} onFlip={flip} onPress={onPress} />
      </View>
      {/* Back face — hidden when not flipped */}
      <View
        style={[styles.face, { opacity: isFlipped ? 1 : 0 }]}
        pointerEvents={isFlipped ? "auto" : "none"}
      >
        <CardBackSide
          product={product}
          onFlip={flip}
          onShowImpact={onShowImpact}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 174,
    height: 300,
  },
  face: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
