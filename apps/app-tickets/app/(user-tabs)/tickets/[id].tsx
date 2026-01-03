import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTickets } from '@/hooks/useTicket';
import { priorityColors, statusColors, priorityLabels, statusLabels } from '@/types/type-ticket';
import { Ionicons } from '@expo/vector-icons';

export default function DetailTicket() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { ticketDetail, loading, error, getTicketById } = useTickets();

    useEffect(() => {
        if (id) getTicketById(id);
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1a1d29" />
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

    if (!ticketDetail) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No se encontró el ticket</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* CAJA 1: Título, Badges, Descripción y Categoría */}
            <View style={styles.content}>
                <View>
                    <Text style={styles.sectionTitle}>Detalles del Ticket</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="document-text" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Título</Text>
                                <Text style={styles.value}>{ticketDetail.title}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="ellipse" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Estados</Text>
                                <View style={styles.badgeRow}>
                                    <Text
                                        style={[
                                            styles.badge,
                                            {
                                                backgroundColor: statusColors[ticketDetail.status].bg,
                                                color: statusColors[ticketDetail.status].text,
                                            },
                                        ]}
                                    >
                                        {statusLabels[ticketDetail.status]}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.badge,
                                            {
                                                backgroundColor: priorityColors[ticketDetail.priority].bg,
                                                color: priorityColors[ticketDetail.priority].text,
                                            },
                                        ]}
                                    >
                                        {priorityLabels[ticketDetail.priority]}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.badge,
                                            {
                                                backgroundColor: ticketDetail.isActive ? '#dcfce7' : '#fee2e2',
                                                color: ticketDetail.isActive ? '#166534' : '#991b1b',
                                            },
                                        ]}
                                    >
                                        {ticketDetail.isActive ? 'Activo' : 'Inactivo'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="list" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Descripción</Text>
                                <Text style={styles.value}>{ticketDetail.description}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.lastRow]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="pricetag" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Categoría</Text>
                                <Text style={styles.valueCapitalized}>{ticketDetail.category}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* CAJA 2: Fechas */}
                <View>
                    <Text style={styles.sectionTitle}>Información de Fechas</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="calendar" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Fecha de Creación</Text>
                                <Text style={styles.value}>
                                    {new Date(ticketDetail.timeCreated).toLocaleString('es-ES')}
                                </Text>
                            </View>
                        </View>

                        {ticketDetail.timeUpdated && (
                            <View style={[styles.infoRow, styles.lastRow]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="time" size={20} color="#1a1d29" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.label}>Última Actualización</Text>
                                    <Text style={styles.value}>
                                        {new Date(ticketDetail.timeUpdated).toLocaleString('es-ES')}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* CAJA 3: IDs */}
                <View>
                    <Text style={styles.sectionTitle}>Información Técnica</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="ticket" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>ID Ticket</Text>
                                <Text style={styles.valueMonospace}>{ticketDetail.id}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.lastRow]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="person" size={20} color="#1a1d29" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>ID Usuario</Text>
                                <Text style={styles.valueMonospace}>{ticketDetail.userId}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
    },
    content: {
        width: '100%',
        gap: 24,
        maxWidth: 800,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1d29',
        marginBottom: 16,
        lineHeight: 30,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#102941',
        marginBottom: 12,
        paddingLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    value: {
        fontSize: 15,
        fontWeight: '400',
        color: '#1e293b',
    },
    valueCapitalized: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        textTransform: 'capitalize',
    },
    valueMonospace: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1e293b',
        fontFamily: 'monospace',
    },
});