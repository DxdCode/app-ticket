import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalSheet from '@/components/ModalSheet';
import { Status, Priority, Categories } from '@/types/type-ticket';

type FilterType = 'status' | 'priority' | 'category';

interface FilterOption<T> {
    key: T;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

interface TicketFiltersProps {
    activeStatus: Status | 'all';
    activePriority: Priority | 'todas';
    activeCategory: Categories | 'todas';
    onStatusChange: (status: Status | 'all') => void;
    onPriorityChange: (priority: Priority | 'todas') => void;
    onCategoryChange: (category: Categories | 'todas') => void;
    statusCounts?: Record<Status | 'all', number>;
    priorityCounts?: Record<Priority | 'todas', number>;
    categoryCounts?: Record<Categories | 'todas', number>;
}

const FILTERS = {
    status: {
        title: 'Filtrar por Estado',
        label: 'Estado:',
        options: [
            { key: 'all', label: 'Todos', icon: 'albums-outline' },
            { key: 'open', label: 'Abiertos', icon: 'mail-open-outline' },
            { key: 'in_progress', label: 'En Progreso', icon: 'time-outline' },
            { key: 'resolved', label: 'Resueltos', icon: 'checkmark-done-outline' },
        ] as FilterOption<Status | 'all'>[],
    },
    priority: {
        title: 'Filtrar por Prioridad',
        label: 'Prioridad:',
        options: [
            { key: 'todas', label: 'Todas', icon: 'list-outline' },
            { key: 'alta', label: 'Alta', icon: 'arrow-up-circle-outline' },
            { key: 'media', label: 'Media', icon: 'remove-circle-outline' },
            { key: 'baja', label: 'Baja', icon: 'arrow-down-circle-outline' },
        ] as FilterOption<Priority | 'todas'>[],
    },
    category: {
        title: 'Filtrar por Categoría',
        label: 'Categoría:',
        options: [
            { key: 'todas', label: 'Todas', icon: 'apps-outline' },
            { key: 'login', label: 'Login', icon: 'log-in-outline' },
            { key: 'pago', label: 'Pago', icon: 'card-outline' },
            { key: 'cuenta', label: 'Cuenta', icon: 'person-outline' },
            { key: 'tecnico', label: 'Técnico', icon: 'build-outline' },
            { key: 'otro', label: 'Otro', icon: 'ellipsis-horizontal-outline' },
        ] as FilterOption<Categories | 'todas'>[],
    },
};

export default function TicketFilters(props: TicketFiltersProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterType, setFilterType] = useState<FilterType>('status');

    const config = {
        status: {
            active: props.activeStatus,
            onChange: props.onStatusChange,
            counts: props.statusCounts,
        },
        priority: {
            active: props.activePriority,
            onChange: props.onPriorityChange,
            counts: props.priorityCounts,
        },
        category: {
            active: props.activeCategory,
            onChange: props.onCategoryChange,
            counts: props.categoryCounts,
        },
    };

    const openModal = (type: FilterType) => {
        setFilterType(type);
        setModalVisible(true);
    };

    const handleSelect = (
        value: Status | 'all' | Priority | 'todas' | Categories
    ) => {
        if (filterType === 'status') {
            props.onStatusChange(value as Status | 'all');
        } else if (filterType === 'priority') {
            props.onPriorityChange(value as Priority | 'todas');
        } else {
            props.onCategoryChange(value as Categories | 'todas');
        }
        setModalVisible(false);
    };

    const currentFilter = FILTERS[filterType];
    const currentConfig = config[filterType];

    return (
        <>
            <View style={styles.container}>
                {(Object.keys(FILTERS) as FilterType[]).map((type) => {
                    const isActive =
                        config[type].active !==
                        (type === 'status' ? 'all' : 'todas');

                    return (
                        <View key={type} style={styles.filterGroup}>
                            <Text style={styles.label}>
                                {FILTERS[type].label}
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.filterButton,
                                    isActive && styles.filterButtonActive,
                                ]}
                                onPress={() => openModal(type)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        isActive &&
                                        styles.filterButtonTextActive,
                                    ]}
                                >
                                    {
                                        FILTERS[type].options.find(
                                            (f) =>
                                                f.key ===
                                                config[type].active
                                        )?.label
                                    }
                                </Text>

                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color={isActive ? '#fff' : '#1f2937'}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            {/* 🔽 MODAL (SIN CAMBIOS) */}
            <ModalSheet
                visible={modalVisible}
                title={currentFilter.title}
                onClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    {currentFilter.options.map((option) => {
                        const isActive =
                            currentConfig.active === option.key;

                        const count =
                            filterType === 'status'
                                ? props.statusCounts?.[
                                option.key as Status | 'all'
                                ] || 0
                                : filterType === 'priority'
                                    ? props.priorityCounts?.[
                                    option.key as Priority | 'todas'
                                    ] || 0
                                    : props.categoryCounts?.[
                                    option.key as Categories | 'todas'
                                    ] || 0;

                        return (
                            <TouchableOpacity
                                key={String(option.key)}
                                style={[
                                    styles.option,
                                    isActive && styles.optionActive,
                                ]}
                                onPress={() =>
                                    handleSelect(option.key)
                                }
                                activeOpacity={0.7}
                            >
                                {option.icon && (
                                    <Ionicons
                                        name={option.icon}
                                        size={24}
                                        color={
                                            isActive
                                                ? '#fff'
                                                : '#1a1d29'
                                        }
                                    />
                                )}

                                <Text
                                    style={[
                                        styles.optionLabel,
                                        isActive &&
                                        styles.optionLabelActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>

                                <View
                                    style={[
                                        styles.badge,
                                        isActive &&
                                        styles.badgeActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.count,
                                            isActive &&
                                            styles.countActive,
                                        ]}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ModalSheet>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    filterGroup: {
        flex: 1,
        minWidth: 110,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },

    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#e4e6ebff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 6,
    },

    filterButtonActive: {
        backgroundColor: '#1a1d29',
        borderColor: '#1a1d29',
    },

    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
    },

    filterButtonTextActive: {
        color: '#fff',
    },

    modalContent: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        gap: 12,
    },
    optionActive: {
        backgroundColor: '#1a1d29',
    },
    optionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1d29',
    },
    optionLabelActive: {
        color: '#fff',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#e2e8f0',
        minWidth: 36,
        alignItems: 'center',
    },
    badgeActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    count: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
    },
    countActive: {
        color: '#fff',
    },
});
