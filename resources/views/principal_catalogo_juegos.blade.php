@extends('app')

@section('titulo', 'Catálogo | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_catalogo_juegos.css')
@endpush

@section('contenido')
@php
  /* ===========================
     DATOS / FILTROS / ORDEN
     =========================== */
  $todos_tags = [
    'RPG','Mundo abierto','Shooter','Battle Royale','Sandbox','Aventura',
    'Fantasía','Futurista','Acción','Indie','Estrategia','Carreras','Survival','Rogue-like',
  ];
  $plataformas = ['PC','PlayStation','Xbox','Switch'];

  // Dataset demo si no viene de controlador
  if (!isset($juegos)) {
    $juegos = [
      ['id'=>1,'slug'=>'eldoria-chronicles','titulo'=>'Eldoria Chronicles','precio'=>149.90,'descuento'=>0.30,'portada'=>asset('covers/eldoria-chronicles.jpg'),'rating'=>4.7,'etiquetas'=>['RPG','Aventura','Fantasía'],'plataforma'=>'PC','fecha'=>'2024-06-14','trailer'=>'https://www.youtube.com/embed/dQw4w9WgXcQ'],
      ['id'=>2,'slug'=>'nexus-outbreak','titulo'=>'Nexus Outbreak','precio'=>199.00,'descuento'=>0.45,'portada'=>asset('covers/nexus-outbreak.jpg'),'rating'=>4.4,'etiquetas'=>['Shooter','Futurista','Acción'],'plataforma'=>'Xbox','fecha'=>'2023-11-02','trailer'=>'https://www.youtube.com/embed/oHg5SJYRHA0'],
      ['id'=>3,'slug'=>'skyline-racers','titulo'=>'Skyline Racers','precio'=>89.50,'descuento'=>0.10,'portada'=>asset('covers/skyline-racers.jpg'),'rating'=>4.1,'etiquetas'=>['Carreras','Arcade'],'plataforma'=>'PlayStation','fecha'=>'2024-03-22','trailer'=>'https://www.youtube.com/embed/jNQXAC9IVRw'],
      ['id'=>4,'slug'=>'myths-of-avalon','titulo'=>'Myths of Avalon','precio'=>0.00,'descuento'=>0.00,'portada'=>asset('covers/myths-of-avalon.jpg'),'rating'=>4.6,'etiquetas'=>['RPG','Fantasía','Mundo abierto'],'plataforma'=>'PC','fecha'=>'2022-10-10','trailer'=>'https://www.youtube.com/embed/aqz-KE-bpKQ'],
      ['id'=>5,'slug'=>'iron-harvests','titulo'=>'Iron Harvests','precio'=>129.90,'descuento'=>0.25,'portada'=>asset('covers/iron-harvests.jpg'),'rating'=>4.2,'etiquetas'=>['Estrategia','Acción'],'plataforma'=>'PC','fecha'=>'2021-07-18','trailer'=>'https://www.youtube.com/embed/2vjPBrBU-TM'],
      ['id'=>6,'slug'=>'stellar-saga','titulo'=>'Stellar Saga','precio'=>179.00,'descuento'=>0.00,'portada'=>asset('covers/stellar-saga.jpg'),'rating'=>4.8,'etiquetas'=>['Futurista','Aventura','Acción'],'plataforma'=>'PlayStation','fecha'=>'2024-09-01','trailer'=>'https://www.youtube.com/embed/3GwjfUFyY6M'],

      ['id'=>7,'slug'=>'voidborn','titulo'=>'Voidborn','precio'=>59.90,'descuento'=>0.15,'portada'=>asset('covers/voidborn.jpg'),'rating'=>4.0,'etiquetas'=>['Survival','Acción'],'plataforma'=>'PC','fecha'=>'2020-12-05','trailer'=>'https://www.youtube.com/embed/eY52Zsg-KVI'],
      ['id'=>8,'slug'=>'ember-sands','titulo'=>'Ember Sands','precio'=>119.00,'descuento'=>0.50,'portada'=>asset('covers/ember-sands.jpg'),'rating'=>4.3,'etiquetas'=>['Sandbox','Aventura'],'plataforma'=>'Xbox','fecha'=>'2023-05-09','trailer'=>'https://www.youtube.com/embed/Zi_XLOBDo_Y'],
      ['id'=>9,'slug'=>'royale-grounds','titulo'=>'Royale Grounds','precio'=>0.00,'descuento'=>0.00,'portada'=>asset('covers/royale-grounds.jpg'),'rating'=>3.9,'etiquetas'=>['Battle Royale','Shooter'],'plataforma'=>'PC','fecha'=>'2022-02-14','trailer'=>'https://www.youtube.com/embed/L_jWHffIx5E'],
      ['id'=>10,'slug'=>'clockwork-odyssey','titulo'=>'Clockwork Odyssey','precio'=>139.00,'descuento'=>0.20,'portada'=>asset('covers/clockwork-odyssey.jpg'),'rating'=>4.5,'etiquetas'=>['Indie','Aventura'],'plataforma'=>'Switch','fecha'=>'2021-09-28','trailer'=>'https://www.youtube.com/embed/kXYiU_JCYtU'],
      ['id'=>11,'slug'=>'arcfall-tactics','titulo'=>'Arcfall Tactics','precio'=>149.00,'descuento'=>0.35,'portada'=>asset('covers/arcfall-tactics.jpg'),'rating'=>4.2,'etiquetas'=>['Estrategia','Rogue-like'],'plataforma'=>'PC','fecha'=>'2024-02-02','trailer'=>'https://www.youtube.com/embed/hTWKbfoikeg'],
      ['id'=>12,'slug'=>'shadow-nebula','titulo'=>'Shadow Nebula','precio'=>189.00,'descuento'=>0.15,'portada'=>asset('covers/shadow-nebula.jpg'),'rating'=>4.6,'etiquetas'=>['Futurista','Shooter'],'plataforma'=>'PlayStation','fecha'=>'2024-01-12','trailer'=>'https://www.youtube.com/embed/60ItHLz5WEA'],
      ['id'=>13,'slug'=>'deepwood','titulo'=>'Deepwood','precio'=>79.00,'descuento'=>0.10,'portada'=>asset('covers/deepwood.jpg'),'rating'=>4.1,'etiquetas'=>['Aventura','Fantasía'],'plataforma'=>'Switch','fecha'=>'2020-03-03','trailer'=>'https://www.youtube.com/embed/CevxZvSJLk8'],
      ['id'=>14,'slug'=>'ashen-realm','titulo'=>'Ashen Realm','precio'=>159.00,'descuento'=>0.40,'portada'=>asset('covers/ashen-realm.jpg'),'rating'=>4.7,'etiquetas'=>['RPG','Acción'],'plataforma'=>'PC','fecha'=>'2024-08-20','trailer'=>'https://www.youtube.com/embed/fJ9rUzIMcZQ'],
      ['id'=>15,'slug'=>'metro-hive','titulo'=>'Metro Hive','precio'=>99.00,'descuento'=>0.05,'portada'=>asset('covers/metro-hive.jpg'),'rating'=>3.8,'etiquetas'=>['Shooter','Futurista'],'plataforma'=>'Xbox','fecha'=>'2019-11-30','trailer'=>'https://www.youtube.com/embed/9bZkp7q19f0'],
      ['id'=>16,'slug'=>'last-frontier','titulo'=>'Last Frontier','precio'=>0.00,'descuento'=>0.00,'portada'=>asset('covers/last-frontier.jpg'),'rating'=>4.0,'etiquetas'=>['Survival','Sandbox'],'plataforma'=>'PC','fecha'=>'2022-06-16','trailer'=>'https://www.youtube.com/embed/tVj0ZTS4WF4'],
      ['id'=>17,'slug'=>'rift-runners','titulo'=>'Rift Runners','precio'=>129.00,'descuento'=>0.30,'portada'=>asset('covers/rift-runners.jpg'),'rating'=>4.4,'etiquetas'=>['Acción','Rogue-like'],'plataforma'=>'PC','fecha'=>'2023-12-10','trailer'=>'https://www.youtube.com/embed/ScNNfyq3d_w'],
      ['id'=>18,'slug'=>'dreamforge','titulo'=>'Dreamforge','precio'=>69.00,'descuento'=>0.00,'portada'=>asset('covers/dreamforge.jpg'),'rating'=>4.9,'etiquetas'=>['Indie','Aventura'],'plataforma'=>'PlayStation','fecha'=>'2024-05-05','trailer'=>'https://www.youtube.com/embed/YQHsXMglC9A'],
      ['id'=>19,'slug'=>'desert-wings','titulo'=>'Desert Wings','precio'=>89.90,'descuento'=>0.20,'portada'=>asset('covers/desert-wings.jpg'),'rating'=>4.2,'etiquetas'=>['Acción','Arcade'],'plataforma'=>'Switch','fecha'=>'2021-04-11','trailer'=>'https://www.youtube.com/embed/OPf0YbXqDm0'],
      ['id'=>20,'slug'=>'glacier-fall','titulo'=>'Glacier Fall','precio'=>119.90,'descuento'=>0.50,'portada'=>asset('covers/glacier-fall.jpg'),'rating'=>4.3,'etiquetas'=>['Aventura','Sandbox'],'plataforma'=>'PC','fecha'=>'2020-10-01','trailer'=>'https://www.youtube.com/embed/JGwWNGJdvx8'],
    ];
  }

  // Parámetros GET
  $q        = trim(request('q', ''));
  $tags_sel = (array) request('tags', []);
  $plat_sel = (array) request('plat', []);
  $min      = request('min');
  $max      = request('max');
  $orden    = request('orden', 'titulo');
  $pagina   = max(1, (int) request('page', 1));
  $por_pagina = 12;

  // Filtrar
  $filtrados = array_filter($juegos, function($g) use ($q,$tags_sel,$plat_sel,$min,$max) {
    $ok = true;
    if ($q !== '') {
      $hay = str_contains(mb_strtolower($g['titulo']), mb_strtolower($q))
          || str_contains(mb_strtolower(implode(' ', $g['etiquetas'])), mb_strtolower($q));
      $ok = $ok && $hay;
    }
    if (!empty($tags_sel)) { $ok = $ok && (count(array_intersect($tags_sel, $g['etiquetas'])) > 0); }
    if (!empty($plat_sel)) { $ok = $ok && in_array($g['plataforma'], $plat_sel); }
    if ($min !== null && $min !== '') { $ok = $ok && (float)$g['precio'] >= (float)$min; }
    if ($max !== null && $max !== '') { $ok = $ok && (float)$g['precio'] <= (float)$max; }
    return $ok;
  });

  // Orden
  usort($filtrados, function($a, $b) use ($orden) {
    return match ($orden) {
      'precio' => ($a['precio'] <=> $b['precio']),
      'rating' => ($b['rating'] <=> $a['rating']),
      'fecha'  => strcmp($b['fecha'], $a['fecha']),
      default  => strcasecmp($a['titulo'], $b['titulo']),
    };
  });

  // Paginación
  $total = count($filtrados);
  $paginas = (int) ceil($total / $por_pagina);
  $offset = ($pagina - 1) * $por_pagina;
  $vista = array_slice($filtrados, $offset, $por_pagina);
  $base_query = request()->query();
