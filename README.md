# Proyecto Eventos

API REST desarrollada con Node.js y Express para la gestion de eventos y sesiones, con autenticacion mediante JWT, cookies y autorizacion por roles.

## Tematica

La aplicacion esta orientada a una plataforma de eventos donde los usuarios pueden consultar eventos, autenticarse y gestionar eventos segun su rol.

## Tecnologias

* Node.js
* Express
* MongoDB
* Mongoose
* dotenv
* JSON Web Token
* Passport.js
* passport-local
* passport-jwt
* bcrypt
* cookie-parser
* JavaScript
* ES Modules

## Arquitectura

El proyecto utiliza una arquitectura organizada por capas:

```text
routes -> controllers -> services -> repositories -> dao -> models -> MongoDB
```
La autenticacion utiliza Passport.js con estrategias centralizadas:

```text
routes -> Passport strategies -> controllers
```
La autorizacion utiliza middlewares reutilizables:

```text
routes -> authMiddleware -> authorize -> controllers
```

Cada capa tiene una responsabilidad especifica dentro del procesamiento de las peticiones.

## Estructura del proyecto

```text

proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   └── passport.config.js
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   ├── repositories/
│   │   └── users.repository.js
│   ├── dao/
│   │   └── users.dao.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
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
## Autenticacion

La autenticacion utiliza Passport.js y JWT.

Al realizar login correctamente, se genera un JWT que se almacena en una cookie llamada:

```text
currentUser
```

La cookie utiliza:

* httpOnly: true
* sameSite: "lax"
* maxAge: 3600000
* secure: true solamente en produccion

El JWT contiene:

```text
id
email
role
```

El secreto y el tiempo de expiracion se obtienen desde:

```text
JWT_SECRET
JWT_EXPIRES_IN
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
Ruta protegida.
El middleware authMiddleware valida el JWT almacenado en la cookie currentUser y coloca el usuario autenticado en:

req.user
Sin una sesion valida:

401 Unauthorized

Respuesta:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

Con una sesion valida:
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
## Roles y autorizacion
El modelo User utiliza tres roles:

```text
user
organizer
admin
```

El rol por defecto es:

user
El registro publico no permite definir el rol mediante el body.

La autorizacion se realiza mediante el middleware reutilizable:

```http
src/middlewares/authorize.middleware.js
```

Este middleware recibe los roles permitidos para cada ruta.

## Matriz de permisos

Accion                              	user	  organizer	  admin
Consultar eventos publicados	         ✓	        ✓	        ✓
Crear eventos	                         ✗        	✓       	✓
Modificar sus propios eventos	         ✗        	✓       	✓
Modificar eventos de otros usuarios	   ✗	        ✗	        ✓
Consultar todos los usuarios	         ✗	        ✗	        ✓

## Diferencia entre 401 y 403

* 401 Unauthorized
Significa que el usuario no esta autenticado.

Ejemplo:

```http
GET /api/sessions/current
```

sin una cookie JWT valida:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

* 403 Forbidden
Significa que el usuario esta autenticado, pero su rol no tiene permiso para realizar la accion.

Ejemplo:

```http
POST /api/events
```

con un usuario de rol user:

```json
{
  "status": "error",
  "message": "No tenes permisos para realizar esta accion"
}
```

### Rutas protegidas

## Eventos publicados

```http
GET /api/events
```

Permite consultar eventos publicados.

Disponible para:

```text
user
organizer
admin
```

## Crear evento

```http
POST /api/events
```

Requiere autenticacion.

Disponible para:

```text
organizer
admin
```

El propietario del evento se obtiene del usuario autenticado:

req.user._id
El cliente no define el owner.

## Modificar evento

```http
PUT /api/events/:id
```

Requiere autenticacion.

Disponible para:

```text
organizer
admin
```

Un organizer solamente puede modificar sus propios eventos.

Un admin puede modificar cualquier evento.

Si un organizer intenta modificar un evento de otro usuario:

