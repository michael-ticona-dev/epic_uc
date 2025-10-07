@extends('app')

@section('titulo', 'Inicio | EPIC-UC')

@vite('resources/css/variables.css')
@vite('resources/css/principal_inicio.css')

@section('contenido')
<section class="seccion_inicio">
  <div class="contenedor">

    {{-- =======================
         CARRUSEL (primero)
         100% CSS (auto + manual)
       ======================= --}}
    <div class="carrusel carrusel_auto" aria-label="promociones_destacadas">
      {{-- Radios ocultos (control manual) --}}
      <input type="radio" name="carrusel" id="c_slide1" checked>
      <input type="radio" name="carrusel" id="c_slide2">
      <input type="radio" name="carrusel" id="c_slide3">
      <input type="radio" name="carrusel" id="c_slide4">
      <input type="radio" name="carrusel" id="c_slide5">

      <div class="carrusel_ventana" role="region">
        <div class="carrusel_lista">
          {{-- Slide 1 --}}
          <article class="carrusel_item">
            <div class="carrusel_info">
              <h3 class="carrusel_titulo">Lanzamiento de la semana</h3>
              <p class="carrusel_texto">Explora un mundo abierto impresionante con combates frenéticos.</p>
              <div class="carrusel_btns">
                <a class="btn_principal" href="{{ route('catalogo') }}">Comprar ahora</a>
                <a class="btn_secundario" href="{{ route('catalogo') }}">Ver detalles</a>
              </div>
            </div>
            <div class="carrusel_imagen">
              <img src="{{ asset('slides/slide1.jpg') }}" alt="Lanzamiento de la semana">
            </div>
          </article>

          {{-- Slide 2 --}}
          <article class="carrusel_item">
            <div class="carrusel_info">
              <h3 class="carrusel_titulo">Ofertas relámpago</h3>
              <p class="carrusel_texto">Descuentos de hasta 70% en sagas icónicas por tiempo limitado.</p>
              <div class="carrusel_btns">
                <a class="btn_principal" href="{{ url('/ofertas') }}">Aprovechar</a>
                <a class="btn_secundario" href="{{ url('/ofertas') }}">Más info</a>
              </div>
            </div>
            <div class="carrusel_imagen">
              <img src="{{ asset('slides/slide2.jpg') }}" alt="Ofertas relámpago">
            </div>
          </article>

          {{-- Slide 3 --}}
          <article class="carrusel_item">
            <div class="carrusel_info">
              <h3 class="carrusel_titulo">Free-to-Play</h3>
              <p class="carrusel_texto">Descubre títulos gratis con temporadas, cosméticos y eventos.</p>
              <div class="carrusel_btns">
                <a class="btn_principal" href="{{ route('catalogo') }}">Jugar gratis</a>
                <a class="btn_secundario" href="{{ route('catalogo') }}">Explorar</a>
              </div>
            </div>
            <div class="carrusel_imagen">
              <img src="{{ asset('slides/slide3.jpg') }}" alt="Juegos Free-to-Play">
            </div>
          </article>

          {{-- Slide 4 --}}
          <article class="carrusel_item">
            <div class="carrusel_info">
              <h3 class="carrusel_titulo">Indies destacados</h3>
              <p class="carrusel_texto">Experiencias únicas con arte, narrativa y banda sonora inolvidable.</p>
              <div class="carrusel_btns">
                <a class="btn_principal" href="{{ route('catalogo') }}">Descubrir</a>
                <a class="btn_secundario" href="{{ route('catalogo') }}">Ver más</a>
              </div>
            </div>
            <div class="carrusel_imagen">
              <img src="{{ asset('slides/slide4.jpg') }}" alt="Juegos Indie destacados">
            </div>
          </article>

          {{-- Slide 5 --}}
          <article class="carrusel_item">
            <div class="carrusel_info">
              <h3 class="carrusel_titulo">Próximos lanzamientos</h3>
              <p class="carrusel_texto">Reserva anticipada con bonificaciones exclusivas.</p>
              <div class="carrusel_btns">
                <a class="btn_principal" href="{{ url('/proximos') }}">Reservar</a>
                <a class="btn_secundario" href="{{ url('/proximos') }}">Calendario</a>
              </div>
            </div>
            <div class="carrusel_imagen">
              <img src="{{ asset('slides/slide5.jpg') }}" alt="Próximos lanzamientos">
            </div>
          </article>
        </div>
      </div>

      {{-- Controles laterales (click para cambiar) --}}
      <div class="carrusel_controles" aria-hidden="true">
        <label for="c_slide5"></label>
        <label for="c_slide2"></label>
        <label for="c_slide1"></label>
        <label for="c_slide3"></label>
        <label for="c_slide4"></label>
      </div>

      {{-- Puntos inferiores --}}
      <div class="carrusel_puntos" role="tablist" aria-label="navegacion_carrusel">
        <label for="c_slide1" role="tab" aria-controls="c_slide1"></label>
        <label for="c_slide2" role="tab" aria-controls="c_slide2"></label>
        <label for="c_slide3" role="tab" aria-controls="c_slide3"></label>
        <label for="c_slide4" role="tab" aria-controls="c_slide4"></label>
        <label for="c_slide5" role="tab" aria-controls="c_slide5"></label>
      </div>
    </div>

    {{-- =======================
         HERO MINI + CTA
       ======================= --}}
    <div class="hero_inicio">
      <div class="hero_contenido">
        <h1 class="titulo_inicio">Todo tu mundo gamer en <span class="titulo_resaltado">EPIC-UC</span></h1>
        <p class="texto_inicio">Catálogo, ofertas, próximos lanzamientos, noticias y más. Curado con un look tipo Epic Games, oscuro y elegante.</p>
        <div class="acciones_inicio">
          <a href="{{ route('catalogo') }}" class="btn_principal">Ir al catálogo</a>
          <a href="{{ url('/ofertas') }}" class="btn_secundario">Ver ofertas</a>
        </div>
      </div>
      <div class="hero_media">
        <img src="{{ asset('hero/hero_mock.jpg') }}" alt="Colección destacada">
      </div>
    </div>

    {{-- =======================
         BANDA LOGOS / PARTNERS
       ======================= --}}
    <section class="banda_logos" aria-label="partners">
      <div class="banda_pista">
        <img class="banda_logo" src="{{ asset('logos/logo1.svg') }}" alt="Partner 1" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo2.svg') }}" alt="Partner 2" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo3.svg') }}" alt="Partner 3" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo4.svg') }}" alt="Partner 4" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo5.svg') }}" alt="Partner 5" height="28">
        {{-- duplicado para scroll infinito --}}
        <img class="banda_logo" src="{{ asset('logos/logo1.svg') }}" alt="Partner 1" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo2.svg') }}" alt="Partner 2" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo3.svg') }}" alt="Partner 3" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo4.svg') }}" alt="Partner 4" height="28">
        <img class="banda_logo" src="{{ asset('logos/logo5.svg') }}" alt="Partner 5" height="28">
      </div>
    </section>

    {{-- =======================
         DESTACADOS (grilla)
       ======================= --}}
    <section class="bloque_seccion">
      <div class="encabezado_seccion">
        <h2 class="titulo_seccion">Destacados</h2>
        <a class="link_seccion" href="{{ route('catalogo') }}">Ver todo</a>
      </div>

      <div class="grilla_tarjetas">
        @for ($i = 1; $i <= 8; $i++)
          <article class="tarjeta">
            <div class="tarjeta_imagen">
              <img src="{{ asset("games/game{$i}.jpg") }}" alt="Juego {{ $i }}">
            </div>
            <div class="tarjeta_contenido">
              <h3 class="tarjeta_titulo">Juego {{ $i }}</h3>
              <p class="tarjeta_texto">Acción • Mundo abierto</p>
              <div class="lista_chips">
                <span class="chip">Acción</span>
                <span class="chip">Aventura</span>
                <span class="chip">Singleplayer</span>
              </div>
              <div class="tarjeta_pie">
                <span class="badge_descuento">-{{ rand(10,60) }}%</span>
                <div class="precio_pila">
                  <span class="precio_original">S/ {{ number_format(rand(79,199), 2) }}</span>
                  <span class="precio_final">S/ {{ number_format(rand(29,149), 2) }}</span>
                </div>
              </div>
            </div>
          </article>
        @endfor
      </div>
    </section>

    {{-- =======================
         CATEGORÍAS / FILTROS
       ======================= --}}
    <section class="bloque_seccion">
      <div class="encabezado_seccion">
        <h2 class="titulo_seccion">Explora por categorías</h2>
        <a class="link_seccion" href="{{ route('catalogo') }}">Ver catálogo</a>
      </div>
      <div class="lista_chips">
        @foreach (['RPG','Shooter','Mundo abierto','Aventura','Fantasía','Indie','Plataformas','Deportes','Terror','Carreras'] as $tag)
          <a href="{{ route('catalogo') }}" class="chip">{{ $tag }}</a>
        @endforeach
      </div>
    </section>

    {{-- =======================
         NOTICIAS RÁPIDAS
       ======================= --}}
    <section class="bloque_seccion">
      <div class="encabezado_seccion">
        <h2 class="titulo_seccion">Noticias</h2>
        <a class="link_seccion" href="{{ url('/noticias') }}">Más noticias</a>
      </div>

      <div class="grilla_tarjetas">
        @for ($n = 1; $n <= 4; $n++)
          <article class="tarjeta" style="grid-column: span 6;">
            <div class="tarjeta_imagen">
              <img src="{{ asset("news/news{$n}.jpg") }}" alt="Noticia {{ $n }}">
            </div>
            <div class="tarjeta_contenido">
              <h3 class="tarjeta_titulo">Parche {{ $n }}.x: mejoras y equilibrio</h3>
              <p class="tarjeta_texto">Nuevos modos, balance de armas y recompensas por evento de temporada.</p>
              <div class="lista_chips">
                <span class="chip">Actualización</span>
                <span class="chip">Evento</span>
              </div>
              <div class="tarjeta_pie">
                <a class="u_link" href="{{ url('/noticias') }}">Leer más</a>
              </div>
            </div>
          </article>
        @endfor
      </div>
    </section>

    {{-- =======================
         BANNER CTA
       ======================= --}}
    <aside class="banner_cta">
      <h3 class="banner_titulo">Únete a la comunidad EPIC-UC</h3>
      <p class="banner_texto">Recibe novedades, drops, sorteos y acceso anticipado a pruebas técnicas.</p>
      <div class="acciones_inicio">
        <a href="{{ route('catalogo') }}" class="btn_principal">Explorar juegos</a>
        <a href="{{ url('/registro') }}" class="btn_secundario">Crear cuenta</a>
      </div>
    </aside>

    {{-- =======================
         NEWSLETTER (estático)
       ======================= --}}
    <section class="bloque_seccion">
      <div class="encabezado_seccion">
        <h2 class="titulo_seccion">Boletín</h2>
        <span class="link_seccion">Suscríbete y no te pierdas nada</span>
      </div>
      <form class="form_newsletter" action="#" method="post" onsubmit="return false;">
        <input class="input_newsletter" type="email" placeholder="tu@email.com" aria-label="correo">
        <button class="btn_principal" type="submit">Suscribirme</button>
      </form>
    </section>

    {{-- =======================
         PLACEHOLDER STREAMING KICK
         (aquí integraremos la API/iframe de Kick)
       ======================= --}}
    <section class="bloque_seccion">
      <div class="encabezado_seccion">
        <h2 class="titulo_seccion">Streaming en vivo</h2>
        <span class="link_seccion">Próxima integración: Kick</span>
      </div>

      <div id="kick_stream_container" class="kick_stream_contenedor" aria-live="polite">
        {{-- Aquí se montará el player de Kick (API/iframe) --}}
        <div class="kick_stream_placeholder skeleton">
          <div class="kick_stream_poster"></div>
          <div class="kick_stream_info">
            <div class="kick_stream_titulo skeleton"></div>
            <div class="kick_stream_meta skeleton"></div>
          </div>
        </div>
      </div>
    </section>

  </div>
</section>
@endsection
