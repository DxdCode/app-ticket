import { View, StyleSheet, Text, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import { useAgentTickets } from "@/hooks/useAgent";
import Box from "@/components/Box";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function AgentHomeScreen() {
  const { tickets, getAgentTickets } = useAgentTickets();
  const ticketsArray = tickets || [];
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useFocusEffect(
    useCallback(() => {
      getAgentTickets();
    }, [])
  );

  // Contadores de estado
  const pendingCount = ticketsArray.filter((t) => t.status === 'open').length;
  const inProgressCount = ticketsArray.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = ticketsArray.filter((t) => t.status === 'resolved').length;

  // Contadores de prioridad
  const highPriorityCount = ticketsArray.filter((t) => t.priority === 'alta').length;
  const mediumPriorityCount = ticketsArray.filter((t) => t.priority === 'media').length;
  const lowPriorityCount = ticketsArray.filter((t) => t.priority === 'baja').length;

  return (
    <HomeScreen>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con descripción */}
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Panel de Agente</Text>
          <Text style={styles.description}>
            Gestiona los tickets mediante un chat para resolver cualquier incidencia del usuario 😊
          </Text>
        </View>

        {/* Dashboard de Prioridades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridades</Text>

          {isTablet ? (
            // Grid layout para tablet/PC
            <View style={styles.priorityGrid}>
              <Box
                icon={<Ionicons name="alert-circle" size={28} color="#ffffff" />}
                status="Alta"
                value={highPriorityCount}
                iconBgColor="#ef4444"
              />
              <Box
                icon={<Ionicons name="warning" size={28} color="#ffffff" />}
                status="Media"
                value={mediumPriorityCount}
                iconBgColor="#f59e0b"
              />
              <Box
                icon={<Ionicons name="information-circle" size={28} color="#ffffff" />}
                status="Baja"
                value={lowPriorityCount}
                iconBgColor="#10b981"
              />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              <Box
                icon={<Ionicons name="alert-circle" size={28} color="#ffffff" />}
                status="Alta"
                value={highPriorityCount}
                iconBgColor="#ef4444"
              />
              <Box
                icon={<Ionicons name="warning" size={28} color="#ffffff" />}
                status="Media"
                value={mediumPriorityCount}
                iconBgColor="#f59e0b"
              />
              <Box
                icon={<Ionicons name="information-circle" size={28} color="#ffffff" />}
                status="Baja"
                value={lowPriorityCount}
                iconBgColor="#10b981"
              />
            </ScrollView>
          )}
        </View>

        {/* Estadísticas Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#3b82f6' }]}>
                <Ionicons name="time-outline" size={24} color="#ffffff" />
              </View>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#fbbf24' }]}>
                <Ionicons name="hourglass-outline" size={24} color="#ffffff" />
              </View>
              <Text style={styles.statNumber}>{inProgressCount}</Text>
              <Text style={styles.statLabel}>En Proceso</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#22c55e' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
              </View>
              <Text style={styles.statNumber}>{resolvedCount}</Text>
              <Text style={styles.statLabel}>Resueltos</Text>
            </View>
          </View>
        </View>

        {/* Opciones de Acción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#6366f1' }]}>
              <Ionicons name="chatbubbles" size={28} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Chat</Text>
              <Text style={styles.actionSubtitle}>Responde a los usuarios</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#0ea5e9' }]}>
              <Ionicons name="time" size={28} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Historial</Text>
              <Text style={styles.actionSubtitle}>Revisa todo el historial de los tickets</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </HomeScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    marginTop: 8,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#102941",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 8,

  },
  priorityGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  horizontalScroll: {
    paddingRight: 20,
    paddingLeft: 4,
    gap: 12,
    padding: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statCircle: {
    width: 52,
    height: 52,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#102941',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102941',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
});