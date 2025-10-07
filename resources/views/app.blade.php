<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>@yield('titulo', 'EPIC-UC')</title>

    {{-- Importa variables primero y luego estilos del header/nav --}}
    @vite('resources/css/variables.css')
    @vite('resources/css/Header.css')
    @stack('styles')
  </head>

  <body>
    {{-- ===== ENCABEZADO (NAV EPIC) ===== --}}
    <header class="encabezado" role="banner">
      <div class="contenedor">
        <div class="contenido_encabezado">
          {{-- 🔹 Izquierda: logo + navegación --}}
          <div class="encabezado_izquierda">
            <a href="{{ route('inicio') }}" class="logo" aria-label="Ir a inicio">
              <img src="{{ asset('logoEpicUc.png') }}" alt="EPIC-UC" class="imagen_logo" />
            </a>

            {{-- Toggle móvil (CSS-only) --}}
            <input type="checkbox" id="nav_toggle" class="nav_toggle" aria-hidden="true">
            <label for="nav_toggle" class="btn_hamburguesa" aria-label="Abrir/cerrar menú de navegación">
              <span class="sr_only">Menú</span>
            </label>

            <nav class="navegacion" aria-label="navegacion_principal">
              <a href="{{ route('inicio') }}"
                 class="enlace_navegacion {{ request()->routeIs('inicio') ? 'activo' : '' }}"
                 @if(request()->routeIs('inicio')) aria-current="page" @endif>
                <span class="enlace_texto">Inicio</span>
                <span class="enlace_barra"></span>
              </a>

              <a href="{{ route('catalogo') }}"
                 class="enlace_navegacion {{ request()->routeIs('catalogo') ? 'activo' : '' }}"
                 @if(request()->routeIs('catalogo')) aria-current="page" @endif>
                <span class="enlace_texto">Catálogo</span>
                <span class="enlace_barra"></span>
              </a>

              <a href="{{ url('/ofertas') }}"
                 class="enlace_navegacion {{ request()->is('ofertas*') ? 'activo' : '' }}"
                 @if(request()->is('ofertas*')) aria-current="page" @endif>
                <span class="enlace_texto">Ofertas</span>
                <span class="enlace_barra"></span>
              </a>

              <a href="{{ url('/proximos') }}"
                 class="enlace_navegacion {{ request()->is('proximos*') ? 'activo' : '' }}"
                 @if(request()->is('proximos*')) aria-current="page" @endif>
                <span class="enlace_texto">Próximos</span>
                <span class="enlace_barra"></span>
              </a>

              <a href="{{ url('/noticias') }}"
                 class="enlace_navegacion {{ request()->is('noticias*') ? 'activo' : '' }}"
                 @if(request()->is('noticias*')) aria-current="page" @endif>
                <span class="enlace_texto">Noticias</span>
                <span class="enlace_barra"></span>
              </a>
            </nav>
          </div>

          {{-- 🔹 Derecha: iconos + menú usuario --}}
          <div class="encabezado_derecha">
            {{-- Deseos (agregada clase boton_wishlist para badge JS) --}}
            <a href="{{ url('/favoritos') }}" class="boton_icono boton_wishlist" title="Lista de deseos" aria-label="Lista de deseos">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.84 4.61a5.5 5.5 0 0 1 .11 7.78L12 20.25l-7.95-7.86a5.5 5.5 0 1 1 7.78-7.78l.17.17.17-.17a5.5 5.5 0 0 1 7.62 0z"/>
              </svg>
              <span class="insignia_wishlist" style="display:none">0</span>
            </a>

            {{-- Biblioteca --}}
            <a href="{{ url('/biblioteca') }}" class="boton_icono" title="Biblioteca" aria-label="Biblioteca">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/>
                <path d="M4 3h16v16H6.5A2.5 2.5 0 0 1 4 16.5z"/>
                <path d="M8 7h8"/><path d="M8 11h8"/>
              </svg>
            </a>

            {{-- Carrito (clase boton_carrito + badge para tu JS) --}}
            <a href="{{ route('carrito') }}" class="boton_icono boton_carrito" title="Carrito" aria-label="Carrito">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span class="insignia_carrito" style="display:none">0</span>
            </a>

            {{-- Pedidos --}}
            <a href="{{ url('/pedidos') }}" class="boton_icono" title="Pedidos" aria-label="Pedidos">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   viewBox="0 0 24 24" aria-hidden="true">
                <path d="m16.5 9.4-9-5.19"/><path d="m21 8-9 5-9-5 9-5 9 5Z"/>
                <path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>
              </svg>
            </a>

            {{-- Publicaciones --}}{{-- Publicaciones --}}
            <a href="{{ url('/publicaciones') }}" class="boton_icono" title="Publicaciones" aria-label="Publicaciones">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
              </svg>
            </a>

           
            {{-- Menu Usuario --}}
            @php
  /** Helper cortito para mostrar nombre bonito */
  $user = Auth::user();
  $aliasCorto = $user
      ? (\Illuminate\Support\Str::limit($user->usuario ?: $user->nombre, 18))
      : null;

  $correoMostrar = $user->correo ?? $user->email ?? null;
