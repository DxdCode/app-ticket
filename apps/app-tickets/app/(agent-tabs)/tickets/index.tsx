import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAgentTickets } from '@/hooks/useAgent';
import CardTickets from '@/components/CardTickets';
import { router } from 'expo-router';
import useUser from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import TicketFilters, { FilterType } from '@/components/TicketFilters';

export default function Tickets() {
    const { getAgentTickets, tickets, loading, error } = useAgentTickets();
    const { user } = useUser();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    useEffect(() => {
        getAgentTickets();
    }, []);

    const handleChat = (id: string) => {
        router.push(`/(agent-tabs)/tickets/message?id=${id}`);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await getAgentTickets();
        setRefreshing(false);
        setActiveFilter('all')

    }

    // Filtrar tickets según el filtro activo
    const ticketsArray = tickets || [];

    const getFilteredTickets = () => {
        if (activeFilter === 'all') {
            return ticketsArray;
        }
        return ticketsArray.filter(ticket => ticket.status === activeFilter);
    };

    const filteredTickets = getFilteredTickets();

    // Contar tickets por estado
    const ticketCounts = {
        all: ticketsArray.length,
        in_progress: ticketsArray.filter(t => t.status === 'in_progress').length,
        open: ticketsArray.filter(t => t.status === 'open').length,
        resolved: ticketsArray.filter(t => t.status === 'resolved').length,
    };

    return (
        <View style={styles.container}>

            <View style={{ padding: 16, backgroundColor: '#ffffff' }}>
                <Text style={styles.screenTitle}>Gestionar Tickets</Text>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <TicketFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    ticketCounts={ticketCounts}
                />
            </View>

            <View style={{ padding: 16 }}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Mis tickets</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRefresh}
                        disabled={refreshing}
                    >
                        <Ionicons
                            name={refreshing ? "reload" : "refresh"}
                            size={20}
                            color="#ffffff"
                        />
                        <Text style={styles.refreshText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
                {/* Lista de tickets filtrados */}
                <FlatList
                    data={filteredTickets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CardTickets
                            {...item}
                            currentUser={user}
                            onChat={handleChat}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyBox}>
                                <Ionicons name="folder-open-outline" size={64} color="#cbd5e1" />
                                <Text style={styles.emptyText}>
                                    {activeFilter === 'all'
                                        ? 'No hay tickets'
                                        : `No hay tickets ${activeFilter === 'in_progress' ? 'en progreso' :
                                            activeFilter === 'open' ? 'abiertos' : 'resueltos'
                                        }`
                                    }
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#102941',
        textTransform: 'uppercase',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 8,
    },
    screenTitle: {
        fontSize: 36,
        fontWeight: "700",
        color: "#000000",
        marginBottom: 14,
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
        color: '#ffffff',
    },
    listContent: {
        paddingBottom: 16,
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '500',
    },
});