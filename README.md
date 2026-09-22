# 🏛️ Instituciones

Aplicación web para el registro y gestión inicial de información de instituciones. El proyecto está construido con **React** y **Vite**, y actualmente proporciona un formulario para dar de alta instituciones.

El objetivo del proyecto es servir como base para construir posteriormente una plataforma más completa de administración de instituciones, incluyendo persistencia de información, consultas, edición, eliminación, autenticación y conexión con un backend.

---

## 📋 Tabla de contenidos

* [Descripción](#-descripción)
* [Estado actual del proyecto](#-estado-actual-del-proyecto)
* [Características](#-características)
* [Tecnologías utilizadas](#-tecnologías-utilizadas)
* [Requisitos previos](#-requisitos-previos)
* [Instalación](#-instalación)
* [Ejecutar el proyecto en desarrollo](#-ejecutar-el-proyecto-en-desarrollo)
* [Generar una versión de producción](#-generar-una-versión-de-producción)
* [Vista previa de producción](#-vista-previa-de-producción)
* [Linting](#-linting)
* [Estructura del proyecto](#-estructura-del-proyecto)
* [Funcionamiento del formulario](#-funcionamiento-del-formulario)
* [Modelo de datos actual](#-modelo-de-datos-actual)
* [Persistencia de datos](#-persistencia-de-datos)
* [Variables de entorno](#-variables-de-entorno)
* [Solución de problemas](#-solución-de-problemas)
* [Desarrollo y contribuciones](#-desarrollo-y-contribuciones)
* [Licencia](#-licencia)

---

## 📖 Descripción

**Instituciones** es una aplicación web desarrollada con React que permite capturar información básica de una institución mediante un formulario.

Actualmente el formulario permite registrar:

* Nombre de la institución.
* Dirección.
* Teléfono.
* Correo electrónico.
* Tipo de institución.
* Descripción.

Los tipos de institución disponibles actualmente son:

* Pública.
* Privada.
* ONG.

El proyecto utiliza React para la construcción de la interfaz y Vite como herramienta de desarrollo y compilación. La configuración actual de Vite utiliza el plugin oficial para React.

---

## 🚧 Estado actual del proyecto

> **Proyecto en desarrollo.**

La versión actual debe considerarse una primera versión funcional de la interfaz.

### Actualmente implementado

* [x] Aplicación React.
* [x] Configuración con Vite.
* [x] Formulario de alta de institución.
* [x] Validación básica mediante atributos HTML.
* [x] Manejo del formulario mediante `useState`.
* [x] Selección del tipo de institución.
* [x] Mensaje de confirmación después del envío.
* [x] Registro de los datos enviados en la consola del navegador.
* [x] Linting mediante Oxlint.

### Pendiente para una versión completa

* [ ] Base de datos.
* [ ] API/backend.
* [ ] Persistencia de instituciones.
* [ ] Listado de instituciones registradas.
* [ ] Edición de instituciones.
* [ ] Eliminación de instituciones.
* [ ] Autenticación de usuarios.
* [ ] Control de permisos.
* [ ] Búsqueda y filtros.
* [ ] Paginación.
* [ ] Manejo centralizado de errores.
* [ ] Pruebas automatizadas.
* [ ] Despliegue en producción.

---

# 🛠️ Tecnologías utilizadas

El proyecto utiliza actualmente:

| Tecnología | Uso                         |
| ---------- | --------------------------- |
| React      | Construcción de la interfaz |
| React DOM  | Renderizado de React        |
| Vite       | Desarrollo y compilación    |
| JavaScript | Lenguaje principal          |
| Oxlint     | Análisis estático y linting |
| npm        | Gestión de dependencias     |

Las dependencias actuales del proyecto incluyen React 19.2.x, React DOM 19.2.x, Vite 8.2.x, `@vitejs/plugin-react` y Oxlint. Las versiones exactas instaladas pueden quedar fijadas por `package-lock.json`.

---

# 💻 Requisitos previos

Antes de instalar el proyecto necesitas tener instalado:

### 1. Git

Comprueba que Git está instalado:

```bash
git --version
```

Si el comando devuelve una versión, Git está disponible.

---

### 2. Node.js

El proyecto utiliza Vite y React, por lo que necesitas una versión moderna de Node.js.

Comprueba tu versión:

```bash
node --version
```

Y también:

```bash
npm --version
```

Se recomienda utilizar una versión **LTS reciente de Node.js** compatible con la versión de Vite utilizada por el proyecto.

---

# 📥 Instalación

## 1. Clonar el repositorio

Desde una terminal ejecuta:

```bash
git clone https://github.com/Weaspi/Instituciones.git
```

Esto descargará el proyecto en una carpeta llamada:

```text
Instituciones
```

También puedes utilizar el enlace oficial del repositorio:

[Repositorio Instituciones en GitHub](https://github.com/Weaspi/Instituciones?utm_source=chatgpt.com)

---

## 2. Entrar al directorio

```bash
cd Instituciones
```

Comprueba que estás dentro del proyecto:

```bash
dir
```

En Linux/macOS:

```bash
ls
```

Deberías encontrar archivos como:

```text
package.json
package-lock.json
vite.config.js
index.html
src/
public/
```

La estructura actual del repositorio contiene precisamente estos elementos principales.

---

## 3. Instalar las dependencias

Ejecuta:

```bash
npm install
```

Este comando lee el archivo:

```text
package.json
```

y descarga las dependencias necesarias dentro de:

```text
node_modules/
```

También utilizará `package-lock.json` para mantener reproducible la instalación de las versiones de dependencias.

> **Importante:** no es necesario ejecutar `npm install react` o `npm install vite` manualmente. Las dependencias ya están declaradas en `package.json`.

---

# ▶️ Ejecutar el proyecto en desarrollo

Una vez instaladas las dependencias:

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo.

Normalmente aparecerá una dirección similar a:

```text
http://localhost:5173/
```

Abre esa dirección en tu navegador.

El script `dev` está definido actualmente como:

```json
"dev": "vite"
```

por lo que `npm run dev` ejecuta directamente el servidor de desarrollo de Vite.

---

## 🔄 Hot Module Replacement

Durante el desarrollo, Vite proporciona **HMR (Hot Module Replacement)**.

Esto significa que puedes modificar archivos del proyecto y ver los cambios en el navegador sin tener que detener y volver a iniciar manualmente el servidor en cada modificación.

Por ejemplo:

```text
src/
└── App.jsx
```

Si modificas `App.jsx`, Vite actualizará automáticamente la aplicación.

---

# 📝 Funcionamiento del formulario

El componente principal de la aplicación se encuentra actualmente en:

```text
src/App.jsx
```

El formulario mantiene sus datos mediante el hook `useState` de React.

El estado inicial contiene:

```javascript
{
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  tipo: '',
  descripcion: ''
}
```

Cada campo del formulario actualiza su correspondiente propiedad del estado.

Por ejemplo:

```javascript
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  })
}
```

Cuando el usuario pulsa **Guardar**, actualmente se ejecuta:

```javascript
console.log('Institución registrada:', form)
```

y se muestra el mensaje:

```text
Institución registrada correctamente.
```

---

# ⚠️ Importante: actualmente no existe persistencia

Aunque la interfaz muestra el mensaje de que la institución fue registrada correctamente, actualmente los datos **no se guardan en una base de datos**.

El comportamiento actual es:

```text
Usuario
   │
   ▼
Formulario React
   │
   ▼
Estado de React
   │
   ▼
handleSubmit()
   │
   ├── console.log()
   │
   └── muestra mensaje
```

Por lo tanto, si recargas la página, los datos introducidos anteriormente no estarán disponibles.

Para convertir el proyecto en una aplicación de gestión real será necesario agregar un backend y/o un servicio de persistencia.

---

# 📊 Modelo de datos actual

La información que captura el formulario puede representarse conceptualmente de la siguiente manera:

```text
Institución
├── nombre
├── direccion
├── telefono
├── email
├── tipo
└── descripcion
```

Ejemplo:

```json
{
  "nombre": "Universidad Ejemplo",
  "direccion": "Av. Principal 123",
  "telefono": "5555555555",
  "email": "contacto@ejemplo.edu",
  "tipo": "publica",
  "descripcion": "Institución dedicada a la educación superior."
}
```

---

# 🗄️ Persistencia de datos

Actualmente el proyecto no incluye una base de datos ni un servicio backend.

Una posible evolución sería separar la aplicación en tres capas:

```text
┌───────────────────────┐
│       Frontend        │
│       React/Vite      │
└───────────┬───────────┘
            │ HTTP/HTTPS
            ▼
┌───────────────────────┐
│        Backend        │
│       REST API        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│       Base de datos   │
│ PostgreSQL / MySQL    │
└───────────────────────┘
```

Por ejemplo, posteriormente podría existir un endpoint:

```http
POST /api/instituciones
```

al que React enviaría:

```json
{
  "nombre": "Universidad Ejemplo",
  "direccion": "Av. Principal 123",
  "telefono": "5555555555",
  "email": "contacto@ejemplo.edu",
  "tipo": "publica",
  "descripcion": "Institución educativa."
}
```

El backend sería responsable de validar y almacenar la información.

---

# 🏗️ Estructura del proyecto

La estructura actual del repositorio es aproximadamente:

```text
Instituciones/
│
├── public/
│
├── src/
│
├── .gitignore
├── .oxlintrc.json
├── README.md
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### `public/`

Contiene recursos estáticos que pueden ser utilizados directamente por la aplicación.

---

### `src/`

Contiene el código fuente de la aplicación React.

Entre los archivos principales se encuentra:

```text
src/
└── App.jsx
```

`App.jsx` contiene actualmente el componente principal y el formulario de alta de instituciones.

---

### `package.json`

Define la información y configuración del proyecto:

* Nombre.
* Versión.
* Scripts.
* Dependencias.
* Dependencias de desarrollo.

Los scripts actuales son:

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

---

### `package-lock.json`

Registra las versiones concretas de las dependencias instaladas.

Se recomienda **no eliminarlo ni modificarlo manualmente**.

Cuando se instala el proyecto desde cero:

```bash
npm install
```

npm utiliza este archivo para reproducir el árbol de dependencias.

---

### `vite.config.js`

Contiene la configuración de Vite.

Actualmente utiliza el plugin de React:

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
```

---

# 🏭 Generar una versión de producción

Para generar una compilación optimizada:

```bash
npm run build
```

El script ejecuta:

```text
vite build
```

y genera los archivos finales de la aplicación.

Normalmente el resultado se encuentra en:

```text
dist/
```

Esta carpeta contiene los archivos que posteriormente pueden desplegarse en un servidor web o plataforma compatible con aplicaciones frontend estáticas.

---

# 🔎 Vista previa de producción

Después de ejecutar:

```bash
npm run build
```

puedes comprobar localmente la versión compilada mediante:

```bash
npm run preview
```

El comando inicia el servidor de vista previa proporcionado por Vite.

Esto permite verificar el comportamiento de la aplicación después del proceso de compilación.

---

# 🧹 Ejecutar el análisis de código

El proyecto utiliza **Oxlint**.

Para ejecutar el lint:

```bash
npm run lint
```

Este comando corresponde al script:

```json
"lint": "oxlint"
```

Es recomendable ejecutarlo antes de realizar un commit:

```bash
npm run lint
```

---

# 🔧 Flujo recomendado de desarrollo

Un flujo de trabajo habitual sería:

```bash
git clone https://github.com/Weaspi/Instituciones.git

cd Instituciones

npm install

npm run dev
```

Después de realizar modificaciones:

```bash
npm run lint
```

Y antes de preparar una versión para producción:

```bash
npm run build
```

Finalmente:

```bash
npm run preview
```

---

# 🐛 Solución de problemas

## `npm` no se reconoce como comando

Si aparece un mensaje similar a:

```text
'npm' is not recognized as an internal or external command
```

Node.js no está instalado correctamente o no está disponible en el `PATH`.

Comprueba:

```bash
node --version
npm --version
```

Si ninguno funciona, instala Node.js y reinicia la terminal.

---

## Error durante `npm install`

Primero comprueba las versiones:

```bash
node --version
npm --version
```

Después puedes eliminar las dependencias instaladas y realizar una instalación limpia.

En Windows:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

> Si el problema está relacionado específicamente con una versión del árbol de dependencias, conviene conservar `package-lock.json` y probar primero `npm ci` antes de eliminarlo.

---

## El puerto 5173 está ocupado

Si Vite no puede utilizar el puerto predeterminado, normalmente seleccionará otro puerto disponible.

Puedes revisar en la terminal qué dirección proporciona Vite.

Por ejemplo:

```text
Local: http://localhost:5174/
```

Utiliza la dirección indicada por Vite.

---

## Los datos desaparecen al actualizar la página

Esto es el comportamiento esperado en la versión actual.

Los datos se mantienen únicamente en el estado de React y no se envían a una base de datos.

Para conservarlos después de recargar la página será necesario implementar persistencia, por ejemplo mediante:

* API propia.
* PostgreSQL.
* MySQL.
* MongoDB.
* Supabase.
* Firebase.
* Otro servicio de almacenamiento.

---

# 🔐 Variables de entorno

Actualmente el repositorio no muestra una configuración de variables de entorno necesaria para ejecutar el frontend.

Si posteriormente se incorpora un backend o un servicio externo, se recomienda utilizar archivos como:

```text
.env
.env.example
```

Por ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

El archivo `.env` **no debe incluirse en el repositorio** si contiene credenciales o secretos.

Sí se puede incluir un `.env.example` con los nombres de las variables necesarias:

```env
VITE_API_URL=
```

---

# 🚀 Próximas mejoras sugeridas

Para evolucionar este proyecto de un formulario inicial a un sistema completo de gestión de instituciones, se pueden implementar las siguientes funcionalidades.

## 1. API

Crear un backend con endpoints como:

```http
GET    /api/instituciones
GET    /api/instituciones/:id
POST   /api/instituciones
PUT    /api/instituciones/:id
DELETE /api/instituciones/:id
```

---

## 2. Base de datos

Crear una tabla `instituciones`:

```sql
CREATE TABLE instituciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

El esquema definitivo deberá adaptarse a las necesidades del sistema.

---

## 3. Listado

Agregar una pantalla:

```text
Instituciones
────────────────────────────────────────────
Buscar: [________________________]

Nombre          Tipo       Teléfono
────────────────────────────────────────────
Institución A   Pública    555-000-0000
Institución B   Privada    555-000-0001
Institución C   ONG        555-000-0002
```

---

## 4. Edición

Permitir seleccionar una institución existente y modificar sus datos.

---

## 5. Eliminación

Agregar una opción para eliminar registros, idealmente solicitando confirmación antes de ejecutar la operación.

---

## 6. Búsqueda y filtros

Permitir búsquedas por:

* Nombre.
* Tipo.
* Dirección.
* Correo.
* Otros campos relevantes.

---

## 7. Autenticación

Si la aplicación será utilizada por diferentes usuarios, se puede incorporar:

* Inicio de sesión.
* Roles.
* Permisos.
* Recuperación de contraseña.
* Sesiones seguras.

---

# 🤝 Desarrollo y contribuciones

Para trabajar en una nueva funcionalidad:

```bash
git checkout -b feature/nueva-funcionalidad
```

Realiza los cambios y comprueba el proyecto:

```bash
npm run lint
npm run build
```

Después:

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

Posteriormente se puede crear un Pull Request en GitHub.

---

# 📌 Comandos principales

| Comando           | Descripción                               |
| ----------------- | ----------------------------------------- |
| `npm install`     | Instala las dependencias                  |
| `npm run dev`     | Inicia el servidor de desarrollo          |
| `npm run lint`    | Ejecuta Oxlint                            |
| `npm run build`   | Genera la versión de producción           |
| `npm run preview` | Previsualiza la compilación de producción |

---

# 📄 Licencia

Actualmente el repositorio no muestra una licencia de código abierto declarada en sus archivos principales.

Antes de reutilizar, distribuir o modificar el proyecto para terceros, se recomienda definir explícitamente una licencia en el repositorio.

---

# 👨‍💻 Autor y repositorio

Proyecto:

**Instituciones**

Repositorio:

[https://github.com/Weaspi/Instituciones](https://github.com/Weaspi/Instituciones?utm_source=chatgpt.com)

---

## ⚡ Instalación rápida

Si solamente quieres ejecutar el proyecto rápidamente:

```bash
git clone https://github.com/Weaspi/Instituciones.git
cd Instituciones
npm install
npm run dev
```

Después abre en el navegador la dirección que muestre Vite, normalmente:

```text
http://localhost:5173
```

---

## 🧭 Resumen de arquitectura actual

```text
                  ┌─────────────────────┐
                  │       Usuario       │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │      React UI       │
                  │                     │
                  │  Alta de institución│
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    useState     │
                    │                 │
                    │ Datos del form  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  handleSubmit  │
                    └────────┬───────┘
                             │
                    ┌────────┴─────────┐
                    ▼                  ▼
             console.log()       Mensaje UI
             
             Actualmente no existe
             persistencia de datos.

