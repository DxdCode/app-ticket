import { Stack } from 'expo-router';

export default function TicketsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="index" 
                options={{ 
                    title: 'Tickets',
                }} 
            />
            <Stack.Screen 
                name="[id]" 
                options={{ 
                    title: 'Información del Ticket',
                    headerShown: true,
                    headerBackTitle: 'Volver',
                    headerStyle: {
                        backgroundColor: '#1a1d29',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '700',
                    },
                }} 
            />
            <Stack.Screen 
                name="messages" 
                options={{
                    title: 'Mensajes',
                    headerShown: true,
                    headerBackTitle: 'Volver',
                    headerStyle: {
                        backgroundColor: '#1a1d29',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '700',
                    },
                }} 
            />
        </Stack>
    );
}
