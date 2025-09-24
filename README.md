<h1 align="center">🚀 EPIC-UC 🎮</h1>
<p align="center">
  <img src="https://media.tenor.com/rYxQpOBvy3oAAAAd/controller-video-games.gif" width="250"/>
</p>

<p align="center">
  <b>Plataforma de Videojuegos inspirada en Epic Games Store, optimizada para Ubuntu Linux</b><br/>
  Desarrollado por <a href="https://github.com/michael-ticona-dev">Michael Ticona</a>
</p>

---

## ✨ Descripción del Proyecto
**EPIC-UC** es una plataforma digital de videojuegos con frontend moderno, backend robusto y base de datos optimizada, diseñada para correr con **alto rendimiento en hardware de consumo moderado**.  
Inspirada en la Epic Games Store, permite gestionar usuarios, juegos, compras y comunidad gamer de manera profesional.

---

## 🎮 Características Principales

### 🕹️ Catálogo de Juegos
- Interfaz atractiva con **cards animadas**  
- Sistema de **categorías y etiquetas dinámicas**  
- **Búsqueda y filtrado avanzado**  
- Galerías de imágenes + videos  
- Sistema de **reseñas y calificaciones**

### 👤 Gestión de Usuarios
- Registro y login con **JWT + bcrypt**  
- Perfiles personalizables con avatares  
- Biblioteca de juegos adquiridos  
- **Wishlist interactiva**  
- Historial de transacciones  

### 🛒 Sistema de Compras
- Carrito de compras funcional  
- Checkout rápido y seguro  
- Gestión de **métodos de pago simulados**  
- Soporte para **cupones y descuentos**

### ⚙️ Panel de Administración
- CRUD completo de juegos 🎮  
- Gestión de usuarios y permisos 🔑  
- Dashboard con métricas 📊  
- Control de órdenes y transacciones 💰  

---

## 👥 Roles y Modos de Acceso

🔹 **Administrador**
- Manejo total del sistema  
- Administración del catálogo de juegos  
- Control de reseñas y reportes  
- Visualización de **gráficas en tiempo real**

🔹 **Usuario**
- Navegar catálogo de juegos  
- Acceder a su biblioteca 🎮  
- Publicar reseñas y dar like a comentarios  
- Gestionar su perfil  

---

## 🛠️ Stack Tecnológico

### 🔹 Frontend
- React 18 con hooks  
- React Router  
- Context API para estado global  
- **CSS puro + animaciones**  

### 🔹 Backend
- Node.js con Express  
- JWT para autenticación stateless  
- Bcrypt para encriptación  
- Helmet.js + rate limiting  

### 🔹 Base de Datos
- PostgreSQL optimizado para Ubuntu  
- Índices para consultas rápidas  
- Pool de conexiones ajustado  

---

## ⚡ Instalación

```bash
# Clonar el repo
git clone https://github.com/michael-ticona-dev/epic_uc.git
cd epic_uc

# Backend
npm install
npm run dev
