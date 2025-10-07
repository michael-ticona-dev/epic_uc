@extends('app')

@section('titulo', 'Próximos lanzamientos | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_proximos_lanzamientos.css')
@endpush

@section('contenido')
@php
  use Illuminate\Support\Str;
  use Carbon\Carbon;

  /* =========================
     DATOS MOCK (reemplaza con tu BD cuando la tengas)
     ========================= */
  $todos = [
    [
      'titulo' => 'Crónicas del Alba',
      'img' => asset('img/juegos/proximos/alba.jpg'),
      'fecha' => '2025-11-08',
      'etiquetas' => ['rpg', 'fantasia'],
      'slug' => 'cronicas-del-alba',
      'plataformas' => ['PC', 'PS5', 'XSX'],
      'precio' => 199.90,
    ],
    [
      'titulo' => 'Ciudad Sin Sueño',
      'img' => asset('img/juegos/proximos/ciudad.jpg'),
      'fecha' => '2025-12-02',
      'etiquetas' => ['mundo_abierto', 'accion'],
      'slug' => 'ciudad-sin-sueno',
      'plataformas' => ['PC', 'PS5'],
      'precio' => 0.00,
    ],
    [
      'titulo' => 'Operación Nebula',
      'img' => asset('img/juegos/proximos/nebula.jpg'),
      'fecha' => '2026-01-15',
      'etiquetas' => ['shooter', 'futurista'],
      'slug' => 'operacion-nebula',
      'plataformas' => ['PC', 'XSX'],
      'precio' => 159.00,
    ],
    [
      'titulo' => 'Pioneros del Vacío',
      'img' => asset('img/juegos/proximos/void.jpg'),
      'fecha' => '2026-02-04',
      'etiquetas' => ['aventura', 'exploracion'],
      'slug' => 'pioneros-del-vacio',
      'plataformas' => ['PC'],
      'precio' => 129.00,
    ],
    [
      'titulo' => 'Circuito Alfa',
      'img' => asset('img/juegos/proximos/circuito.jpg'),
      'fecha' => '2026-02-22',
      'etiquetas' => ['carreras', 'arcade'],
      'slug' => 'circuito-alfa',
      'plataformas' => ['PC', 'PS5'],
      'precio' => 99.00,
    ],
  ];

  /* =========================
     FILTROS + ORDEN DESDE REQUEST
     ========================= */
  $q        = trim(request('q', ''));
  $mes      = request('mes');           // "01".."12" | null
  $genero   = request('genero');        // string | null
  $orden    = request('orden', 'fecha'); // fecha|titulo|precio_asc|precio_desc
  $pagina   = max(1, (int) request('page', 1));
  $porPagina= 9;

  $filtrados = collect($todos)
    ->when($q !== '', fn($c) => $c->filter(fn($j) => Str::contains(mb_strtolower($j['titulo']), mb_strtolower($q))))
    ->when($mes, fn($c) => $c->filter(fn($j) => Carbon::parse($j['fecha'])->format('m') === $mes))
    ->when($genero, fn($c) => $c->filter(fn($j) => in_array($genero, $j['etiquetas'])));

  $filtrados = match ($orden) {
    'titulo'      => $filtrados->sortBy('titulo', SORT_NATURAL|SORT_FLAG_CASE)->values(),
    'precio_asc'  => $filtrados->sortBy('precio')->values(),
    'precio_desc' => $filtrados->sortByDesc('precio')->values(),
    default       => $filtrados->sortBy(fn($j)=>Carbon::parse($j['fecha']))->values(),
  };

  $total   = $filtrados->count();
  $paginas = (int) ceil(max(1, $total)/$porPagina);
  $desde   = ($pagina-1)*$porPagina;
  $pageSet = $filtrados->slice($desde, $porPagina)->values();

  // Agrupa por mes "Nov 2025", "Dic 2025", etc.
  $agrupados = $pageSet->groupBy(function($j){
    return Carbon::parse($j['fecha'])->translatedFormat('F Y'); // Ej: "noviembre 2025"
  });

  $querySinPage = request()->except('page');
  $qs = fn($p) => http_build_query(array_merge($querySinPage, ['page'=>$p]));
