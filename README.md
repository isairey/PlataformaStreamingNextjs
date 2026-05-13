<div align="center">

<img width="220" src="https://cdn-icons-png.flaticon.com/512/2503/2503508.png" />

# 🎬 Screenly

### Plataforma de streaming moderna desarrollada con Next.js 🚀

<p align="center">
  <b>Screenly</b> es una aplicación full-stack de streaming de películas inspirada en Netflix, construida con Next.js App Router, TypeScript, Tailwind CSS, Prisma y TMDB API para ofrecer una experiencia multimedia moderna y fluida.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-Fullstack-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-Modern%20Web-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/TMDB-Movie%20API-01D277?style=for-the-badge">
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white">
</p>

<p align="center">
  <a href="#-acerca-del-proyecto">Acerca</a> •
  <a href="#-características">Características</a> •
  <a href="#-tecnologías-utilizadas">Tecnologías</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

</div>

---

# 🌌 Acerca del proyecto

**Screenly** es una plataforma multimedia moderna tipo Netflix desarrollada utilizando tecnologías full-stack modernas.

La aplicación ofrece:

- 🎬 Exploración de películas y series
- 🔐 Sistema de autenticación
- ❤️ Watchlist personalizada
- 🔍 Buscador inteligente
- 🎥 Reproductor multimedia
- 📱 Responsive Design
- 🌙 Interfaz cinematográfica moderna

El proyecto fue desarrollado para practicar:

- Next.js App Router
- Full Stack Development
- TypeScript
- Prisma ORM
- APIs externas
- Arquitectura moderna web

---

# ✨ Características

## 🎥 Plataforma multimedia

- 🍿 Películas populares y trending
- 🎞️ Información detallada
- ⭐ Ratings y trailers
- 🔥 Diseño tipo Netflix

---

## 🔐 Sistema de autenticación

- 👤 Registro e inicio de sesión
- 🔑 NextAuth Authentication
- 📧 Recuperación de contraseña
- 🔒 Protección de rutas privadas

---

## ❤️ Watchlist personalizada

- 💾 Guardar películas favoritas
- 📂 Biblioteca personalizada
- ⚡ Gestión rápida
- 🎬 Historial multimedia

---

## 🔍 Búsqueda avanzada

- 🔎 Buscador inteligente
- ⚡ Resultados rápidos
- 🎯 Filtrado dinámico
- 🎬 Exploración por título

---

## 📱 Responsive Design

- 📲 Compatible con móviles
- 💻 Optimizado para escritorio
- 🖥️ Responsive Layout
- 🌙 Dark UI moderna

---

# 🛠️ Tecnologías utilizadas

## ⚡ Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,react" />
</p>

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion

---

## 🗄️ Backend & Database

<p>
  <img src="https://skillicons.dev/icons?i=prisma,sqlite,nodejs" />
</p>

- Prisma ORM
- SQLite
- Node.js

---

## 🔐 Autenticación

- NextAuth.js
- JWT Sessions
- Secure Authentication

---

## 🌐 APIs & Services

<p>
  <img src="https://skillicons.dev/icons?i=firebase" />
</p>

- TMDB API
- SendGrid
- Email Services

---

# 📂 Estructura del proyecto

```bash
PlataformaStreamingNextjs/
│
├── app/
├── components/
├── prisma/
├── public/
├── scripts/
├── styles/
├── lib/
├── types/
├── .env.local
├── package.json
└── README.md
```

---

# ⚡ Instalación

## 📋 Requisitos

- Node.js
- NPM
- TMDB API Key

---

# 🔑 Obtener API Key de TMDB

1️⃣ Crear cuenta en TMDB

```txt
https://www.themoviedb.org/
```

2️⃣ Ir a:

```txt
Settings → API
```

3️⃣ Generar API Key

---

# ⚙️ Configurar variables de entorno

## Crear archivo:

```bash
.env.local
```

## Agregar configuración:

```env
TMDB_API_KEY="your-api-key"
TMDB_BASE_URL="https://api.themoviedb.org/3"

DATABASE_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-password"

SENDGRID_API_KEY="SG.your-api-key"
SENDGRID_FROM_EMAIL="noreply@domain.com"
```

---

# 📦 Instalar dependencias

```bash
npm install
```

---

# 🗄️ Configurar base de datos

```bash
npx prisma db push
```

---

# 🚀 Ejecutar proyecto

```bash
npm run dev
```

Abrir en navegador:

```bash
http://localhost:3000
```

---

# 🎬 Páginas principales

| Página | Ruta |
|---|---|
| Home | `/` |
| Movies | `/movies` |
| Search | `/search` |
| Movie Details | `/movie/[id]` |
| Watch | `/watch/[id]` |
| Watchlist | `/watchlist` |
| Auth | `/auth/signin` |

---

# 🛠️ Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Iniciar producción |
| `npm run db:push` | Prisma DB Push |
| `npm run db:studio` | Prisma Studio |
| `npm run fetch:movies` | Descargar películas TMDB |

---

# 🎥 Integración TMDB

## 📡 Funciones disponibles

- Trending movies
- Popular movies
- Top rated
- Now Playing
- Upcoming movies

---

## ⚡ Fetch automático

```bash
npm run fetch:movies
```

---

# 📧 Sistema de correos

## ✉️ Gmail SMTP

- Recuperación de contraseña
- Verificación
- Emails automáticos

---

## 🚀 SendGrid

- Producción recomendada
- Mejor deliverability
- Emails profesionales

---

# 🗄️ Database Schema

## 📂 Modelos principales

- 👤 User
- 🎬 Movie
- ❤️ Watchlist
- 🔑 PasswordResetToken

---

# 📸 Vista previa

<div align="center">

<img width="1000" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop" />

</div>

---

# 🧠 Objetivos del proyecto

## 🎯 Aprender y practicar

- Next.js App Router
- TypeScript
- Prisma ORM
- Full Stack Development
- APIs REST
- Streaming UI
- Arquitectura moderna web

---

# 🚧 Roadmap

## 🔮 Próximas mejoras

- 📱 Aplicación móvil
- 🎥 Streaming real
- 🤖 IA de recomendaciones
- 🌍 Multi idioma
- 👥 Sistema social
- 📡 WebSockets
- 🎬 Live streaming

---

# 🐛 Troubleshooting

## ❌ Problemas con TMDB

- Verificar API Key
- Revisar límites de requests
- Ejecutar fetch scripts

---

## ⚠️ Problemas de autenticación

- Configurar NEXTAUTH_SECRET
- Revisar variables `.env.local`

---

## 🗄️ Problemas con Prisma

```bash
npx prisma db push
```

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas ❤️

## Cómo contribuir

1. Fork del proyecto

```bash
git checkout -b feature/new-feature
```

2. Commit de cambios

```bash
git commit -m "✨ Nueva funcionalidad"
```

3. Push al repositorio

```bash
git push origin feature/new-feature
```

4. Crear Pull Request 🚀

---

# 👨‍💻 Autor

<div align="center">

## Isai Reyes Developer

Desarrolladores enfocados en experiencias multimedia modernas y plataformas OTT full-stack.

</div>

---

# 🌟 Apoya el proyecto

⭐ Dale una estrella  
🍴 Haz fork  
📢 Comparte el proyecto

---

# 📜 Licencia

Proyecto desarrollado con fines educativos y de práctica full-stack utilizando TMDB API.

---

<div align="center">

### 🎬 Screenly — experiencia streaming moderna impulsada por Next.js 🚀

</div>
