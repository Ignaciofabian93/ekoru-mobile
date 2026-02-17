import type { Product } from "@/features/marketplace/types/Product";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CardBackSide from "./BackSide";
import CardFrontSide from "./FrontSide";

interface Props {
  product: Product;
  onPress?: () => void;
  onShowImpact?: () => void;
}

const TIMING_CONFIG = { duration: 400, easing: Easing.inOut(Easing.ease) };

export default function MarketplaceCard({
  product,
  onPress = () => {},
  onShowImpact = () => {},
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const flip = () => {
    const toValue = isFlipped ? 0 : 1;
    rotation.value = withTiming(toValue, TIMING_CONFIG);
    setIsFlipped(!isFlipped);
  };

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 0.5, 1], [0, 90, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value > 0.5 ? 0 : 1,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 0.5, 1], [180, 90, 0]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value > 0.5 ? 1 : 0,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.face, frontStyle]}
        pointerEvents={isFlipped ? "none" : "auto"}
      >
        <CardFrontSide product={product} onFlip={flip} onPress={onPress} />
      </Animated.View>
      <Animated.View
        style={[styles.face, backStyle]}
        pointerEvents={isFlipped ? "auto" : "none"}
      >
        <CardBackSide
          product={product}
          onFlip={flip}
          onShowImpact={onShowImpact}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 300,
  },
  face: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
