import { View, Text, StyleSheet } from "react-native";
import Box from "@/components/Box";
import { Ionicons } from "@expo/vector-icons";

interface TicketSummaryProps {
    pendingCount: number;
    inProgressCount: number;
    resolvedCount: number;
    totalCount: number;
    
}
export default function TicketSummary(props: TicketSummaryProps) {
    return (
        <View>
            {/* Subtítulo */}
            <Text style={styles.subtitle}>Resumén de Tickets</Text>

            {/* Contenedor de las cajas de resumen */}
            <View style={styles.boxesContainer}>
                <Box
                    icon={<Ionicons name="time-outline" size={24} color="#f59e0b" />}
                    value={props.pendingCount}
                    status="Pendientes"
                    iconBgColor="#fef3c7"
                />
                <Box
                    icon={<Ionicons name="reload" size={24} color="#2978df" />}
                    value={props.inProgressCount}
                    status="En Proceso"
                    iconBgColor="#dbeafe"
                />
                <Box
                    icon={<Ionicons name="checkmark-circle" size={24} color="#41cc59" />}
                    value={props.resolvedCount}
                    status="Resueltos"
                    iconBgColor="#d1fae5"
                />
                <Box
                    icon={<Ionicons name="stats-chart" size={24} color="#6366f1" />}
                    value={props.totalCount}
                    status="Total"
                    iconBgColor="#e0e7ff"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#102941",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    boxesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
    },
});
