import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAgentTickets } from '@/hooks/useAgent';
import CardTickets from '@/components/CardTickets';
import { router } from 'expo-router';
import useUser from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Status, Priority, Categories } from '@/types/type-ticket';
import FilterTickets from '@/components/TicketByFilter';

export default function Tickets() {
    const {
        getAgentTickets,
        tickets,
        loading,
        error,
    } = useAgentTickets();

    const { user } = useUser();
    const [refreshing, setRefreshing] = useState(false);

    const [activeStatus, setActiveStatus] = useState<Status | 'all'>('all');
    const [activePriority, setActivePriority] = useState<Priority | 'todas'>('todas');
    const [activeCategory, setActiveCategory] = useState<Categories | 'todas'>('todas');

    useEffect(() => {
        getAgentTickets();
    }, []);

    const handleChat = (id: string) => {
        router.push(`/(agent-tabs)/tickets/message?id=${id}`);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setActiveStatus('all');
        setActivePriority('todas');
        setActiveCategory('todas');
        await getAgentTickets();
        setRefreshing(false);
    };

    const handleStatusChange = async (status: Status | 'all') => {
        setActiveStatus(status);
        await applyFilters(status, activePriority, activeCategory);
    };

    const handlePriorityChange = async (priority: Priority | 'todas') => {
        setActivePriority(priority);
        await applyFilters(activeStatus, priority, activeCategory);
    };

    const handleCategoryChange = async (category: Categories | 'todas') => {
        setActiveCategory(category);
        await applyFilters(activeStatus, activePriority, category);
    };

    const applyFilters = async (
        status: Status | 'all',
        priority: Priority | 'todas',
        category: Categories | 'todas'
    ) => {
        const filters: any = {};
        
        if (status !== 'all') {
            filters.status = status;
        }
        
        if (priority !== 'todas') {
            filters.priority = priority;
        }
        
        if (category !== 'todas') {
            filters.category = category;
        }

        await getAgentTickets(filters);
    };

    const ticketsArray = tickets || [];

    const statusCounts = {
        all: ticketsArray.length,
        in_progress: ticketsArray.filter(t => t.status === 'in_progress').length,
        open: ticketsArray.filter(t => t.status === 'open').length,
        resolved: ticketsArray.filter(t => t.status === 'resolved').length,
    };

    const priorityCounts = {
        todas: ticketsArray.length,
        alta: ticketsArray.filter(t => t.priority === 'alta').length,
        media: ticketsArray.filter(t => t.priority === 'media').length,
        baja: ticketsArray.filter(t => t.priority === 'baja').length,
    };

    const categoryCounts = {
        todas: ticketsArray.length,
        login: ticketsArray.filter(t => t.category === 'login').length,
        pago: ticketsArray.filter(t => t.category === 'pago').length,
        cuenta: ticketsArray.filter(t => t.category === 'cuenta').length,
        tecnico: ticketsArray.filter(t => t.category === 'tecnico').length,
        otro: ticketsArray.filter(t => t.category === 'otro').length,
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 16, backgroundColor: '#ffffff' }}>
                <Text style={styles.screenTitle}>Gestionar Tickets</Text>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <FilterTickets
                    activeStatus={activeStatus}
                    activePriority={activePriority}
                    activeCategory={activeCategory}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onCategoryChange={handleCategoryChange}
                    statusCounts={statusCounts}
                    priorityCounts={priorityCounts}
                    categoryCounts={categoryCounts}
                />
            </View>

            <View style={styles.listContainer}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Mis tickets</Text>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRefresh}
                        disabled={refreshing || loading}
                    >
                        <Ionicons
                            name={refreshing ? 'reload' : 'refresh'}
                            size={20}
                            color="#ffffff"
                        />
                        <Text style={styles.refreshText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={ticketsArray} 
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
                    showsVerticalScrollIndicator={Platform.OS === 'web'}
                    contentContainerStyle={styles.listContent}
                    style={Platform.OS === 'web' ? styles.webList : undefined}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyBox}>
                                <Ionicons
                                    name="folder-open-outline"
                                    size={64}
                                    color="#cbd5e1"
                                />
                                <Text style={styles.emptyText}>
                                    No hay tickets
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </View>
    );
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
    },
    screenTitle: {
        fontSize: 32,
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
    listContainer: {
        flex: 1,
        padding: 16,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    webList: {
        flex: 1,
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
