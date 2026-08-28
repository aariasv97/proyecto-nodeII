# Proyecto Eventos

API REST desarrollada con Node.js y Express para la gestion de eventos y sesiones.

## Tematica

La aplicacion esta orientada a una plataforma de eventos donde los usuarios podran consultar eventos y, en futuras etapas, gestionar sesiones, autenticacion y participacion en diferentes actividades.

## Tecnologias

* Node.js
* Express
* MongoDB
* Mongoose
* dotenv
* JSON Web Token
* JavaScript
* ES Modules

## Arquitectura

El proyecto utiliza una arquitectura organizada por capas:

```text
routes -> controllers -> services -> repositories -> dao -> models -> MongoDB

```

En esta primera etapa se prepara la estructura base para futuras funcionalidades.

## Estructura del proyecto

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalacion

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd proyecto-eventos
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto.

Ejemplo:

```text
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/proyecto-eventos
JWT_SECRET=change_this_secret
```

Tambien se incluye un archivo `.env.example` como referencia.

No subir el archivo `.env` al repositorio.

## Ejecucion

Para iniciar el servidor:

```bash
npm start
```

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor estara disponible en:

```text
http://localhost:8080
```

## Rutas disponibles

### Health Check

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### Events

```http
GET /api/events
```

Respuesta inicial:

```json
{
  "status": "success",
  "payload": []
}
```

### Sessions

```http
GET /api/sessions
```

Respuesta inicial:

```json
{
  "status": "success",
  "payload": []
}
```

La funcionalidad de autenticacion todavia no esta implementada.

## Modelos

Actualmente se incluyen modelos base para:

* User
* Event

Los modelos utilizan Mongoose y estan preparados para futuras etapas de desarrollo.

## Estado del proyecto

Esta entrega corresponde a la estructura inicial de la API REST.

Las siguientes etapas podran incorporar:

* Conexion con MongoDB
* CRUD de eventos
* Registro de usuarios
* Login
* Autenticacion mediante JWT
* Middlewares de autenticacion
* Gestion de sesiones
* Validaciones
* Manejo centralizado de errores
* Repositories, services y DAO con logica real

## Licencia

Proyecto desarrollado con fines educativos.
