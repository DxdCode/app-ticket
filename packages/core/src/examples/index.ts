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

    export const Ticket = {
        id: Id("ticket"),
        userId: Id("user"),
        title: "Problema con facturación",
        description: "No se refleja el pago en mi cuenta",
        category: "pago",
        priority: "alta",
        status: "open",
        solution: "Se ha verificado el pago y actualizado el estado de la cuenta",
    } as const;

    export const Message = {
        id: Id("message"),
        ticketId: Id("ticket"),
        senderId: Id("user"),
        message: "Hola, tengo un problema con mi factura del mes pasado.",
    };

    export const Response = {
        status: "resolved",
        suggestion: "Gracias por contactarnos. Hemos revisado su cuenta y el pago se ha procesado correctamente. Por favor, verifique nuevamente su saldo.",
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