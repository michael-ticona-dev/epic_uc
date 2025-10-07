@extends('app')

@section('titulo', 'Ofertas y Descuentos | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_ofertas_descuentos.css')
@endpush

@section('contenido')
@php
  /* =========================
     DATOS MOCK (ejemplo)
     Reemplaza con tu consulta a BD cuando la tengas.
     ========================= */
  $todos_juegos = [
    [
      'titulo' => 'Aventura Épica',
      'img' => asset('img/juegos/aventura.jpg'),
      'precio' => 129.90,
      'descuento' => 0.40, /* 40% */
      'etiquetas' => ['aventura', 'mundo_abierto'],
      'rating' => 4.7,
      'slug' => 'aventura-epica',
    ],
    [
      'titulo' => 'Batalla Futurista',
      'img' => asset('img/juegos/futuro.jpg'),
      'precio' => 89.50,
      'descuento' => 0.25,
      'etiquetas' => ['shooter', 'futurista'],
      'rating' => 4.2,
      'slug' => 'batalla-futurista',
    ],
    [
      'titulo' => 'Reinos Fantásticos',
      'img' => asset('img/juegos/fantasia.jpg'),
      'precio' => 149.00,
      'descuento' => 0.55,
      'etiquetas' => ['rpg', 'fantasia'],
      'rating' => 4.8,
      'slug' => 'reinos-fantasticos',
    ],
    [
      'titulo' => 'Velocidad Total',
      'img' => asset('img/juegos/carreras.jpg'),
      'precio' => 99.00,
      'descuento' => 0.30,
      'etiquetas' => ['carreras', 'arcade'],
      'rating' => 4.1,
      'slug' => 'velocidad-total',
    ],
    [
      'titulo' => 'Estratega Supremo',
      'img' => asset('img/juegos/estrategia.jpg'),
      'precio' => 119.90,
      'descuento' => 0.15,
      'etiquetas' => ['estrategia', 'tactico'],
      'rating' => 4.4,
      'slug' => 'estratega-supremo',
    ],
    [
      'titulo' => 'Horror en la Niebla',
      'img' => asset('img/juegos/terror.jpg'),
      'precio' => 79.90,
      'descuento' => 0.50,
      'etiquetas' => ['terror', 'supervivencia'],
      'rating' => 4.0,
      'slug' => 'horror-niebla',
    ],
    [
      'titulo' => 'Constructor de Mundos',
      'img' => asset('img/juegos/sandbox.jpg'),
      'precio' => 59.90,
      'descuento' => 0.10,
      'etiquetas' => ['sandbox', 'creativo'],
      'rating' => 3.9,
      'slug' => 'constructor-mundos',
    ],
    [
      'titulo' => 'Batalla Royale X',
      'img' => asset('img/juegos/battle.jpg'),
      'precio' => 0.00,
      'descuento' => 0.00,
      'etiquetas' => ['battle_royale', 'shooter'],
      'rating' => 4.3,
      'slug' => 'batalla-royale-x',
    ],
  ];

  $todas_etiquetas = collect($todos_juegos)
    ->pluck('etiquetas')
    ->flatten()
    ->unique()
    ->sort()
    ->values()
    ->all();

  /* =========================
     FILTROS DESDE REQUEST
     ========================= */
  $q        = trim(request('q', ''));
  $tagsSel  = (array) request('tag', []);        // ?tag[]=rpg&tag[]=aventura
  $min      = request('min') !== null ? (float) request('min') : null;
  $max      = request('max') !== null ? (float) request('max') : null;
  $orden    = request('orden', 'mejor_descuento'); // mejor_descuento|precio_mas_bajo|precio_mas_alto|titulo|rating
  $pagina   = max(1, (int) request('page', 1));
  $porPagina= 8;

  /* =========================
     PROCESAMIENTO
     ========================= */
  $filtrados = collect($todos_juegos)
    // buscar por título
    ->when($q !== '', fn($c) => $c->filter(fn($j) => str_contains(mb_strtolower($j['titulo']), mb_strtolower($q))))
    // filtrar por tags (OR)
    ->when(!empty($tagsSel), fn($c) => $c->filter(function($j) use ($tagsSel) {
        return !empty(array_intersect($tagsSel, $j['etiquetas']));
    }))
    // filtrar por rango de precio final
    ->filter(function($j) use ($min, $max) {
      $final = $j['precio'] * (1 - $j['descuento']);
      if ($min !== null && $final < $min) return false;
      if ($max !== null && $final > $max) return false;
      return true;
    });

  // ordenar
  $filtrados = match ($orden) {
    'precio_mas_bajo' => $filtrados->sortBy(fn($j) => $j['precio'] * (1 - $j['descuento']))->values(),
    'precio_mas_alto' => $filtrados->sortByDesc(fn($j) => $j['precio'] * (1 - $j['descuento']))->values(),
    'titulo'          => $filtrados->sortBy('titulo', SORT_NATURAL | SORT_FLAG_CASE)->values(),
    'rating'          => $filtrados->sortByDesc('rating')->values(),
    default           => $filtrados->sortByDesc('descuento')->values(), // mejor descuento
  };

  $total      = $filtrados->count();
  $desde      = ($pagina - 1) * $porPagina;
  $paginas    = (int) ceil(max(1, $total) / $porPagina);
  $ofertas    = $filtrados->slice($desde, $porPagina)->values();

  // Helper para mantener query en paginación
  $querySinPage = request()->except('page');
  $qs = function($page) use ($querySinPage) {
    return http_build_query(array_merge($querySinPage, ['page' => $page]));
  };

  // Fecha/hora para un temporizador (mock: 48h desde ahora)
  $finOfertas = now()->addHours(48);
