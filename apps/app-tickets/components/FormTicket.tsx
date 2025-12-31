import { Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import Input from './Input'
import Button from './Button'
import { Ionicons } from '@expo/vector-icons'
import { useTickets } from '@/hooks/useTicket'

interface FormTicketProps {
    onClose?: () => void;
    onCreated?: () => void;
}

export default function FormTicket({ onClose, onCreated }: FormTicketProps) {
    const {
        title,
        setTitle,
        description,
        setDescription,
        loading,
        error,
        setError,
        createTicket,
        resetForm
    } = useTickets(() => {
        onCreated?.();
        onClose?.();
    });

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Input
                label="Título"
                value={title}
                placeholder="Ingrese el título del ticket"
                onChangeText={(text) => {
                    setTitle(text);
                    setError("");
                }}
                editable={!loading}
            />

            <Input
                label="Descripción"
                placeholder="Describa el problema detalladamente"
                value={description}
                onChangeText={(text) => {
                    setDescription(text);
                    setError("");
                }}
                multiline
                editable={!loading}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
                title='Crear Ticket'
                loading={loading}
                onPress={createTicket}
                icon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
            />

            {onClose && (
                <Button
                    title='Cancelar'
                    variant='secondary'
                    onPress={handleClose}
                    icon={<Ionicons name="close-circle-outline" size={20} color="#64748b" />}
                />  
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: '#ef4444',
        marginBottom: 12,
        marginTop: -8,
    },
});