@endphp

<div class="menu_usuario" id="menuUsuario">
  <button
    class="boton_usuario"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="desplegableUsuario"
  >
    <img
      src="{{ auth()->check() ? ($user->url_avatar ?: asset('avatar.png')) : asset('avatar.png') }}"
      alt="Avatar"
      class="avatar"
    />
    @auth
      <span class="nombre_usuario">
        {{ $user->usuario ? '@'.$aliasCorto : $aliasCorto }}
      </span>
    @endauth
    <span class="sr_only">Abrir menú de usuario</span>
  </button>

  <div class="desplegable_usuario" id="desplegableUsuario" role="menu" aria-label="menu_usuario">
    @guest
      <div class="seccion_menu">
        <a href="{{ route('login') }}" class="elemento_desplegable" role="menuitem">Iniciar sesión</a>
        <a href="{{ route('register') }}" class="elemento_desplegable" role="menuitem">Registrarse</a>
      </div>
    @endguest

    @auth
      <div class="seccion_menu encabezado">
        <div class="perfil_mini">
          <img
            src="{{ $user->url_avatar ?: asset('avatar.png') }}"
            alt="Avatar"
            class="avatar_mini"
          />
          <div class="perfil_textos">
            <strong class="perfil_nombre">{{ $user->nombre }}</strong>
            @if ($user->usuario)
              <small class="perfil_usuario">{{ '@'.$user->usuario }}</small>
            @endif
            @if ($correoMostrar)
              <small class="perfil_correo">{{ $correoMostrar }}</small>
            @endif
          </div>
        </div>
      </div>

      <div class="seccion_menu">
        <a href="{{ route('perfil') }}" class="elemento_desplegable" role="menuitem">Perfil</a>
        <a href="{{ route('configuracion') }}" class="elemento_desplegable" role="menuitem">Configuración</a>
        <a href="{{ route('favoritos') }}" class="elemento_desplegable" role="menuitem">Mis favoritos</a>
      </div>

      <div class="seccion_menu">
        <form method="POST" action="{{ route('logout') }}">
          @csrf
          <button type="submit" class="elemento_desplegable peligro" role="menuitem">
            Cerrar sesión
          </button>
        </form>
      </div>
    @endauth
  </div>
