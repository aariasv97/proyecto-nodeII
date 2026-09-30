# Proyecto Eventos

API REST desarrollada con Node.js y Express para la gestion de eventos y sesiones.

## Tematica

La aplicacion esta orientada a una plataforma de eventos donde los usuarios podran consultar eventos y gestionar sesiones, autenticacion y participacion en diferentes actividades.

## Tecnologias

* Node.js
* Express
* MongoDB
* Mongoose
* dotenv
* JSON Web Token
* bcrypt
* cookie-parser
* JavaScript
* ES Modules

## Arquitectura

El proyecto utiliza una arquitectura organizada por capas:

```text
routes -> controllers -> services -> repositories -> dao -> models -> MongoDB
```
La autenticacion utiliza ademas: 

```text
routes -> auth.middleware -> JWT
```

Cada capa tiene una responsabilidad especifica dentro del procesamiento de las peticiones.

## Estructura del proyecto

```text

proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   └── sessions.service.js
│   ├── repositories/
│   │   └── users.repository.js
│   ├── dao/
│   │   └── users.dao.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
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
JWT_EXPIRES_IN=1h
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

### Registro de usuarios

```http
POST /api/sessions/register
```

El endpoint permite registrar un nuevo usuario.

Body:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Durante el registro se realizan las siguientes validaciones:

* Los campos `first_name`, `last_name`, `email` y `password` son obligatorios.
* El email debe contener `@`.
* La contraseña debe tener al menos 6 caracteres.
* El email se almacena sin espacios al inicio o final y en minusculas.
* No se permiten emails duplicados.
* La contraseña se almacena utilizando un hash de bcrypt.
* El campo `role` no puede ser definido mediante el registro publico.
* El rol asignado por defecto es `user`.
* La contraseña no se incluye en la respuesta.

Respuesta exitosa:

```json
{
  "status": "success",
  "payload": {
    "id": "6aaf63fb981299f8b14f9458",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

Codigos de respuesta utilizados:

* `201` - Usuario creado correctamente.
* `400` - Datos de registro invalidos o campos obligatorios faltantes.
* `409` - El email ya esta registrado.

## Login

```http
POST /api/sessions/login
```

Body:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Si las credenciales son correctas, se genera un JWT y se almacena en una cookie llamada currentUser.

Respuesta:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```
La cookie utiliza:

* httpOnly: true
* sameSite: "lax"
* maxAge: 3600000
* secure: true solamente en produccion

Si el email no existe o la contraseña es incorrecta:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}

```
Respuesta HTTP: 401 Unauthorized

## Usuario actual

```http
GET /api/sessions/current
```

Esta ruta requiere una cookie currentUser valida, el middleware de autenticacion verifica el JWT y almacena su contenido en req.user.


```json
{
  "status": "success",
  "payload": {
    "id": "6aaf63fb981299f8b14f9458",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```
Si no existe un token valido: 401 Unauthorized

## Logout

```http
POST /api/sessions/logout
```
El endpoint elimina la cookie currentUser.

Respuesta:

```json
{
  "status": "success",
  "message": "Logout correcto"
}
```

## Modelos

Actualmente se incluyen modelos para:

* User
* Event

El modelo `User` contiene los siguientes campos:

* `first_name`
* `last_name`
* `email`
* `password`
* `role`

El campo `role` acepta los valores:

```text
user
organizer
admin
```

El valor por defecto es:

```text
user
```

Los modelos utilizan Mongoose y estan preparados para futuras etapas de desarrollo.

## Seguridad

Las contraseñas no se almacenan en texto plano.

Antes de guardar un usuario, la contraseña se transforma mediante bcrypt utilizando el helper ubicado en:

```text
src/utils/hash.js
```
La autenticacion utiliza JSON Web Token, la creacion de tokens se encuentra centralizada en:

```text
src/utils/jwt.js
```
El JWT contiene:

```text
id
email
role
```
El secreto y el tiempo de expiracion se obtienen desde variables de entorno:

```text
JWT_SECRET
JWT_EXPIRES_IN
```
El token se almacena en una cookie currentUser con la opcion httpOnly, el middleware de autenticacion se encuentra en:

```text
src/middlewares/auth.middleware.js
```
La contraseña nunca se incluye en el JWT ni en las respuestas de autenticacion. 

## Estado del proyecto

La API cuenta actualmente con:

* Estructura base de la API REST.
* Conexion con MongoDB mediante Mongoose.
* Arquitectura por capas.
* Registro de usuarios.
* Validaciones basicas de registro.
* Normalizacion de emails.
* Deteccion de emails duplicados.
* Hash de contraseñas mediante bcrypt.
* Asignacion de rol por defecto.
* Proteccion del campo `role` durante el registro.
* Manejo centralizado de errores.
* Login de usuarios.
* Autenticacion mediante JWT.
* Persistencia del JWT mediante cookie `currentUser`.
* Middleware de autenticacion.
* Consulta del usuario autenticado.
* Logout.

Las siguientes etapas podran incorporar:

* CRUD de eventos.
* Validaciones adicionales.
* Ampliacion de repositories, services y DAO.

## Licencia

Proyecto desarrollado con fines educativos.
