@extends('app')

@section('titulo', 'Carrito | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_carrito.css')
@endpush

@section('contenido')
<section class="carrito">
  <div class="contenedor">
    <header class="encabezado_carrito">
      <h1 class="titulo_carrito">Tu carrito</h1>
      <p class="sub_carrito">Revisa tus juegos antes de pagar.</p>
    </header>

    <div class="layout_carrito">
      {{-- LISTA DE ITEMS --}}
      <div class="panel panel_items">
        <div id="carrito_vacio" class="estado_vacio u-oculto">
          <div class="emoji">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Explora el catálogo y agrega tus juegos favoritos.</p>
          <a href="{{ route('catalogo') }}" class="btn_primario">Ir al catálogo</a>
        </div>

        <ul id="lista_items" class="lista_items"></ul>

        <div id="barra_acciones" class="barra_acciones u-oculto">
          <button id="btn_vaciar" class="btn_texto peligro">Vaciar carrito</button>
          <div class="hint">Tip: puedes cambiar cantidades o eliminar juegos individuales.</div>
        </div>
      </div>

      {{-- RESUMEN / CHECKOUT --}}
      <aside class="panel panel_resumen">
        <div class="cupon_box">
          <label for="inp_cupon">Cupón</label>
          <div class="cupon_row">
            <input id="inp_cupon" type="text" placeholder="EPIC10, BLACKFRIDAY, ..." />
            <button id="btn_cupon" class="btn_neutro">Aplicar</button>
          </div>
          <small class="cupon_hint">Algunos cupones no son acumulables con ofertas activas.</small>
        </div>

        <div class="resumen">
          <div class="fila"><span>Subtotal</span><span id="r_subtotal">S/ 0.00</span></div>
          <div class="fila"><span>Descuentos</span><span id="r_descuentos" class="negativo">– S/ 0.00</span></div>
          <div class="fila"><span>Impuestos (18%)</span><span id="r_impuestos">S/ 0.00</span></div>
          <div class="fila total"><span>Total</span><span id="r_total">S/ 0.00</span></div>
        </div>

        <div class="acciones_checkout">
          <a href="{{ route('catalogo') }}" class="btn_outlined">Seguir comprando</a>
          <button id="btn_checkout" class="btn_primario grande">Ir a pagar</button>
          <small class="seguro_text">Pago seguro • Descarga digital inmediata</small>
        </div>

        <div class="mini_info">
          <div class="punto">Juegos digitales, sin coste de envío.</div>
          <div class="punto">Reembolso dentro de 14 días si no has jugado +2h.</div>
        </div>
      </aside>
    </div>
  </div>
</section>

{{-- Toast global --}}
<div id="toast" class="toast u-oculto" role="status" aria-live="polite"></div>
@endsection

