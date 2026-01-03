
// Tipos 

export type Priority = "alta" | "media" | "baja";
export type Status = "open" | "in_progress" | "resolved";
export type Categories = "login" | "pago" | "cuenta" | "tecnico" | "otro";

// Interface principal de ticket
export interface TicketsProps {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    onViewDetail?: (id: string) => void;
    onDelete?: (id: string) => void;
    onChat?: (id: string) => void;
    onClose?: (id: string) => void;
}

// Respuesta de API para el listado de tickets
export interface TicketResponse extends TicketsProps {
    userName?: string;
    userEmail?: string;
    category?: Categories;
}

// Respuesta de API para el detalle completo del ticket
export interface TicketDetailResponse extends Omit<TicketsProps, 'onViewDetail' | 'onDelete' | 'onChat'> {
    userId: string;
    category: string;
    isActive: boolean;
    timeCreated: string;
    timeUpdated: string | null;
}

// Colores para prioridades
export const priorityColors: Record<Priority, { bg: string; text: string }> = {
    alta: {
        bg: 'rgba(255, 0, 0, 0.15)',
        text: '#b00020',
    },
    media: {
        bg: 'rgba(255, 165, 0, 0.18)',
        text: '#9a5a00',
    },
    baja: {
        bg: 'rgba(0, 128, 0, 0.18)',
        text: '#0b5e20',
    },
};

// Colores para estados
export const statusColors: Record<Status, { bg: string; text: string }> = {
    open: {
        bg: 'rgba(0, 122, 255, 0.15)',
        text: '#004a99',
    },
    in_progress: {
        bg: 'rgba(255, 193, 7, 0.2)',
        text: '#8a6d00',
    },
    resolved: {
        bg: 'rgba(40, 167, 69, 0.18)',
        text: '#1e7e34',
    },
};

export const statusLabels: Record<Status, string> = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',

};

export const priorityLabels: Record<Priority, string> = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
};