@endphp

<section class="catalogo">
  <div class="contenedor">
    {{-- Encabezado --}}
    <div class="encabezado_catalogo">
      <h1 class="titulo_catalogo">Catálogo de juegos</h1>
      <p class="subtitulo_catalogo">
        Explora {{ $total }} resultados @if($q) para “<strong>{{ e($q) }}</strong>” @endif
      </p>
    </div>

    {{-- Cintillo controles --}}
    <form class="cintillo_controles" method="GET" action="{{ url()->current() }}">
      <div class="buscador_caja">
        <span class="buscador_icono" aria-hidden="true">🔎</span>
        <input class="input_buscar" type="search" name="q" value="{{ e($q) }}" placeholder="Buscar por título, etiqueta, género..." autocomplete="off"/>
      </div>

      <div class="fila_controles">
        <div class="bloque_filtros">
          <div class="filtros_titulo">Filtros</div>

          <div class="lista_etiquetas">
            @foreach($todos_tags as $tag)
              @php $activo = in_array($tag, $tags_sel); @endphp
              <label class="boton_etiqueta {{ $activo ? 'activa' : '' }}">
                <input type="checkbox" name="tags[]" value="{{ $tag }}" hidden {{ $activo ? 'checked' : '' }}>
                {{ $tag }}
              </label>
            @endforeach
          </div>

          <div class="lista_etiquetas" style="margin-top: 6px">
            @foreach($plataformas as $pl)
              @php $pact = in_array($pl, $plat_sel); @endphp
              <label class="boton_etiqueta {{ $pact ? 'activa' : '' }}">
                <input type="checkbox" name="plat[]" value="{{ $pl }}" hidden {{ $pact ? 'checked' : '' }}>
                {{ $pl }}
              </label>
            @endforeach
          </div>

          <div class="lista_etiquetas" style="gap:10px; margin-top:8px">
            <input class="boton_etiqueta" style="width:120px" type="number" step="0.01" min="0" name="min" value="{{ e($min) }}" placeholder="Mín S/"/>
            <input class="boton_etiqueta" style="width:120px" type="number" step="0.01" min="0" name="max" value="{{ e($max) }}" placeholder="Máx S/"/>
            <button class="boton_base boton_primario" type="submit">Aplicar</button>
            <a class="boton_base" href="{{ url()->current() }}">Limpiar</a>
          </div>
        </div>

        <div class="ordenar_caja">
          <span class="ordenar_rotulo">Ordenar por:</span>
          <select class="select_orden" name="orden" onchange="this.form.submit()">
            <option value="titulo" {{ $orden==='titulo' ? 'selected' : '' }}>Título (A–Z)</option>
            <option value="precio" {{ $orden==='precio' ? 'selected' : '' }}>Precio</option>
            <option value="rating" {{ $orden==='rating' ? 'selected' : '' }}>Valoración</option>
            <option value="fecha"  {{ $orden==='fecha'  ? 'selected' : '' }}>Fecha de lanzamiento</option>
          </select>
        </div>
      </div>
    </form>

    {{-- Grid --}}
    @if(empty($vista))
      <div class="estado_vacio"><p>No se encontraron juegos con los filtros seleccionados.</p></div>
    @else
      <div class="grilla_juegos">
        @foreach($vista as $g)
          @php
            $t    = $g['titulo'];
            $img  = $g['portada'];
            $tags = $g['etiquetas'];
            $disc = (float) $g['descuento'];
            $p    = (float) $g['precio'];
            $pf   = $disc > 0 ? $p * (1 - $disc) : $p;
          @endphp

          {{-- Tarjeta que abre modal (no navega) --}}
          <a
            href="#"
            class="tarjeta_juego js-open-modal"
            data-id="{{ $g['id'] }}"
            data-slug="{{ $g['slug'] }}"
            data-titulo="{{ $t }}"
            data-img="{{ $img }}"
            data-precio="{{ $p }}"
            data-descuento="{{ $disc }}"
            data-preciofinal="{{ $pf }}"
            data-rating="{{ number_format($g['rating'],1) }}"
            data-plataforma="{{ $g['plataforma'] }}"
            data-fecha="{{ $g['fecha'] }}"
            data-tags='@json($tags)'
            data-trailer="{{ $g['trailer'] ?? '' }}"
            aria-label="{{ $t }}"
          >
            <div class="tarjeta_imagen">
              <img src="{{ $img }}" alt="{{ $t }}" loading="lazy">
              @if($disc > 0)
                <span class="tarjeta_badge_superior">-{{ (int) round($disc*100) }}%</span>
              @elseif($p == 0)
                <span class="tarjeta_badge_superior">Gratis</span>
              @endif
            </div>

            <div class="tarjeta_contenido">
              <h3 class="tarjeta_titulo">{{ $t }}</h3>
              <div class="tarjeta_etiquetas">
                @foreach(array_slice($tags, 0, 3) as $tg)
                  <span class="tag">{{ $tg }}</span>
                @endforeach
              </div>
              <div class="chips_meta">
                <span class="chip_meta">{{ $g['plataforma'] }}</span>
                <span class="chip_meta">Lanzamiento: {{ \Illuminate\Support\Str::of($g['fecha'])->replace('-', '/') }}</span>
              </div>
            </div>

            <div class="tarjeta_pie">
              <div class="grupo_precio">
                @if($disc > 0)
                  <span class="badge_descuento">-{{ (int) round($disc*100) }}%</span>
                  <span class="pila_precio">
                    <span class="precio_original">S/ {{ number_format($p, 2) }}</span>
                    <span class="precio_final">S/ {{ number_format($pf, 2) }}</span>
                  </span>
                @elseif($p > 0)
                  <span class="precio_unico">S/ {{ number_format($p, 2) }}</span>
                @else
                  <span class="precio_unico" style="color:var(--success)">Gratis</span>
                @endif
              </div>

              <span class="rating" title="Valoración">⭐ {{ number_format($g['rating'], 1) }}</span>
            </div>
          </a>
        @endforeach
      </div>

      {{-- Paginación --}}
      @if($paginas > 1)
        <nav class="paginacion" aria-label="paginacion">
          @php
            $prev = max(1, $pagina-1);
            $next = min($paginas, $pagina+1);
            $href = fn($n) => url()->current() . '?' . http_build_query(array_merge($base_query, ['page'=>$n]));
          @endphp

          <a class="pagina_btn" href="{{ $href($prev) }}" aria-label="Anterior">‹</a>
          @for($i=1; $i<=$paginas; $i++)
            <a class="pagina_btn {{ $i===$pagina ? 'activa' : '' }}" href="{{ $href($i) }}">{{ $i }}</a>
          @endfor
          <a class="pagina_btn" href="{{ $href($next) }}" aria-label="Siguiente">›</a>
        </nav>
      @endif
    @endif
  </div>
