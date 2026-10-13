import ThreadScreen from "@/features/chat/screens/ThreadScreen";
import { useLocalSearchParams } from "expo-router";

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ThreadScreen key={id} conversationId={Number(id)} />;
}
