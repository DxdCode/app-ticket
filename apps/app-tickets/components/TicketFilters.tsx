import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export type FilterType = 'all' | 'in_progress' | 'open' | 'resolved';

interface Props {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    ticketCounts: Record<FilterType, number>;
}

const FILTERS = [
    { key: 'all', label: 'Todos' },
    { key: 'open', label: 'Abiertos' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'resolved', label: 'Resueltos' },
] as const;

export default function TicketFilters({
    activeFilter,
    onFilterChange,
    ticketCounts,
}: Props) {
    return (
        <View style={{ marginBottom: 6}}>
            <Text style={styles.title}>Filtrar Tickets</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 5 }}
            >
                {FILTERS.map(filter => {
                    const isActive = activeFilter === filter.key;
                    const count = ticketCounts[filter.key];

                    return (
                        <TouchableOpacity
                            key={filter.key}
                            style={[styles.chip, isActive && styles.activeChip]}
                            onPress={() => onFilterChange(filter.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.label, isActive && styles.activeLabel]}>
                                {filter.label}
                            </Text>
                            <View style={[styles.badge, isActive && styles.activeBadge]}>
                                <Text style={[styles.count, isActive && styles.activeCount]}>
                                    {count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#102941',
        textTransform: 'uppercase',
        paddingBottom: 12
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: 'transparent',
        gap: 6,
    },
    activeChip: {
        backgroundColor: '#1a1d29',
        borderColor: '#1a1d29',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeLabel: {
        color: '#fff',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: '#e5e5e5',
        minWidth: 24,
        alignItems: 'center',
    },
    activeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    count: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
    },
    activeCount: {
        color: '#fff',
    },
});