</section>

{{-- ===================== MODAL JUEGO ===================== --}}
<div id="modal_juego" class="modal oculto" aria-hidden="true" role="dialog" aria-modal="true">
  <div class="modal_backdrop js-close-modal" aria-hidden="true"></div>

  <div class="modal_dialog" role="document">
    <button class="modal_close js-close-modal" aria-label="Cerrar">✕</button>

    <div class="modal_media">
      <img id="mj_img" src="" alt="" class="modal_cover" />
      <iframe id="mj_trailer" class="modal_trailer" src="" title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>

      <div class="media_tabs">
        <button class="tab_media activa" data-target="cover" type="button">Portada</button>
        <button class="tab_media" data-target="trailer" type="button">Trailer</button>
      </div>
    </div>

    <div class="modal_info">
      <h3 id="mj_titulo" class="mj_titulo">—</h3>

      <div class="mj_tags" id="mj_tags"></div>

      <div class="mj_meta">
        <span class="mj_chip" id="mj_plat">—</span>
        <span class="mj_chip" id="mj_fecha">—</span>
        <span class="mj_chip" id="mj_rating">⭐ —</span>
      </div>

      <div class="mj_price" id="mj_price">—</div>

      <div class="mj_actions">
        <button id="mj_add" class="btn_add_cart" type="button">Agregar al carrito</button>

        <a id="mj_detalle" class="btn_detalle_modal" href="#" target="_self">Ver detalles</a>

        <!-- ✅ Nuevo diseño del botón wishlist -->
        <button id="mj_wish" class="btn_wishlist" type="button" aria-pressed="false" title="Añadir a la lista de deseos">
          <svg class="ico_heart" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path class="heart-stroke" d="M19.84 4.61a5.5 5.5 0 0 1 .11 7.78L12 20.25l-7.95-7.86a5.5 5.5 0 1 1 7.78-7.78l.17.17.17-.17a5.5 5.5 0 0 1 7.62 0z"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="heart-fill" d="M12 20.25 4.05 12.39a5.5 5.5 0 1 1 7.78-7.78L12 4.78l.17-.17a5.5 5.5 0 0 1 7.62 0c2.15 2.15 2.16 5.63.11 7.78L12 20.25Z"
                  fill="currentColor" opacity="0"/>
          </svg>
          <span class="lbl">Añadir a la lista de deseos</span>
        </button>
      </div>
    </div>
  </div>
