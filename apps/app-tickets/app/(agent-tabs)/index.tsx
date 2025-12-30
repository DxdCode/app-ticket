import { View, StyleSheet, Text } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import { useAgentTickets } from "@/hooks/useAgent";
import TicketSummary from "@/components/TicketSummary";

export default function AgentHomeScreen() {

  const { tickets } = useAgentTickets()
  return (
    <HomeScreen>
      <View style={styles.content}>
        <TicketSummary
          pendingCount={tickets.filter((t) => t.status === 'open').length}
          inProgressCount={tickets.filter((t) => t.status === 'in_progress').length}
          resolvedCount={tickets.filter((t) => t.status === 'resolved').length}
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
