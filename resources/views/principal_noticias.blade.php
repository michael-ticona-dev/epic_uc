@extends('app')

@section('titulo', 'Noticias | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_noticias.css')
@endpush

@section('contenido')
<section class="seccion_noticias">
  <div class="contenedor contenedor_noticias">

    {{-- ====== Encabezado ====== --}}
    <header class="encabezado_seccion">
      <div class="titulo_bloque">
        <h1 class="titulo_seccion">Noticias</h1>
        <p class="subtitulo_seccion">Lo último del mundo gaming: anuncios, eventos y actualizaciones.</p>
      </div>

      {{-- Pestañas de categorías (aplican querystring) --}}
      @php
        $categorias = [
          'todas'         => 'Todas',
          'lanzamientos'  => 'Lanzamientos',
          'actualizaciones'=> 'Actualizaciones',
          'eventos'       => 'Eventos',
          'esports'       => 'eSports',
        ];
        $cat_actual = request('categoria', 'todas');
      @endphp
      <nav class="tabs_categorias" aria-label="categorias">
        @foreach($categorias as $slug => $titulo)
          @php
            $url = $slug === 'todas'
              ? url('/noticias')
              : url('/noticias?categoria='.$slug.'&q='.urlencode(request('q', '')));
          @endphp
          <a href="{{ $url }}"
             class="tab_cat {{ $cat_actual === $slug ? 'activa' : '' }}"
             @if($cat_actual === $slug) aria-current="page" @endif>
            {{ $titulo }}
          </a>
        @endforeach
      </nav>
    </header>

    {{-- ====== Controles (búsqueda / orden) ====== --}}
    <form method="GET" action="{{ url('/noticias') }}" class="controles_noticias" role="search">
      <div class="buscador_caja">
        <svg viewBox="0 0 24 24" class="icono_buscar" aria-hidden="true"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Buscar noticias…" class="campo_busqueda" aria-label="Buscar noticias">
      </div>

      <input type="hidden" name="categoria" value="{{ request('categoria') }}">

      <div class="orden_caja">
        <label class="sr_only" for="orden">Ordenar por</label>
        <select id="orden" name="orden" class="select_orden">
          <option value="recientes"     {{ request('orden','recientes') === 'recientes' ? 'selected' : '' }}>Más recientes</option>
          <option value="antiguas"      {{ request('orden') === 'antiguas' ? 'selected' : '' }}>Más antiguas</option>
          <option value="relevantes"    {{ request('orden') === 'relevantes' ? 'selected' : '' }}>Más relevantes</option>
        </select>
        <button class="btn_aplicar" type="submit">Aplicar</button>
      </div>
    </form>

    @php
      // ====== Mock de noticias (reemplaza por tu consulta a BD) ======
      $todas_noticias = [
        [
          'titulo' => 'Nuevo tráiler revela mecánicas de “Crónicas del Alba”',
          'slug' => 'nuevo-trailer-cronicas-del-alba',
          'img' => asset('img/noticias/cronicas_trailer.jpg'),
          'resumen' => 'El esperado RPG mostró combate renovado, mundo abierto ampliado y sistema de clanes.',
          'fecha' => '2025-10-02',
          'categoria' => 'lanzamientos',
          'etiquetas' => ['rpg', 'mundo_abierto', 'trailer'],
        ],
        [
          'titulo' => 'Parche 1.3 “Ciudad Sin Sueño”: ray tracing y nuevo distrito',
          'slug' => 'parche-13-ciudad-sin-sueno',
          'img' => asset('img/noticias/ciudad_patch.jpg'),
          'resumen' => 'La actualización trae mejoras gráficas, balance de armas y misiones secundarias.',
          'fecha' => '2025-09-28',
          'categoria' => 'actualizaciones',
          'etiquetas' => ['parche', 'accion', 'open_world'],
        ],
        [
          'titulo' => 'Final regional de eSports: equipos clasificados y formato',
          'slug' => 'final-regional-esports',
          'img' => asset('img/noticias/esports_regional.jpg'),
          'resumen' => 'Ocho equipos disputarán el título con bracket de doble eliminación.',
          'fecha' => '2025-09-20',
          'categoria' => 'esports',
          'etiquetas' => ['torneo', 'competitivo'],
        ],
        [
          'titulo' => 'Evento “Noche de Héroes”: 20 demos jugables por 72 horas',
          'slug' => 'evento-noche-de-heroes',
          'img' => asset('img/noticias/evento_demos.jpg'),
          'resumen' => 'Se podrá probar en exclusiva contenido de lanzamientos 2026.',
          'fecha' => '2025-10-05',
          'categoria' => 'eventos',
          'etiquetas' => ['demos', 'evento', 'indie'],
        ],
      ];

      // Filtro por categoría
      $filtradas = collect($todas_noticias)->when(request('categoria') && request('categoria') !== 'todas', function($c){
        return $c->where('categoria', request('categoria'));
      });

      // Búsqueda simple
      if ($q = trim(request('q',''))) {
        $filtradas = $filtradas->filter(function($n) use ($q) {
          return stristr($n['titulo'], $q) || stristr($n['resumen'], $q);
        });
      }

      // Orden
      $orden = request('orden', 'recientes');
      $filtradas = $filtradas->sortBy(function($n){
        return \Carbon\Carbon::parse($n['fecha'])->timestamp;
      }, SORT_REGULAR, $orden !== 'recientes'); // recientes = desc

      $filtradas = array_values($filtradas->all());

      // Portada destacada + resto
      $destacada = $filtradas[0] ?? null;
      $resto = array_slice($filtradas, 1);
    @endphp

    {{-- ====== Layout: contenido + sidebar ====== --}}
    <div class="layout_noticias">
      <div class="col_contenido">

        {{-- ====== Héroe destacado ====== --}}
        @if($destacada)
          <article class="hero_noticia">
            <a href="{{ url('/noticia/'.$destacada['slug']) }}" class="hero_enlace">
              <div class="hero_media">
                <img src="{{ $destacada['img'] }}" alt="{{ $destacada['titulo'] }}" class="hero_imagen" loading="eager">
                <span class="hero_categoria">{{ $destacada['categoria'] }}</span>
              </div>
              <div class="hero_contenido">
                <h2 class="hero_titulo">{{ $destacada['titulo'] }}</h2>
                <p class="hero_resumen">{{ $destacada['resumen'] }}</p>
                <div class="hero_meta">
                  <time datetime="{{ $destacada['fecha'] }}" class="meta_fecha">
                    {{ \Carbon\Carbon::parse($destacada['fecha'])->translatedFormat('d M Y') }}
                  </time>
                  <div class="meta_tags">
                    @foreach($destacada['etiquetas'] as $tag)
                      <span class="tag">{{ $tag }}</span>
                    @endforeach
                  </div>
                </div>
              </div>
            </a>
          </article>
        @endif

        {{-- ====== Lista / Grilla ====== --}}
        <div class="grilla_noticias">
          @forelse ($resto as $nota)
            <article class="tarjeta_noticia">
              <a href="{{ url('/noticia/'.$nota['slug']) }}" class="tarjeta_enlace" aria-label="Ver {{ $nota['titulo'] }}">
                <div class="tarjeta_media">
                  <img src="{{ $nota['img'] }}" alt="{{ $nota['titulo'] }}" class="imagen_noticia" loading="lazy">
                  <span class="insignia_categoria">{{ $nota['categoria'] }}</span>
                </div>
                <div class="tarjeta_contenido">
                  <h3 class="titulo_noticia">{{ $nota['titulo'] }}</h3>
                  <p class="resumen_noticia">{{ $nota['resumen'] }}</p>
                  <div class="meta_noticia">
                    <time datetime="{{ $nota['fecha'] }}" class="fecha_publicacion">
                      {{ \Carbon\Carbon::parse($nota['fecha'])->translatedFormat('d M Y') }}
                    </time>
                    <div class="etiquetas">
                      @foreach ($nota['etiquetas'] as $tag)
                        <span class="etiqueta">{{ $tag }}</span>
                      @endforeach
                    </div>
                  </div>
                  <span class="leer_mas">Leer más</span>
                </div>
              </a>
            </article>
          @empty
            <div class="estado_vacio">No hay noticias por ahora. Vuelve pronto.</div>
          @endforelse
        </div>

        {{-- Cargar más (UI; cuando tengas BD, reemplaza por paginación) --}}
        @if(count($filtradas) > 3)
          <div class="cargar_mas">
            <button class="btn_cargar_mas" type="button">Cargar más</button>
          </div>
        @endif
      </div>

      {{-- ====== Sidebar: Tendencias / Newsletter ====== --}}
      <aside class="col_sidebar">
        <section class="bloque_tendencias">
          <h2 class="titulo_bloque_sidebar">Tendencias</h2>
          <ul class="lista_tendencias">
            @foreach(array_slice($filtradas,0,4) as $t)
              <li class="item_tendencia">
                <a href="{{ url('/noticia/'.$t['slug']) }}" class="tendencia_enlace">
                  <img src="{{ $t['img'] }}" alt="" class="tendencia_img" loading="lazy">
                  <div class="tendencia_info">
                    <span class="tendencia_cat">{{ $t['categoria'] }}</span>
                    <h3 class="tendencia_titulo">{{ $t['titulo'] }}</h3>
                    <time class="tendencia_fecha" datetime="{{ $t['fecha'] }}">
                      {{ \Carbon\Carbon::parse($t['fecha'])->translatedFormat('d M') }}
                    </time>
                  </div>
                </a>
              </li>
            @endforeach
          </ul>
        </section>

        <section class="bloque_newsletter">
          <h2 class="titulo_bloque_sidebar">Recibe novedades</h2>
          <p class="texto_newsletter">Suscríbete para noticias, eventos y lanzamientos.</p>
          <form class="form_newsletter" action="#" method="POST">
            @csrf
            <label for="email_news" class="sr_only">Correo electrónico</label>
            <input id="email_news" type="email" name="email" placeholder="tu@email.com" class="input_news" required>
            <button class="btn_news" type="submit">Suscribirme</button>
          </form>
        </section>
      </aside>
    </div>
  </div>
</section>
@endsection
