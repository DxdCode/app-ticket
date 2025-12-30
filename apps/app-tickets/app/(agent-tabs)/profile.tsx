import { router } from "expo-router";
import { removeToken } from "@/services/authStorage";
import useUser from "@/hooks/useUser";
import Profile from "@/screens/ProfileScreen";

export default function AgentProfile() {
    const { user, loading, error } = useUser();

    const logout = async () => {
        await removeToken();
        router.replace("/(auth)/login");
    };

    return <Profile user={user} loading={loading} error={error} onLogout={logout} />;
}