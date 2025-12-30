// Definición del enum Role
export enum Role {
  Agente = "agent",
  User = "user",
  Ia = "ai",
}

// Definición de la interfaz User
export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  created: string;
  isActive: boolean;
};

// Respuesta de API para el perfil de usuario
export type UserResponse = {
  data: User;
};

