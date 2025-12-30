import { useEffect, useState } from "react";
import { client } from "@/services/cliente";
import { parseApiError } from "@/utils/parseApiError";
import { ApiErrorResponse } from "@/types/api-error";
import { UserResponse, User } from "@/types/type-user";
import { getToken } from "@/services/authStorage";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener perfil de usuario
  const fetchUser = async (): Promise<User | null> => {
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await client.api.auth.profile.$get();
      const body = (await res.json()) as ApiErrorResponse | UserResponse;

      if (!res.ok) {
        setError(parseApiError(body as ApiErrorResponse));
        return null;
      }

      const userResponse = body as UserResponse;
      setUser(userResponse.data);
      return userResponse.data;

    } catch (e) {
      setError("Error de conexión. Verifica tu internet.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuario al montar
  useEffect(() => {
    fetchUser();
  }, []);


  return {
    user,
    loading,
    error,
    fetchUser,
    setUser,
  };
}