@endphp

<section class="seccion_proximos">
  <div class="contenedor">

    {{-- HERO --}}
    <header class="encabezado_seccion">
      <div class="hero_proximos">
        <div class="hero_copy">
          <h1 class="titulo_seccion">Próximos lanzamientos</h1>
          <p class="subtitulo_seccion">Reserva con anticipación y no te pierdas nada.</p>

          <div class="hero_puntos">
            <div class="punto"><span>✔</span> Recordatorios antes del estreno</div>
            <div class="punto"><span>✔</span> Bonos de reserva seleccionados</div>
            <div class="punto"><span>✔</span> Wishlist sincronizada</div>
          </div>
        </div>

        <div class="hero_media">
          <img src="{{ asset('img/hero/proximos.jpg') }}" alt="Lanzamientos EPIC-UC" loading="lazy">
        </div>
      </div>
    </header>

    {{-- CONTROLES --}}
    <div class="controles_proximos">
      <form method="GET" action="{{ url('/proximos') }}" class="filtros_proximos" autocomplete="off">
        <div class="fila_busqueda">
          <input type="text" name="q" value="{{ $q }}" class="campo_busqueda" placeholder="Buscar próximos lanzamientos…">
          <button type="submit" class="btn_buscar">Buscar</button>
        </div>

        <div class="fila_filtros">
          <div class="grupo">
            <label class="lbl">Mes</label>
            <select name="mes" class="select_campo">
              <option value="">Todos</option>
              @for($m=1;$m<=12;$m++)
                @php $v = str_pad($m,2,'0',STR_PAD_LEFT); @endphp
                <option value="{{ $v }}" {{ $mes===$v?'selected':'' }}>
                  {{ \Carbon\Carbon::createFromDate(null,$m,1)->translatedFormat('F') }}
                </option>
              @endfor
            </select>
          </div>

          <div class="grupo">
            <label class="lbl">Género</label>
            <select name="genero" class="select_campo">
              <option value="">Todos</option>
              @php
                $generos = collect($todos)->pluck('etiquetas')->flatten()->unique()->sort()->values();
              @endphp
              @foreach($generos as $g)
                <option value="{{ $g }}" {{ $genero===$g?'selected':'' }}>{{ $g }}</option>
              @endforeach
            </select>
          </div>

          <div class="grupo">
            <label class="lbl">Ordenar por</label>
            <select name="orden" class="select_campo">
              <option value="fecha" {{ $orden==='fecha'?'selected':'' }}>Fecha (próximo primero)</option>
              <option value="titulo" {{ $orden==='titulo'?'selected':'' }}>Título (A–Z)</option>
              <option value="precio_asc" {{ $orden==='precio_asc'?'selected':'' }}>Precio más bajo</option>
              <option value="precio_desc" {{ $orden==='precio_desc'?'selected':'' }}>Precio más alto</option>
            </select>
          </div>

          <div class="grupo acciones">
            <button class="btn_aplicar" type="submit">Aplicar</button>
            <a href="{{ url('/proximos') }}" class="btn_limpiar">Limpiar</a>
          </div>
        </div>
      </form>

      <div class="resumen_resultados">
        <span class="cuenta">{{ $total }} resultado{{ $total===1?'':'s' }}</span>
        @if($q) <span class="filtro_badge">q: “{{ $q }}”</span> @endif
        @if($mes) <span class="filtro_badge">{{ \Carbon\Carbon::createFromDate(null,(int)$mes,1)->translatedFormat('F') }}</span> @endif
        @if($genero) <span class="filtro_badge">#{{ $genero }}</span> @endif
      </div>
    </div>

    {{-- LISTADO AGRUPADO POR MES --}}
    @forelse($agrupados as $mesTitulo => $items)
      <h2 class="separador_mes">{{ \Illuminate\Support\Str::title($mesTitulo) }}</h2>

      <div class="grilla_lanzamientos">
        @foreach($items as $juego)
          @php
            $fecha = \Carbon\Carbon::parse($juego['fecha']);
            $faltan = $fecha->diffInDays(now(), false);
            $isSoon = $fecha->isFuture() && $fecha->diffInDays(now()) <= 30;
            $gratis = $juego['precio'] <= 0.009;
          @endphp

          <article class="tarjeta_lanzamiento">
            <a class="tarjeta_enlace" href="{{ url('/game/'.$juego['slug']) }}" aria-label="Ver {{ $juego['titulo'] }}">
              <div class="tarjeta_cabecera">
                <div class="tarjeta_imagen">
                  <img src="{{ $juego['img'] }}" alt="{{ $juego['titulo'] }}" loading="lazy">
                </div>

                <div class="tarjeta_badges">
                  <span class="insignia_fecha">
                    {{ $fecha->translatedFormat('d M Y') }}
                  </span>
                  @if($isSoon)
                    <span class="insignia_soon">Muy pronto</span>
                  @endif
                </div>
              </div>

              <div class="tarjeta_cuerpo">
                <h3 class="titulo_lanzamiento">{{ $juego['titulo'] }}</h3>

                <div class="etiquetas">
                  @foreach($juego['etiquetas'] as $tag)
                    <span class="etiqueta">{{ $tag }}</span>
                  @endforeach
                </div>

                <div class="plataformas">
                  @foreach($juego['plataformas'] as $p)
                    <span class="plataforma">{{ $p }}</span>
                  @endforeach
                </div>

                <div class="fila_bajo_titulo">
                  @if($gratis)
                    <span class="precio_gratis">Gratis</span>
                  @else
                    <span class="precio">S/ {{ number_format($juego['precio'], 2) }}</span>
                  @endif

                  <span class="contador"
                        data-fecha="{{ $fecha->toIso8601String() }}"
                        title="Cuenta atrás">
                    <span class="num" data-key="d">00</span>d
                    <span class="num" data-key="h">00</span>h
                    <span class="num" data-key="m">00</span>m
                  </span>
                </div>

                <div class="acciones_tarjeta">
                  <a href="{{ url('/game/'.$juego['slug'].'#reserva') }}" class="btn_reservar">Reservar</a>
                  <a href="{{ url('/game/'.$juego['slug']) }}" class="btn_detalle">Más detalles</a>
                </div>
              </div>
            </a>
          </article>
        @endforeach
      </div>
    @empty
      <div class="estado_vacio">No hay lanzamientos próximos por ahora.</div>
    @endforelse

    {{-- PAGINACIÓN --}}
    @if($paginas > 1)
      <nav class="paginacion" aria-label="paginacion_proximos">
        @for($p=1;$p<=$paginas;$p++)
          <a class="pagina_btn {{ $p===$pagina?'activa':'' }}"
             href="{{ url('/proximos').'?'.$qs($p) }}">{{ $p }}</a>
        @endfor
      </nav>
    @endif

  </div>
</section>

@push('scripts')
<script>
  // Cuenta atrás por tarjeta
  (function(){
    const cards = document.querySelectorAll('.contador[data-fecha]');
    const pad = n => String(n).padStart(2,'0');

    function tick(){
      const now = new Date();
      cards.forEach(c => {
        const target = new Date(c.getAttribute('data-fecha'));
        let diff = Math.max(0, (target - now)/1000|0);
        const d = (diff/86400|0); diff%=86400;
        const h = (diff/3600|0);  diff%=3600;
        const m = (diff/60|0);
        const map = {
          d: c.querySelector('[data-key="d"]'),
          h: c.querySelector('[data-key="h"]'),
          m: c.querySelector('[data-key="m"]'),
        };
        if(map.d) map.d.textContent = pad(d);
        if(map.h) map.h.textContent = pad(h);
        if(map.m) map.m.textContent = pad(m);
      });
    }
    tick();
    setInterval(tick, 30*1000); // cada 30s es suficiente
  })();
</script>
@endpush
@endsection
