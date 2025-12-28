import { ApiType } from '@tickets/api';
import { hc } from 'hono/client';
import { getToken } from './authStorage';

const baseClient = hc<ApiType>('localhost:3000', {

	// Función para incluir el token en las solicitudes
	fetch: async (input: RequestInfo | URL, init?: RequestInit) => {

		const token = await getToken();
		
		const headers = new Headers(init?.headers);
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		
		return fetch(input, {
			...init,
			headers,
		});
	},
});

export const client = baseClient;