@push('scripts')
<script>
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  /* ============== Storage ============== */
  const KEY = 'epic_uc_cart';
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(_) { return []; }
  };
  const setCart = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  /* ============== Estado UI ============== */
  const lista = $('#lista_items');
  const vacio = $('#carrito_vacio');
  const barraAcc = $('#barra_acciones');

  const fmt = (n) => 'S/ ' + (Number(n||0)).toFixed(2);

  const syncCartBadge = () => {
    const totalQty = getCart().reduce((a,i)=>a+(i.qty||1),0);
    const btn = document.querySelector('.boton_carrito, .boton_icono.boton_carrito');
    if (!btn) return;
    let b = btn.querySelector('.insignia_carrito');
    if (!b) {
      b = document.createElement('span');
      b.className = 'insignia_carrito';
      btn.appendChild(b);
    }
    b.textContent = totalQty > 99 ? '99+' : totalQty;
    b.style.display = totalQty > 0 ? 'inline-flex' : 'none';
  };

  /* ============== Render ============== */
  const render = () => {
    const cart = getCart();
    lista.innerHTML = '';
    if (cart.length === 0) {
      vacio.classList.remove('u-oculto');
      barraAcc.classList.add('u-oculto');
      updateSummary();
      syncCartBadge();
      return;
    }
    vacio.classList.add('u-oculto');
    barraAcc.classList.remove('u-oculto');

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item';

      const price = item.descuento > 0 ? item.preciofinal : item.precio;

      li.innerHTML = `
        <div class="i_media">
          <img src="${item.img || ''}" alt="${escapeHtml(item.titulo || '')}" loading="lazy">
        </div>
        <div class="i_info">
          <div class="i_top">
            <h3 class="i_titulo">${escapeHtml(item.titulo || 'Juego')}</h3>
            <button class="btn_icono i_remove" title="Eliminar" aria-label="Eliminar">✕</button>
          </div>

          <div class="i_tags">
            ${item.descuento > 0 ? `<span class="chip verde">-${Math.round(item.descuento*100)}%</span>` : ''}
            ${item.descuento > 0 ? `<span class="chip tachado">${fmt(item.precio)}</span>` : ''}
            <span class="chip">${escapeHtml(item.slug || '')}</span>
            <span class="chip">${escapeHtml(item.plataforma || '')}</span>
          </div>

          <div class="i_row">
            <div class="qty_group" role="group" aria-label="Cantidad">
              <button class="qty_btn menos" aria-label="Disminuir">–</button>
              <input class="qty_inp" type="number" min="1" step="1" value="${item.qty || 1}" aria-label="Cantidad actual">
              <button class="qty_btn mas" aria-label="Aumentar">+</button>
            </div>

            <div class="i_precios">
              <div class="precio_final">${fmt(price)}</div>
              <div class="precio_unit">${fmt(price)} <span>/ unidad</span></div>
            </div>
          </div>
        </div>
      `;

      // Eventos item
      li.querySelector('.i_remove').addEventListener('click', () => {
        removeItem(item.id);
      });
      li.querySelector('.qty_btn.menos').addEventListener('click', () => {
        setQty(item.id, Math.max(1, (item.qty||1)-1));
      });
      li.querySelector('.qty_btn.mas').addEventListener('click', () => {
        setQty(item.id, (item.qty||1)+1);
      });
      li.querySelector('.qty_inp').addEventListener('change', (e) => {
        const v = Math.max(1, parseInt(e.target.value||1));
        setQty(item.id, v);
      });

      lista.appendChild(li);
    });

    updateSummary();
    syncCartBadge();
  };

  /* ============== Operaciones ============== */
  const removeItem = (id) => {
    const cart = getCart().filter(i => i.id !== id);
    setCart(cart);
    showToast('Juego eliminado del carrito');
    render();
  };

  const setQty = (id, qty) => {
    const cart = getCart();
    const i = cart.findIndex(x=>x.id===id);
    if (i>=0) {
      cart[i].qty = qty;
      setCart(cart);
      render();
    }
  };

  $('#btn_vaciar').addEventListener('click', () => {
    if (confirm('¿Vaciar todo el carrito?')) {
      setCart([]);
      render();
    }
  });

  /* ============== Cupones / Totales ============== */
  let cuponActivo = null;

  const calcularTotales = () => {
    const cart = getCart();

    let subtotal = 0;
    let descuentos = 0;

    cart.forEach(i => {
      const qty = i.qty || 1;
      const p = Number(i.precio || 0);
      const d = Number(i.descuento || 0);
      if (d > 0) {
        const pf = Number(i.preciofinal || (p*(1-d)));
        subtotal += pf * qty;
        descuentos += (p - pf) * qty;
      } else {
        subtotal += p * qty;
      }
    });

    // cupón
    if (cuponActivo) {
      if (cuponActivo.tipo === 'porcentaje') {
        const cut = subtotal * cuponActivo.valor;
        descuentos += cut;
        subtotal -= cut;
      } else if (cuponActivo.tipo === 'fijo') {
        const cut = Math.min(subtotal, cuponActivo.valor);
        descuentos += cut;
        subtotal -= cut;
      }
    }

    const impuestos = subtotal * 0.18;
    const total = subtotal + impuestos;

    return { subtotal, descuentos, impuestos, total };
  };

  const updateSummary = () => {
    const {subtotal, descuentos, impuestos, total} = calcularTotales();
    $('#r_subtotal').textContent  = fmt(subtotal);
    $('#r_descuentos').textContent= descuentos>0 ? '– ' + fmt(descuentos) : fmt(0);
    $('#r_impuestos').textContent = fmt(impuestos);
    $('#r_total').textContent     = fmt(total);
  };

  const cupones = {
    'EPIC10':       { tipo:'porcentaje', valor: 0.10, label:'-10% en el subtotal' },
    'BLACKFRIDAY':  { tipo:'porcentaje', valor: 0.25, label:'-25% en el subtotal' },
    'MEGA20':       { tipo:'fijo',       valor: 20.00, label:'-S/ 20.00 directo' },
  };

  $('#btn_cupon').addEventListener('click', () => {
    const code = ($('#inp_cupon').value || '').trim().toUpperCase();
    if (!code) { showToast('Ingresa un cupón'); return; }
    if (!cupones[code]) { showToast('Cupón inválido'); return; }
    cuponActivo = cupones[code];
    showToast(`Cupón aplicado: <b>${code}</b> (${cuponActivo.label})`);
    updateSummary();
  });

  /* ============== Checkout ============== */
  $('#btn_checkout').addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) { showToast('Tu carrito está vacío'); return; }
    // Aquí iría tu lógica real de pago (ruta/SDK). De momento:
    alert('Simulando checkout… ¡Listo para integrar tu pasarela!');
  });

  /* ============== Toast ============== */
  const toast = $('#toast');
  let tTimer = null;
  const showToast = (html) => {
    toast.innerHTML = html;
    toast.classList.remove('u-oculto');
    clearTimeout(tTimer);
    tTimer = setTimeout(()=> toast.classList.add('u-oculto'), 2200);
  };

  const escapeHtml = (s) => (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // INIT
  render();
})();
</script>
@endpush