</div>


            
          </div>
          {{-- /Derecha --}}
        </div>
      </div>
    </header>

    {{-- ===== CONTENIDO ===== --}}
    <main class="contenido_pagina">
      @yield('contenido')
    </main>

    {{-- ===== PANEL FLOTANTE (INCRUSTADO) ===== --}}
    <div class="flotante_contenedor">
      <input type="checkbox" id="flotante_toggle" class="flotante_toggle" aria-hidden="true" />
      <label for="flotante_toggle" class="flotante_boton" aria-label="Abrir acciones rápidas" title="Acciones rápidas">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
        </svg>
      </label>

      <div class="flotante_panel" role="menu" aria-label="acciones_rapidas">
        <a href="{{ url('/amigos') }}" class="flotante_item" role="menuitem">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Amigos</span>
          <span class="flotante_badge">2</span>
        </a>

        <a href="{{ url('/chat_global') }}" class="flotante_item" role="menuitem">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
          </svg>
          <span>Chat global</span>
        </a>

        <a href="{{ url('/agregar_usuario') }}" class="flotante_item" role="menuitem">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 14a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M19 8v6"/><path d="M22 11h-6"/>
          </svg>
          <span>Agregar usuario</span>
        </a>

        <a href="{{ url('/soporte') }}" class="flotante_item" role="menuitem">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s8-4 8-10a8 8 0 1 0-16 0c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Soporte</span>
        </a>
      </div>
    </div>

    @stack('scripts')

    {{-- ===== Script base de layout: cierra menú usuario y sincroniza badges (carrito/deseos) ===== --}}
    <script>
      (() => {
        const $ = (s, c=document)=>c.querySelector(s);
        const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));

        // --- Menú usuario: toggle + cerrar al hacer click fuera ---
        const userWrap  = $('.menu_usuario');
        const btnUser   = $('.boton_usuario', userWrap);
        const dropdown  = $('.desplegable_usuario', userWrap);

        if (btnUser && dropdown) {
          const toggle = () => {
            const open = dropdown.classList.toggle('abierto');
            btnUser.setAttribute('aria-expanded', String(open));
          };
          btnUser.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
          });
          document.addEventListener('click', (e) => {
            if (!userWrap.contains(e.target) && dropdown.classList.contains('abierto')) {
              dropdown.classList.remove('abierto');
              btnUser.setAttribute('aria-expanded', 'false');
            }
          });
          // Accesibilidad: cerrar con ESC
          document.addEventListener('keydown', (e)=>{
            if (e.key === 'Escape' && dropdown.classList.contains('abierto')) {
              dropdown.classList.remove('abierto');
              btnUser.setAttribute('aria-expanded', 'false');
              btnUser.focus();
            }
          });
        }

        // --- Badges: Carrito y Deseos (leer localStorage para inicializar) ---
        const syncCartBadge = () => {
          try {
            const arr = JSON.parse(localStorage.getItem('epic_uc_cart') || '[]');
            const total = arr.reduce((a,i)=>a+(i.qty||1),0);
            const btn = document.querySelector('.boton_carrito');
            if (!btn) return;
            let b = btn.querySelector('.insignia_carrito');
            if (!b) {
              b = document.createElement('span');
              b.className = 'insignia_carrito';
              btn.appendChild(b);
            }
            b.textContent = total > 99 ? '99+' : total;
            b.style.display = total > 0 ? 'inline-flex' : 'none';
          } catch(_) {}
        };

        const syncWishBadge = () => {
          try {
            const arr = JSON.parse(localStorage.getItem('epic_uc_wishlist') || '[]');
            const total = arr.length;
            const btn = document.querySelector('.boton_wishlist');
            if (!btn) return;
            let b = btn.querySelector('.insignia_wishlist');
            if (!b) {
              b = document.createElement('span');
              b.className = 'insignia_wishlist';
              btn.appendChild(b);
            }
            b.textContent = total > 99 ? '99+' : total;
            b.style.display = total > 0 ? 'inline-flex' : 'none';
          } catch(_) {}
        };

        // Init
        syncCartBadge();
        syncWishBadge();

        // Cerrar nav móvil si se cambia de tamaño grande
        const navToggle = $('#nav_toggle');
        if (navToggle) {
          const mql = window.matchMedia('(min-width: 1024px)');
          const handler = () => { if (mql.matches) navToggle.checked = false; };
          mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
        }
      })();
    </script>
  </body>
</html>
