import StoreCard from "@/components/shared/Card/StoreCard/StoreCard";
import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { DUMMY_STORES } from "@/features/marketplace/data/dummyStores";
import { ScrollView, StyleSheet, View } from "react-native";

export default function StoresHighlight() {
  return (
    <View style={styles.container}>
      <Title level="h4" align="center">Outstanding Stores</Title>
      <Text size="sm" color="secondary" align="center" style={{ marginTop: 4 }}>
        Most popular in the community
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {DUMMY_STORES.map((store) => (
          <StoreCard key={store.id} store={store} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 0,
  },
  scroll: {
    gap: 10,
    marginVertical: 16,
  },
});
