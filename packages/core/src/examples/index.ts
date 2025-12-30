import { prefixes } from "../shared/id";

export namespace Examples {
    export const Id = (prefix: keyof typeof prefixes) => {
        return `${prefixes[prefix]}_${Math.random().toString(36).substring(2, 15)}`;
    }

    enum UserRole {
        User = "user",
        Agent = "agent",
        Ai = "ai",
    }

    export const User = {
        id: Id("user"),
        email: "david@gmail.com",
        username: "david",
        password: "12345678",
        role: UserRole.User,
        created: new Date().toISOString(),
        isActive: true,
    };

    export const Register = {
        email: "david@gmail.com",
        username: "david",
        password: "12345678",
    };

    export const Login = {
        email: "david@gmail.com",
        password: "12345678",
    };

    export const AuthResponse = {
        user: {
            id: Id("user"),
            email: "david@gmail.com",
            username: "david",
            role: "user",
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example",
    } as const;

    export const TicketInfo = {
        id: Id("ticket"),
        userId: Id("user"),
        title: "Problema con facturación",
        description: "No se refleja el pago en mi cuenta",
        category: "pago",
        priority: "alta",
        status: "open",
    } as const;

    export const Ticket = {
        ...TicketInfo,
        isActive: true,
        timeCreated: "2025-12-19T04:26:44.074617Z",
        timeUpdated: "2025-12-19T04:26:44.075Z",
    } as const;

    export const TicketForAgent = {
        id: Id("ticket"),
        userId: Id("user"),
        title: "La pc ya no funciona",
        description: "Me sale que esta actualizando el windows",
        category: "tecnico",
        priority: "alta",
        status: "resolved",
        userName: "stalin",
        userEmail: "stalin@gmail.com",
    } as const;

    export const TicketCreateOutput = {
        id: Id("ticket"),
        category: "tecnico",
        priority: "alta",
    } as const;

    export const Message = {
        id: Id("message"),
        ticketId: Id("ticket"),
        senderId: Id("user"),
        message: "Hola, tengo un problema con mi factura del mes pasado.",
        role: "user" as const,
        timeCreated: new Date().toISOString(),
    };

    export const MessageForAgent = {
        message: "Hola me puedes enviar el numero de la factura para revisar tu caso.",
    } as const;

    export const Response = {
        suggestion: "Gracias por contactarnos. Ya se revisará el estado de la transacción realizada.",
    } as const;

    export const AILog = {
        id: Id("aiLog"),
        ticketId: Id("ticket"),
        action: "classification",
        input: {
            title: "Problema con facturación",
            description: "No se refleja el pago en mi cuenta",
        },
        output: {
            categoria: "pago",
            prioridad: "alta",
        },
    };
}