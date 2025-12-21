# App Ticket

Sistema de tickets con backend en Bun y frontend mobile en Expo/React Native.

## 🚀 Tecnologías principales
- Bun (backend)
- React Native (frontend)
- TypeScript


## 📦 Estructura del proyecto (Monorepo)

```
├── apps/
│   ├── api/           # Backend Bun
│   └── app-tickets/   # App móvil Expo
├── packages/core/     # Lógica compartida, Drizzle, migraciones
```

## 🛠️ Instalación y setup

1. Clona el repo:
	```bash
	git clone https://github.com/DxdCode/app-ticket.git
	cd app-ticket
	```
2. Instala dependencias:
	```bash
	bun install
	```
3. Inicia el backend (Bun):
	```bash
	cd apps/api
	bun run dev
	```
4. Inicia la app móvil (Expo):
	```bash
	cd ../app-tickets
	npx expo start
	```
---