</div>

{{-- ===================== TOAST ===================== --}}
<div id="toast" class="toast oculto" role="status" aria-live="polite"></div>
@endsection

@push('scripts')
<script>
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Carrito (localStorage) ---------- */
  const CART_KEY = 'epic_uc_cart';
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (_) { return []; }
  };
  const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));
  const addToCart = (game) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === game.id);
    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      game.qty = 1;
      cart.push(game);
    }
    setCart(cart);
    syncCartBadge();
    showToast(`Añadido: <b>${escapeHtml(game.titulo)}</b>`);
  };

  const syncCartBadge = () => {
    const cart = getCart();
    const total = cart.reduce((a,i)=>a+(i.qty||1),0);
    // Botón de carrito (clase explícita o fallback por href)
    const btn = document.querySelector('.boton_carrito, .boton_icono.boton_carrito, a.boton_icono[href*="/carrito"]');
    if (!btn) return;
    let badge = btn.querySelector('.insignia_carrito');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'insignia_carrito';
      btn.appendChild(badge);
    }
    badge.textContent = total > 99 ? '99+' : total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
  };

  /* ---------- Wishlist (localStorage) ---------- */
  const WISH_KEY = 'epic_uc_wishlist';
  const getWish = () => {
    try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (_) { return []; }
  };
  const setWish = (items) => localStorage.setItem(WISH_KEY, JSON.stringify(items));
  const inWish = (id) => getWish().some(w => w.id === id);
  const addToWish = (game) => {
    const list = getWish();
    if (!list.some(w => w.id === game.id)) {
      list.push({ id: game.id, slug: game.slug, titulo: game.titulo, img: game.img });
      setWish(list);
      syncWishBadge();
      showToast(`Añadido a deseos: <b>${escapeHtml(game.titulo)}</b>`);
    }
  };
  const removeFromWish = (id) => {
    setWish(getWish().filter(w => w.id !== id));
    syncWishBadge();
  };
  const toggleWish = (game) => {
    if (inWish(game.id)) {
      removeFromWish(game.id);
      showToast(`Quitado de deseos: <b>${escapeHtml(game.titulo)}</b>`);
      return false;
    } else {
      addToWish(game);
      return true;
    }
  };
  const syncWishBadge = () => {
    const total = getWish().length;
    // Botón de deseos (clase explícita o fallback por href)
    const btn = document.querySelector('.boton_wishlist, .boton_icono.boton_wishlist, a.boton_icono[href*="/favoritos"]');
    if (!btn) return;
    let badge = btn.querySelector('.insignia_wishlist');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'insignia_wishlist';
      btn.appendChild(badge);
    }
    badge.textContent = total > 99 ? '99+' : total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
  };

  const escapeHtml = (s) => (s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  /* ---------- Modal ---------- */
  const modal = $('#modal_juego');
  const trailer = $('#mj_trailer');
  const img = $('#mj_img');

  const openModal = (data) => {
    $('#mj_titulo').textContent = data.titulo;
    $('#mj_plat').textContent = data.plataforma;
    $('#mj_fecha').textContent = 'Lanzamiento: ' + data.fecha.replaceAll('-', '/');
    $('#mj_rating').textContent = '⭐ ' + data.rating;
    $('#mj_detalle').href = '/game/' + data.slug;

    // Precio
    const p = parseFloat(data.precio || 0);
    const d = parseFloat(data.descuento || 0);
    const pf = parseFloat(data.preciofinal || p);
    let html = '';
    if (d > 0) {
      html = `<span class="mj_badge">-${Math.round(d*100)}%</span>
              <span class="mj_pila">
                <span class="mj_ori">S/ ${p.toFixed(2)}</span>
                <span class="mj_fin">S/ ${pf.toFixed(2)}</span>
              </span>`;
    } else if (p > 0) {
      html = `<span class="mj_unico">S/ ${p.toFixed(2)}</span>`;
    } else {
      html = `<span class="mj_unico gratis">Gratis</span>`;
    }
    $('#mj_price').innerHTML = html;

    // Tags
    const tagsWrap = $('#mj_tags'); tagsWrap.innerHTML = '';
    (data.tags || []).slice(0,6).forEach(t => {
      const el = document.createElement('span'); el.className='mj_tag'; el.textContent=t; tagsWrap.appendChild(el);
    });

    // Media
    img.src = data.img || '';
    img.alt = data.titulo;
    trailer.src = ''; // evita reproducir viejo
    trailer.dataset.src = data.trailer || '';

    // Acción agregar carrito
    const payload = {
      id: data.id, slug: data.slug, titulo: data.titulo,
      precio: p, descuento: d, preciofinal: pf, img: data.img
    };
    $('#mj_add').onclick = () => addToCart(payload);

    // Wishlist: estado + toggle con UI bella 😍
    const wishBtn = $('#mj_wish');
    const setWishUI = (active) => {
      wishBtn.setAttribute('aria-pressed', String(active));
      wishBtn.classList.toggle('activo', !!active);
      // relleno del corazón
      const fill = wishBtn.querySelector('.heart-fill');
      if (fill) fill.style.opacity = active ? '1' : '0';
      // label
      const lbl = wishBtn.querySelector('.lbl');
      if (lbl) lbl.textContent = active ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos';
    };
    setWishUI(inWish(payload.id));
    wishBtn.onclick = () => setWishUI(toggleWish(payload));

    // Tabs: default portada
    setMediaTab('cover');

    modal.classList.remove('oculto');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('oculto');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    trailer.src = ''; // cortar reproducción
  };

  const setMediaTab = (target) => {
    const coverOn = target === 'cover';
    img.style.display = coverOn ? 'block' : 'none';
    trailer.style.display = coverOn ? 'none' : 'block';
    $$('.tab_media').forEach(b=>{
      b.classList.toggle('activa', b.dataset.target === target);
    });
    if (!coverOn && trailer.dataset.src && trailer.src !== trailer.dataset.src) {
      trailer.src = trailer.dataset.src; // set src solo al ver trailer
    }
  };

  // Open listeners
  $$('.js-open-modal').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const data = {
        id: parseInt(a.dataset.id),
        slug: a.dataset.slug,
        titulo: a.dataset.titulo,
        img: a.dataset.img,
        precio: a.dataset.precio,
        descuento: a.dataset.descuento,
        preciofinal: a.dataset.preciofinal,
        rating: a.dataset.rating,
        plataforma: a.dataset.plataforma,
        fecha: a.dataset.fecha,
        tags: JSON.parse(a.dataset.tags || '[]'),
        trailer: a.dataset.trailer || ''
      };
      openModal(data);
    });
  });

  // Close listeners
  $$('.js-close-modal').forEach(el=>el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape' && !modal.classList.contains('oculto')) closeModal(); });

  // Tabs media
  $$('.tab_media').forEach(b=>{
    b.addEventListener('click', ()=> setMediaTab(b.dataset.target));
  });

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer = null;
  const showToast = (html) => {
    toast.innerHTML = html;
    toast.classList.remove('oculto');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.add('oculto'), 2200);
  };

  // Inicializar contadores
  syncCartBadge();
  syncWishBadge();
})();
</script>
@endpush
