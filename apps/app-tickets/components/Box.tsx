import { View, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";

// Props para el componente Box
interface Props {
    icon?: ReactNode;
    value: string | number;
    status: string;
    iconBgColor?: string;
}

// Componente Box para mostrar la información como el icono, valor, estado y color de fondo del icono
export default function Box({ icon, value, status, iconBgColor = "#dbeafe" }: Props) {
    return (
        <View style={styles.container}>
            {/* Icono */}
            <View style={styles.header}>
                <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
                    {icon}
                </View>
            </View>
            {/* Valor y estado */}
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        minWidth: 150,
        flex: 1,
        
    },
    header: {
        marginBottom: 16,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    value: {
        fontSize: 36,
        fontWeight: "700",
        color: "#1a1d29",
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: "#64748b",
        fontWeight: "600",
    },
});