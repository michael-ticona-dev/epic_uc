@extends('app')

@section('titulo', 'Favoritos | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_catalogo_juegos.css')
  <style>
    .fav_grid{ display:grid; grid-template-columns:repeat(12,1fr); gap: var(--spacing-5); margin-top: var(--spacing-6); }
    .fav_card{ grid-column: span 3; border:1px solid var(--border); border-radius: var(--radius-3xl); background: var(--surface); overflow: hidden; }
    .fav_img{ aspect-ratio:16/9; width:100%; object-fit:cover; display:block; background: var(--surface-2); }
    .fav_body{ padding: var(--spacing-4); display:grid; gap: var(--spacing-3); }
    .fav_title{ font-weight:900; }
    .fav_actions{ display:flex; gap: var(--spacing-2); }
    .btn_sm{ padding:8px 12px; border-radius: var(--radius-xl); border:1px solid var(--border); background: var(--surface-2); color:var(--text); font-weight:800; text-decoration:none; }
    .btn_sm.primary{ background: var(--primary); color: var(--text-inverse); border-color: var(--primary); }
    @media (max-width: 1280px){ .fav_card{ grid-column: span 4; } }
    @media (max-width: 900px){ .fav_card{ grid-column: span 6; } }
    @media (max-width: 640px){ .fav_card{ grid-column: span 12; } }
  </style>
@endpush

@section('contenido')
<section class="catalogo">
  <div class="contenedor">
    <div class="encabezado_catalogo">
      <h1 class="titulo_catalogo">Mi lista de deseos</h1>
      <p class="subtitulo_catalogo">Aquí verás los juegos que agregaste a favoritos.</p>
    </div>

    <div id="fav_container" class="fav_grid"></div>
    <div id="fav_empty" class="estado_vacio" style="display:none;"><p>No tienes juegos en tu lista de deseos.</p></div>
  </div>
</section>
@endsection

@push('scripts')
<script>
(() => {
  const $ = (s, c=document)=>c.querySelector(s);
  const cont = $('#fav_container');
  const empty = $('#fav_empty');

  const WISH_KEY = 'epic_uc_wishlist';
  const getWish = () => { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (_) { return []; } };
  const setWish = (items) => localStorage.setItem(WISH_KEY, JSON.stringify(items));

  const render = () => {
    const items = getWish();
    cont.innerHTML = '';
    if (!items.length){
      empty.style.display='grid';
      return;
    }
    empty.style.display='none';
    items.forEach(g=>{
      const card = document.createElement('article');
      card.className = 'fav_card';
      card.innerHTML = `
        <img class="fav_img" src="${g.img||''}" alt="${g.titulo||''}">
        <div class="fav_body">
          <h3 class="fav_title">${g.titulo||''}</h3>
          <div class="fav_actions">
            <a class="btn_sm" href="/game/${g.slug}">Ver detalles</a>
            <button class="btn_sm primary" type="button">Agregar al carrito</button>
            <button class="btn_sm" data-remove="${g.id}" type="button">Quitar</button>
          </div>
        </div>`;
      cont.appendChild(card);
    });

    // Quitar
    cont.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = parseInt(btn.getAttribute('data-remove'));
        const next = getWish().filter(w => w.id !== id);
        setWish(next);
        render();

        // refrescar insignia del header si existe
        const hdrBtn = document.querySelector('.boton_wishlist');
        if (hdrBtn){
          let badge = hdrBtn.querySelector('.insignia_wishlist');
          if (!badge){ badge = document.createElement('span'); badge.className='insignia_wishlist'; hdrBtn.appendChild(badge); }
          badge.textContent = next.length > 99 ? '99+' : String(next.length);
          badge.style.display = next.length > 0 ? 'inline-flex' : 'none';
        }
      });
    });
  };

  render();
})();
</script>
@endpush