403 Forbidden

Respuesta:

```json
{
  "status": "error",
  "message": "No tenés permisos para modificar este evento"
}
```

## Consultar todos los usuarios

```http
GET /api/sessions/users
```

Requiere autenticacion y rol admin.

Un usuario organizer o user recibe:

403 Forbidden
Un administrador puede consultar los usuarios.

Las contraseñas no se incluyen en la respuesta.

Registro de usuarios

```http
POST /api/sessions/register
```

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

* Los campos first_name, last_name, email y password son obligatorios.
* El email debe contener @.
* La contraseña debe tener al menos 6 caracteres.
* El email se almacena sin espacios al inicio o final y en minusculas.
* No se permiten emails duplicados.
* La contraseña se almacena utilizando un hash de bcrypt.
* El campo role no puede ser definido mediante el registro publico.
* El rol asignado por defecto es user.
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

* 201 - Usuario creado correctamente.
* 400 - Datos de registro invalidos o campos obligatorios faltantes.
* 409 - El email ya esta registrado.

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
Si las credenciales son correctas:
```json
{
  "status": "success",
  "message": "Login correcto"
}
```
Si el email no existe o la contraseña es incorrecta:
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```
Respuesta HTTP:

401 Unauthorized

## Eventos

Consultar eventos publicados

```http
GET /api/events
```

Devuelve unicamente los eventos cuyo campo published sea true.

## Crear evento

```http
POST /api/events
```

Body:

```json
{
  "title": "Evento de prueba",
  "description": "Descripción del evento",
  "date": "2026-10-10"
}
```

El propietario se asigna automaticamente utilizando el usuario autenticado.

## Modificar evento

```http
PUT /api/events/:id
```

Body:
```json
{
  "title": "Evento actualizado",
  "description": "Nueva descripción",
  "date": "2026-10-20",
  "published": true
}
```
El sistema valida que el usuario sea propietario del evento o tenga rol admin.

## Modelos

User
El modelo User contiene:

* first_name
* last_name
* email
* password
* role

El campo role acepta:

* user
* organizer
* admin

Valor por defecto:

* user

## Event

El modelo Event contiene:

* title
* description
* date
* owner
* published
* createdAt
* updatedAt

El campo owner referencia al modelo User.

## Seguridad

Las contraseñas no se almacenan en texto plano.

Antes de guardar un usuario, la contraseña se transforma mediante bcrypt utilizando:

src/utils/hash.js
La creacion de tokens se encuentra centralizada en:

src/utils/jwt.js
Las estrategias de Passport se encuentran en:

src/config/passport.config.js
La autenticacion y autorizacion de rutas se separan mediante:

src/middlewares/auth.middleware.js
src/middlewares/authorize.middleware.js
La contraseña nunca se incluye en el JWT ni en las respuestas de autenticacion.

## Estado del proyecto

La API cuenta actualmente con:

* Estructura base de API REST.
* Conexion con MongoDB mediante Mongoose.
* Arquitectura por capas.
* Registro de usuarios.
* Validaciones basicas de registro.
* Normalizacion de emails.
* Deteccion de emails duplicados.
* Hash de contraseñas mediante bcrypt.
* Asignacion de rol por defecto.
* Proteccion del campo role durante el registro.
* Manejo centralizado de errores.
* Login de usuarios.
* Autenticacion mediante JWT.
* Persistencia del JWT mediante cookie currentUser.
* Middleware de autenticacion.
* Middleware reutilizable de autorizacion por roles.
* Consulta del usuario autenticado.
* Logout.
* Consulta de eventos publicados.
* Creacion de eventos para organizer y admin.
* Control de propiedad de eventos.
* Modificacion de eventos propios por organizer.
* Modificacion de cualquier evento por admin.
* Consulta de todos los usuarios exclusiva para admin.
* Diferenciacion entre errores 401 Unauthorized y 403 Forbidden.

## Licencia

Proyecto desarrollado con fines educativos.
