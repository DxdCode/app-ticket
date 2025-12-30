import { View, Text, StyleSheet, ScrollView } from "react-native";
import useUser from "@/hooks/useUser";
import { Role } from "@/types/type-user";
import { ReactNode } from "react";


// Mapeo de roles a etiquetas 
const ROLE_LABELS: Record<Role, string> = {
    [Role.Agente]: "Agente",
    [Role.User]: "Usuario",
    [Role.Ia]: "IA",
};

interface HomeScreenProps {
    children: ReactNode;
}

export default function HomeScreen({ children }: HomeScreenProps) {
    const { user } = useUser();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.greetingText}>
                        Bienvenido {user?.username
                            ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                            : "Invitado"}
                    </Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {ROLE_LABELS[user?.role || Role.User]}
                        </Text>
                    </View>
                </View>
            </View>

            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        width: "100%",
        paddingTop: 24,
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    greetingText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000000",
    },
    badge: {
        backgroundColor: "#2978df",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#f7f8fc",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});