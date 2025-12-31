import { View, StyleSheet, Text } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import TicketSummary from "@/components/TicketSummary";
import { useTickets } from "@/hooks/useTicket";
import { Ionicons } from "@expo/vector-icons";
import Box from "@/components/Box";

export default function UserHomeScreen() {
  const { tickets } = useTickets();
  const ticketsArray = tickets || [];

  return (
    <HomeScreen>
      <View style={styles.content}>
        <Text style={styles.description}>Bienvenido al sistema de tickets. Aquí puedes crear y gestionar tus incidencias fácilmente 😊</Text>
        <TicketSummary
          pendingCount={ticketsArray.filter((t) => t.status === "open").length}
          inProgressCount={ticketsArray.filter((t) => t.status === "in_progress").length}
          resolvedCount={ticketsArray.filter((t) => t.status === "resolved").length}
          totalCount={ticketsArray.length}
        />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={styles.optionsTitle}>Recuerda</Text>
        <View style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Ionicons name="help-circle" size={24} color="#2563eb" />
            <Text style={styles.helpTitle}>¿Si necesitas ayuda?</Text>
          </View>
          <Text style={styles.helpText}>
            Al momento de crear un ticket puedes chatear para recibir una solución instantánea.
          </Text>
        </View>
        <Text style={styles.optionsTitle}>Opciones disponibles</Text>
        <View style={styles.boxesContainer}>
          <Box
            icon={<Ionicons name="create" size={24} color="#16a34a" />}
            status="Crear Ticket"
            iconBgColor="#dcfce7"
          />

          <Box
            icon={<Ionicons name="close" size={24} color="#ea580c" />}
            status="Cerrar Ticket"
            iconBgColor="#ffedd5"
          />

          <Box
            icon={<Ionicons name="trash" size={24} color="#dc2626" />}
            status="Eliminar Ticket"
            iconBgColor="#fee2e2"
          />

          <Box
            icon={<Ionicons name="chatbubbles" size={24} color="#2563eb" />}
            status="Chat"
            iconBgColor="#dbeafe"
          />

          <Box
            icon={<Ionicons name="information-circle" size={24} color="#7c3aed" />}
            status="Detalle Ticket"
            iconBgColor="#ede9fe"
          />
        </View>

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
  helpCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 32,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  helpText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 20,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#102941",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  boxesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
});