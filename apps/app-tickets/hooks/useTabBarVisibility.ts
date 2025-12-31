import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

// Hook para controlar la visibilidad de la barra de pestañas
export function useTabBarVisibility(visible: boolean) {
    const navigation = useNavigation();

    useEffect(() => {
        const parent = navigation.getParent();
        if (parent) {
            parent.setOptions({
                tabBarStyle: { display: visible ? 'flex' : 'none' },
            });
        }

        return () => {
            if (parent) {
                parent.setOptions({
                    tabBarStyle: { display: 'flex' },
                });
            }
        };
    }, [navigation, visible]);
}
