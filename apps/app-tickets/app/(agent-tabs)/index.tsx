import { View, StyleSheet, Text } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import { useAgentTickets } from "@/hooks/useAgent";
import TicketSummary from "@/components/TicketSummary";
import Box from "@/components/Box";
import { Ionicons } from "@expo/vector-icons";

export default function AgentHomeScreen() {

  const { tickets } = useAgentTickets()
  const ticketsArray = tickets || [];

  return (
    <HomeScreen>
      <View style={styles.content}>
        <Text style={styles.description}>Gestiona los tickets mediante un chat para resolver cualquier incidencia del usuairo 😊</Text>
        <TicketSummary
          pendingCount={ticketsArray.filter((t) => t.status === 'open').length}
          inProgressCount={ticketsArray.filter((t) => t.status === 'in_progress').length}
          resolvedCount={ticketsArray.filter((t) => t.status === 'resolved').length}
          totalCount={ticketsArray.length}
        />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={styles.optionsTitle}>Opciones disponibles</Text>
        <Box
          icon={<Ionicons name="chatbubbles" size={24} color="#ffffffff" />}
          status="Chat"
          iconBgColor="#3b5fffdf"
          width="50%"
        />
        
      </View>
    </HomeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  description: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#102941",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  }
});
