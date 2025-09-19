# SWallet - Sistema de Billetera Digital

Un servidor backend desarrollado con NestJS para un sistema de billetera digital.

## 🚀 Características

- **Framework**: NestJS con TypeScript
- **Arquitectura**: Modular y escalable
- **API REST**: Endpoints bien estructurados
- **CORS**: Habilitado para desarrollo
- **Configuración**: Flexible y extensible

## 📋 Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd SWallet
```

2. Instala las dependencias:
```bash
npm install
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Otros comandos
```bash
# Construir el proyecto
npm run build

# Ejecutar en modo debug
npm run start:debug

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📡 Endpoints Disponibles

Una vez que el servidor esté ejecutándose, puedes acceder a:

- **GET** `/api` - Mensaje de bienvenida
- **GET** `/api/health` - Estado del servidor
- **GET** `/api/info` - Información de la aplicación

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── app.controller.ts    # Controlador principal
│   ├── app.service.ts       # Servicio principal
│   └── app.module.ts        # Módulo principal
├── common/                  # Utilidades comunes
├── config/
│   └── app.config.ts        # Configuración de la aplicación
└── main.ts                  # Punto de entrada
```

## 🔧 Configuración

El servidor se ejecuta por defecto en el puerto `3000`. Puedes cambiar esto modificando la variable de entorno `PORT` o editando `src/config/app.config.ts`.

## 📝 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Conectar base de datos MongoDB
- [ ] Crear módulos de usuarios y transacciones
- [ ] Implementar validación de datos
- [ ] Agregar tests unitarios y de integración
- [ ] Configurar logging
- [ ] Implementar rate limiting

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
