import { View, StyleSheet } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import TicketSummary from "@/components/TicketSummary";
import { useTickets } from "@/hooks/useTicket";

export default function UserHomeScreen() {
  const { tickets } = useTickets();

  return (
    <HomeScreen>
      <View style={styles.content}>
        <TicketSummary
          pendingCount={tickets.filter((t) => t.status === "open").length}
          inProgressCount={tickets.filter((t) => t.status === "in_progress").length}
          resolvedCount={tickets.filter((t) => t.status === "resolved").length}
          totalCount={tickets.length}
        />
      </View>
    </HomeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 30,
  },
});