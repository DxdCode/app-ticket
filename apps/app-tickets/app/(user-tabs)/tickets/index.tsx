import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTabBarVisibility } from "@/hooks/useTabBarVisibility";
import { useTickets } from "@/hooks/useTicket";
import useUser from "@/hooks/useUser";
import CardTickets from "@/components/CardTickets";
import ModalSheet from "@/components/ModalSheet";
import FormTicket from "@/components/FormTicket";
import ConfirmDialog from "@/components/ConfirmDialog";
import TicketFilters, { FilterType } from "@/components/TicketFilters";

export default function Tickets() {
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const { tickets, loading, error, deleteTicket, getTickets, closeTicketStatus } = useTickets();
    const { user } = useUser();
    const router = useRouter();

    useTabBarVisibility(!modalVisible);

    const handleViewDetail = (id: string) => {
        router.push(`/(user-tabs)/tickets/${id}`);
    };

    const handleChat = (id: string) => {
        router.push(`/(user-tabs)/tickets/messages?id=${id}`);
    };

    const handleClose = (id: string) => {
        setConfirmCloseId(id);
    };

    const confirmClose = async () => {
        if (!confirmCloseId) return;
        const success = await closeTicketStatus(confirmCloseId);
        if (success) setConfirmCloseId(null);
    };

    const handleDelete = (id: string) => {
        setConfirmDeleteId(id);
    };


    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        await deleteTicket(confirmDeleteId);
        setConfirmDeleteId(null);
    };


    // Filtrar tickets según el filtro activo
    const ticketsArray = tickets || [];
    const getFilteredTickets = () => {
        if (activeFilter === 'all') {
            return ticketsArray;
        }
        return ticketsArray.filter(ticket => ticket.status === activeFilter);
    }
    const filteredTickets = getFilteredTickets();

    // Contar tickets por estado
    const ticketCounts = {
        all: ticketsArray.length,
        in_progress: ticketsArray.filter(t => t.status === 'in_progress').length,
        open: ticketsArray.filter(t => t.status === 'open').length,
        resolved: ticketsArray.filter(t => t.status === 'resolved').length,
    };

    // Refrescar tickets
    const handleRefresh = async () => {
        setRefreshing(true);
        await getTickets();
        setRefreshing(false);
        setActiveFilter('all');
    }

    if (loading && !ticketsArray.length) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1a1d29" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ padding: 16, backgroundColor: '#ffffff' }}>
                <Text style={styles.screenTitle}>Gestionar mis tickets</Text>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
                <TicketFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    ticketCounts={ticketCounts}

                />
            </View>
            <View style={styles.listContainer}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Mis tickets</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRefresh}
                        disabled={refreshing}
                    >
                        <Ionicons
                            name="refresh"
                            size={20}
                            color="#ffffffff"
                        />
                        <Text style={styles.refreshText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredTickets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CardTickets
                            {...item}
                            currentUser={user}
                            onViewDetail={handleViewDetail}
                            onDelete={handleDelete}
                            onChat={handleChat}
                            onClose={handleClose}
                        />
                    )}
                    showsVerticalScrollIndicator={Platform.OS === 'web'}
                    contentContainerStyle={styles.listContent}
                    style={Platform.OS === 'web' ? styles.webList : undefined}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyBox}>
                                <Ionicons name="folder-open-outline" size={64} color="#535353ff" />
                                <Text style={styles.emptyText}>No hay tickets</Text>
                            </View>
                        ) : null
                    }
                />
                <ModalSheet
                    visible={modalVisible}
                    title="Nuevo Ticket"
                    onClose={() => setModalVisible(false)}
                >
                    <FormTicket
                        onClose={() => setModalVisible(false)}
                        onCreated={() => getTickets()}
                    />
                </ModalSheet>

                <ConfirmDialog
                    visible={confirmDeleteId !== null}
                    title="Eliminar Ticket"
                    message="¿Estás seguro que deseas eliminar este ticket? Esta acción no se puede deshacer."
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="danger"
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmDeleteId(null)}
                />

                <ConfirmDialog
                    visible={confirmCloseId !== null}
                    title="Cerrar Ticket"
                    message="¿Estás seguro que deseas cerrar este ticket?"
                    confirmText="Cerrar"
                    cancelText="Cancelar"
                    variant="warning"
                    onConfirm={confirmClose}
                    onCancel={() => setConfirmCloseId(null)}
                />
            </View>
            <TouchableOpacity
                style={styles.floatingActionButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1a1d29",
        marginBottom: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#102941",
        marginBottom: 12,
        paddingLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#2978df',
    },
    refreshText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ece6e6ff',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#535353ff',
        fontSize: 16,
    },
    listContainer: {
        flex: 1,
        padding: 16,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    webList: {
        flex: 1,
    },
    floatingActionButton: {
        position: "absolute",
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#1a1d29",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});