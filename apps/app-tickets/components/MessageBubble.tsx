import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface MessageBubbleProps {
    message: string;
    time: Date;
    role: 'user' | 'agent' | 'ia';
    isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, time, role, isCurrentUser }) => {
    const configs = {
        ia: {
            icon: 'sparkles',
            avatarBg: '#64748b',
            bubbleBg: '#f8fafc',
            label: 'Asistente IA',
            labelColor: '#64748b',
            textColor: '#1e293b',
        },
        agent: {
            icon: 'shield',
            avatarBg: '#475569',
            bubbleBg: '#e2e8f0',
            label: 'Agente',
            labelColor: '#475569',
            textColor: '#1e293b',
        },
        user: {
            icon: 'person',
            avatarBg: '#1a1d29',
            bubbleBg: '#1a1d29',
            label: 'Usuario',
            labelColor: '#94a3b8',
            textColor: '#fff',
        },
    };


    const config = configs[role];
    const alignRight = isCurrentUser;

    return (
        <View style={[styles.container, { justifyContent: alignRight ? 'flex-end' : 'flex-start' }]}>
            {!alignRight && (
                <View style={[styles.avatar, { backgroundColor: config.avatarBg }]}>
                    <Ionicons name={config.icon as any} size={16} color="#fff" />
                </View>
            )}

            <View style={[
                styles.bubble,
                { backgroundColor: alignRight ? '#1a1d29' : config.bubbleBg }
            ]}>
                <Text style={[
                    styles.label,
                    { color: alignRight ? '#94a3b8' : config.labelColor }
                ]}>
                    {alignRight ? 'Tú' : config.label}
                </Text>
                <Text style={[
                    styles.text,
                    { color: alignRight ? '#fff' : config.textColor }
                ]}>
                    {message}
                </Text>
                <Text style={styles.time}>
                    {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            {alignRight && (
                <View style={[styles.avatar, { backgroundColor: '#1a1d29' }]}>
                    <Ionicons name={role === 'agent' ? 'shield' : 'person'} size={16} color="#fff" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bubble: {
        borderRadius: 16,
        padding: 14,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    time: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 4,
    },
});

export default memo(MessageBubble);