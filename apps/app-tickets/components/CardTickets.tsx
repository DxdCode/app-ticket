import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, memo } from 'react';
import { TicketResponse , statusColors, priorityColors, statusLabels, priorityLabels } from '@/types/type-ticket';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import ModalSheet from './ModalSheet';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { User } from '@/types/type-user';

interface CardTicketsPropsExtended extends TicketResponse  {
    currentUser?: User | null;
}

function CardTickets(props: CardTicketsPropsExtended) {
    const [menuVisible, setMenuVisible] = useState(false);
    useTabBarVisibility(!menuVisible);
    const isAgent = props.currentUser?.role === 'agent';

    return (
        <View>
            <Pressable style={styles.card} onPress={() => setMenuVisible(true)}>
                <View style={styles.content}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text
                        style={styles.description}
                        numberOfLines={isAgent ? undefined : 3}
                        ellipsizeMode='tail'
                    >
                        {props.description}
                    </Text>

                    {isAgent && (props.userName || props.userEmail) && (
                        <View style={styles.userInfoContainer}>
                            {props.userName && (
                                <Text style={styles.userInfo}>
                                    <Ionicons name="person-outline" size={12} color="#6b7280" /> {props.userName}
                                </Text>
                            )}
                            {props.userEmail && (
                                <Text style={styles.userInfo}>
                                    <Ionicons name="mail-outline" size={12} color="#6b7280" /> {props.userEmail}
                                </Text>
                            )}
                        </View>
                    )}

                    <View style={styles.badgeRow}>
                        <Text
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: statusColors[props.status].bg,
                                    color: statusColors[props.status].text,
                                },
                            ]}
                        >
                            {statusLabels[props.status]}
                        </Text>

                        <Text
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: priorityColors[props.priority].bg,
                                    color: priorityColors[props.priority].text,
                                },
                            ]}
                        >
                            {priorityLabels[props.priority]}
                        </Text>
                    </View>

                    <Text style={styles.id}>{props.id}</Text>
                </View>

                <View style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#6b7280" />
                </View>
            </Pressable>

            <ModalSheet
                visible={menuVisible}
                title="Opciones"
                onClose={() => setMenuVisible(false)}
            >
                <Button
                    title="Chat"
                    onPress={() => {
                        setMenuVisible(false);
                        props.onChat?.(props.id);
                    }}
                    icon={<Ionicons name="chatbubbles" size={20} color="#fff" />}
                />
                {!isAgent && (
                    <>
                                    <Button
                    title="Ver Detalle"
                    variant="primary"
                    onPress={() => {
                        setMenuVisible(false);
                        props.onViewDetail?.(props.id);
                    }}
                    icon={<Ionicons name="eye" size={20} color="#fff" />}
                />
                        <Button
                                title="Cerrar Ticket"
                                variant="secondary"
                                onPress={() => {
                                    setMenuVisible(false);
                                    props.onClose?.(props.id);
                                }}
                                icon={<Ionicons name="close-circle" size={20} color="#64748b" />}
                            />
                        <Button
                            title="Eliminar"
                            variant="delete"
                            onPress={() => {
                                setMenuVisible(false);
                                props.onDelete?.(props.id);
                            }}
                            icon={<Ionicons name="trash" size={20} color="#fff" />}
                        />
                    </>
                )}
            </ModalSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    menuButton: {
        paddingTop: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    userInfoContainer: {
        marginVertical: 8,
        gap: 10,
        display:'flex',
        flexDirection: 'row',
    },
    userInfo: {
        fontSize: 12,
        color: '#6b7280',
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    badge: {
        paddingHorizontal: 11,
        paddingVertical: 4,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    id: {
        fontSize: 11,
        color: '#9ca3af',
    },
});

export default memo(CardTickets, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.status === nextProps.status &&
        prevProps.priority === nextProps.priority &&
        prevProps.currentUser?.id === nextProps.currentUser?.id
    );
});