@endphp

<section class="seccion_ofertas">
  <div class="contenedor">

    {{-- HERO / ENCABEZADO --}}
    <header class="encabezado_seccion">
      <div class="hero_ofertas">
        <div class="hero_textos">
          <h1 class="titulo_seccion">Ofertas y descuentos</h1>
          <p class="subtitulo_seccion">Ahorra en juegos top. ¡Ofertas por tiempo limitado!</p>

          <div class="contador_wrapper" data-fin="{{ $finOfertas->toIso8601String() }}">
            <div class="contador_titulo">Termina en</div>
            <div class="contador">
              <div class="box"><span class="num" data-key="d">00</span><span class="lbl">d</span></div>
              <div class="sep">:</div>
              <div class="box"><span class="num" data-key="h">00</span><span class="lbl">h</span></div>
              <div class="sep">:</div>
              <div class="box"><span class="num" data-key="m">00</span><span class="lbl">m</span></div>
              <div class="sep">:</div>
              <div class="box"><span class="num" data-key="s">00</span><span class="lbl">s</span></div>
            </div>
          </div>
        </div>

        <div class="hero_imagen">
          <img src="{{ asset('img/hero/epic_sale.jpg') }}" alt="Mega ofertas EPIC-UC" loading="lazy">
        </div>
      </div>
    </header>

    {{-- CONTROLES / FILTROS --}}
    <div class="controles_ofertas">
      <form method="GET" action="{{ url('/ofertas') }}" class="filtros_ofertas" autocomplete="off">
        <div class="fila_busqueda">
          <input
            type="text"
            name="q"
            value="{{ $q }}"
            placeholder="Buscar juegos en oferta…"
            class="campo_busqueda"
          />
          <button class="btn_buscar" type="submit">Buscar</button>
        </div>

        <div class="fila_filtros">
          <div class="grupo rango">
            <label class="lbl">Precio final (S/)</label>
            <div class="rango_caja">
              <input type="number" step="0.01" min="0" name="min" value="{{ old('min', $min) }}" placeholder="Mín" class="input_num">
              <span>—</span>
              <input type="number" step="0.01" min="0" name="max" value="{{ old('max', $max) }}" placeholder="Máx" class="input_num">
            </div>
          </div>

          <div class="grupo etiquetas">
            <div class="lbl">Etiquetas</div>
            <div class="chips">
              @foreach ($todas_etiquetas as $t)
                <label class="chip {{ in_array($t, $tagsSel) ? 'activa' : '' }}">
                  <input type="checkbox" name="tag[]" value="{{ $t }}" {{ in_array($t, $tagsSel) ? 'checked' : '' }}>
                  <span>{{ $t }}</span>
                </label>
              @endforeach
            </div>
          </div>

          <div class="grupo ordenar">
            <label class="lbl">Ordenar por</label>
            <select name="orden" class="select_orden">
              <option value="mejor_descuento" {{ $orden==='mejor_descuento'?'selected':'' }}>Mejor descuento</option>
              <option value="precio_mas_bajo" {{ $orden==='precio_mas_bajo'?'selected':'' }}>Precio más bajo</option>
              <option value="precio_mas_alto" {{ $orden==='precio_mas_alto'?'selected':'' }}>Precio más alto</option>
              <option value="titulo" {{ $orden==='titulo'?'selected':'' }}>Título (A–Z)</option>
              <option value="rating" {{ $orden==='rating'?'selected':'' }}>Valoración</option>
            </select>
          </div>

          <div class="grupo acciones">
            <button class="btn_aplicar" type="submit">Aplicar</button>
            <a class="btn_limpiar" href="{{ url('/ofertas') }}">Limpiar</a>
          </div>
        </div>
      </form>

      <div class="resumen_resultados">
        <span class="cuenta">{{ $total }} resultado{{ $total===1?'':'s' }}</span>
        @if($q)
          <span class="filtro_badge">q: “{{ $q }}”</span>
        @endif
        @foreach ($tagsSel as $t)
          <span class="filtro_badge">#{{ $t }}</span>
        @endforeach
        @if(!is_null($min) || !is_null($max))
          <span class="filtro_badge">S/ {{ $min ?? 0 }} — {{ $max ?? '∞' }}</span>
        @endif
      </div>
    </div>

    {{-- GRID DE OFERTAS --}}
    <div class="grilla_juegos">
      @forelse ($ofertas as $juego)
        @php
          $final  = $juego['precio'] * (1 - $juego['descuento']);
          $badge  = $juego['descuento'] > 0 ? '-'.(int) round($juego['descuento'] * 100).'%' : null;
          $gratis = $final <= 0.009;
        @endphp

        <a href="{{ url('/game/'.$juego['slug']) }}" class="tarjeta_juego" aria-label="Ver {{ $juego['titulo'] }}">
          <div class="tarjeta_cabecera">
            <div class="tarjeta_imagen">
              <img src="{{ $juego['img'] }}" alt="{{ $juego['titulo'] }}" loading="lazy">
            </div>
            @if($badge)
              <span class="insignia_descuento">{{ $badge }}</span>
            @endif
          </div>

          <div class="tarjeta_cuerpo">
            <h3 class="titulo_juego">{{ $juego['titulo'] }}</h3>

            <div class="etiquetas">
              @foreach ($juego['etiquetas'] as $tag)
                <span class="etiqueta">{{ $tag }}</span>
              @endforeach
            </div>

            <div class="meta">
              <span class="rating" title="Valoración">{{ number_format($juego['rating'], 1) }} ★</span>
              <span class="chip_timer">Flash</span>
            </div>

            <div class="precio_contenedor">
              <div class="precio_pila">
                @if(!$gratis && $juego['descuento']>0)
                  <span class="precio_original">S/ {{ number_format($juego['precio'], 2) }}</span>
                  <span class="precio_final">S/ {{ number_format($final, 2) }}</span>
                @elseif($gratis)
                  <span class="precio_gratis">Gratis</span>
                @else
                  <span class="precio_unico">S/ {{ number_format($juego['precio'], 2) }}</span>
                @endif
              </div>

              <button class="btn_agregar" type="button">Agregar</button>
            </div>
          </div>
        </a>
      @empty
        <div class="estado_vacio">
          No hay ofertas disponibles con los filtros aplicados.
        </div>
      @endforelse
    </div>

    {{-- PAGINACIÓN --}}
    @if($paginas > 1)
      <nav class="paginacion" aria-label="paginacion_ofertas">
        @for($p = 1; $p <= $paginas; $p++)
          <a class="pagina_btn {{ $p === $pagina ? 'activa' : '' }}"
             href="{{ url('/ofertas').'?'.$qs($p) }}">{{ $p }}</a>
        @endfor
      </nav>
    @endif

  </div>
</section>

@push('scripts')
  <script>
    // Contador simple (sin deps)
    (function(){
      const wrap = document.querySelector('.contador_wrapper');
      if(!wrap) return;
      const fin = new Date(wrap.getAttribute('data-fin'));
      const map = {
        d: wrap.querySelector('[data-key="d"]'),
        h: wrap.querySelector('[data-key="h"]'),
        m: wrap.querySelector('[data-key="m"]'),
        s: wrap.querySelector('[data-key="s"]')
      };
      const pad = n => String(n).padStart(2, '0');
      function tick(){
        const now = new Date();
        let diff = Math.max(0, (fin - now) / 1000 | 0);
        const d = (diff / 86400) | 0; diff %= 86400;
        const h = (diff / 3600) | 0;  diff %= 3600;
        const m = (diff / 60) | 0;    diff %= 60;
        const s = diff | 0;
        if(map.d) map.d.textContent = pad(d);
        if(map.h) map.h.textContent = pad(h);
        if(map.m) map.m.textContent = pad(m);
        if(map.s) map.s.textContent = pad(s);
      }
      tick();
      setInterval(tick, 1000);
    })();
  </script>
@endpush
@endsection
