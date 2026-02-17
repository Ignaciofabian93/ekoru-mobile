import Colors from "@/constants/Colors";
import {
  Package2,
  ScanBarcode,
  Store,
  TrendingUp,
  UsersRound,
} from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatsSection() {
  const stats = [
    { title: "Active Users", value: "1,234", icon: UsersRound },
    { title: "Products circulating", value: "567", icon: Package2 },
    { title: "Sustainable Stores", value: "89", icon: Store },
    { title: "Sustainable Services", value: "45", icon: ScanBarcode },
    { title: "Active Initiatives", value: "12", icon: TrendingUp },
  ];

  const StatCard = ({
    title,
    value,
    Icon,
  }: {
    title: string;
    value: string;
    Icon: any;
  }) => (
    <View style={styles.cardContainer}>
      <View
        style={{
          backgroundColor: Colors.primary,
          padding: 12,
          borderRadius: 100,
          marginBottom: 8,
        }}
      >
        <Icon size={24} color={"#fff"} />
      </View>
      <Text style={{ marginTop: 4, fontSize: 24, fontWeight: "bold" }}>
        {value}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "#1e1e1e",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        This is already happening
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "#555",
          marginTop: 8,
        }}
      >
        An active community changing the way to consume.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16 }}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            Icon={stat.icon}
          />
        ))}
      </ScrollView>
      <Text
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#555",
        }}
      >
        People, products, stores and services are already part of the circular
        economy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  cardContainer: {
    width: 170,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 16,
    flexDirection: "column",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
