import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import { User } from "@/types/type-user";

type Props = {
    user?: User | null;
    loading?: boolean;
    error?: string | null;
    onLogout?: () => Promise<void> | void;
};

export default function Profile({
    user,
    loading,
    error,
    onLogout,
}: Props) {

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2978df" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
            </View>
        );
    }

    const logout = () => onLogout?.();


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.profileTitle}>Mi Perfil</Text>
            {/* Avatar centrado */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.username[0].toUpperCase() || "U"}
                    </Text>
                </View>
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Información personal */}
                <View>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="person" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Nombre de Usuario</Text>
                                <Text style={styles.value}>
                                    {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="mail" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Correo Electrónico</Text>
                                <Text style={styles.value}>{user.email}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.lastRow]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="shield-checkmark" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Rol</Text>
                                <Text style={styles.value}>
                                    {user.role?.toString().toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Información adicional */}
                <View>
                    <Text style={styles.sectionTitle}>Información Adicional</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="calendar" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Fecha de Registro</Text>
                                <Text style={styles.value}>
                                    {new Date(user.created).toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="ellipse"
                                    size={20}
                                    color={user.isActive ? "#41cc59" : "#ff4d4d"}
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Estado</Text>
                                <Text style={styles.value}>{user.isActive ? "Activo" : "Inactivo"}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.lastRow]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="information-circle" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Acerca de</Text>
                                <Text style={styles.value}>Versión 1.0.0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Opciones */}
                <View>
                    <Text style={styles.sectionTitle}>Opciones</Text>
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonHalf}>
                            <Button
                                title="Editar Perfil"
                                variant="secondary"
                                onPress={() => alert("Próximamente ...")}
                                icon={<Ionicons name="create" size={20} color="#64748b" />}
                            />
                        </View>

                        <View style={styles.buttonHalf}>
                            <Button
                                title="Cambiar Contraseña"
                                variant="secondary"
                                onPress={() => alert("Próximamente ...")}
                                icon={<Ionicons name="key" size={20} color="#64748b" />}
                            />
                        </View>
                    </View>

                    <Button
                        title="Cerrar Sesión"
                        onPress={logout}
                        icon={<Ionicons name="log-out" size={20} color="#ffffff" />}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Layout principal
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    profileTitle: {
        marginTop: 24,
        fontSize: 28,
        fontWeight: "700",
        color: "#000000",
        textAlign: "center",
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#131212ff',
    },

    // Avatar section (sin fondo oscuro)
    avatarSection: {
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: "#f8fafc",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#1e293b",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    avatarText: {
        fontSize: 56,
        fontWeight: "700",
        color: "#ffffff",
    },

    // Contenido principal
    content: {
        width: "100%",
        gap: 24,
        maxWidth: 800,
        alignSelf: "center",
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#102941",
        marginBottom: 12,
        paddingLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    // Filas de información
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 12,
    },
    lastRow: {
        paddingBottom: 0,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#94a3b8",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontWeight: "600",
    },
    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1e293b",
    },

    // Botones
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    buttonHalf: {
        flex: 1,
    },
});