@extends('app')

@section('titulo', 'Publicaciones | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_publicaciones.css')
@endpush

@section('contenido')
<section class="pubs">
  <div class="contenedor">

    {{-- CABECERA --}}
    <header class="pubs_head">
      <div class="head_left">
        <h1 class="titulo">Publicaciones</h1>
        <p class="subtitulo">Comparte lo que piensas, añade fotos o videos y conversa con tus amigos.</p>
      </div>
      <div class="head_right">
        <button class="btn btn_primary" id="btn_seed" type="button" title="Sembrar posts demo">Cargar demo</button>
      </div>
    </header>

    {{-- COMPOSITOR --}}
    <article class="composer" aria-label="Crear publicación">
      <div class="composer_row">
        <img class="avatar" src="https://i.pravatar.cc/64?img=5" alt="Tu avatar" />
        <textarea id="cmp_text" class="cmp_input" rows="3" maxlength="800" placeholder="¿Qué estás pensando, gamer?"></textarea>
      </div>

      <div id="cmp_preview" class="cmp_preview oculto" aria-live="polite"></div>

      <div class="composer_actions">
        <label class="chip" title="Adjuntar foto/video">
          <input id="cmp_media" type="file" accept="image/*,video/*" hidden multiple>
          <span class="chip_icon">📎</span> Multimedia
        </label>
        <button id="cmp_clear" class="btn btn_ghost" type="button">Limpiar</button>
        <button id="cmp_publish" class="btn btn_primary" type="button">Publicar</button>
      </div>
    </article>

    {{-- FILTROS / ORDEN (opcionales) --}}
    <div class="feed_controls">
      <div class="chips">
        <button class="filter chip activa" data-filter="all">Todo</button>
        <button class="filter chip" data-filter="images">Imágenes</button>
        <button class="filter chip" data-filter="videos">Videos</button>
        <button class="filter chip" data-filter="text">Sólo texto</button>
      </div>
      <div class="order">
        <label class="order_lbl">Orden:</label>
        <select id="order_sel" class="select">
          <option value="random">Aleatorio</option>
          <option value="new">Más recientes</option>
          <option value="top">Más valorados</option>
        </select>
      </div>
    </div>

    {{-- FEED --}}
    <div id="feed" class="feed" aria-live="polite"></div>

    {{-- LOADER INFINITO --}}
    <div id="infinite_guard" class="infinite_guard" aria-hidden="true">
      <span class="spinner"></span>
    </div>

  </div>
</section>
@endsection

@push('scripts')
<script>
(() => {
  /* ==========================
     UTILIDADES
  ========================== */
  const $ = (s, c=document)=>c.querySelector(s);
  const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));
  const uid = ()=> 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const fmtTime = ts => new Date(ts).toLocaleString();
  const escapeHtml = s => (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  /* ==========================
     STORAGE KEYS
  ========================== */
  const POSTS_KEY = 'epic_uc_posts';
  const getPosts = () => { try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); } catch { return []; } };
  const setPosts = list => localStorage.setItem(POSTS_KEY, JSON.stringify(list));

  /* ==========================
     ESTADO UI
  ========================== */
  const state = {
    pageSize: 6,
    cursor: 0,
    cache: [],      // posts ya filtrados/ordenados
    filter: 'all',
    order: 'random',
    friends: ['Alex', 'Sam', 'Taylor', 'Jordan', 'Chris', 'Diana', 'Pat', 'Noa', 'Kai', 'Val'],
    me: { id: 'me', name: 'Tú', avatar: 'https://i.pravatar.cc/64?img=5' }
  };

  /* ==========================
     SEMILLA DEMO
  ========================== */
  const demoPosts = () => ([
    { id: uid(), author:{name:'Alex', avatar:'https://i.pravatar.cc/64?img=11'}, text:'¡Acabo de platinar Eldoria Chronicles! 🙌', media:[{type:'image', src:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'}], likes:12, comments:[{id:uid(), author:'Sam', text:'Legendario 🔥', ts:Date.now()-7200000}], shares:1, ts: Date.now()-86400000 },
    { id: uid(), author:{name:'Diana', avatar:'https://i.pravatar.cc/64?img=32'}, text:'Probando mi nueva capturadora con Dreamforge 🎥', media:[{type:'video', src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'}], likes:34, comments:[], shares:3, ts: Date.now()-5600000 },
    { id: uid(), author:{name:'Jordan', avatar:'https://i.pravatar.cc/64?img=22'}, text:'Tips para mejorar FPS en Stellar Saga: 1) DLSS Quality 2) Texturas Alta 3) Sombras Medias', media:[], likes:5, comments:[], shares:0, ts: Date.now()-3600000 },
    { id: uid(), author:{name:'Chris', avatar:'https://i.pravatar.cc/64?img=15'}, text:'Foto del clan anoche. GG 💙', media:[{type:'image', src:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'}], likes:19, comments:[{id:uid(),author:'Taylor',text:'¡Qué épico!',ts:Date.now()-1800000}], shares:2, ts: Date.now()-2000000 },
  ]);

  /* ==========================
     COMPOSITOR
  ========================== */
  const cmpText = $('#cmp_text');
  const cmpMedia = $('#cmp_media');
  const cmpPreview = $('#cmp_preview');
  const btnPublish = $('#cmp_publish');
  const btnClear = $('#cmp_clear');
  const btnSeed = $('#btn_seed');

  let pendingFiles = []; // {type:'image'|'video', src: dataURL}

  const renderPreview = () => {
    if (!pendingFiles.length) { cmpPreview.classList.add('oculto'); cmpPreview.innerHTML=''; return; }
    cmpPreview.classList.remove('oculto');
    cmpPreview.innerHTML = pendingFiles.map(m => {
      if (m.type==='image') {
        return `<figure class="prev_item"><img src="${m.src}" alt="Imagen adjunta"/></figure>`;
      } else {
        return `<figure class="prev_item"><video src="${m.src}" controls playsinline></video></figure>`;
      }
    }).join('');
  };

  cmpMedia.addEventListener('change', async (e)=>{
    const files = Array.from(e.target.files||[]);
    for (const f of files) {
      const isImage = f.type.startsWith('image/');
      const isVideo = f.type.startsWith('video/');
      if (!isImage && !isVideo) continue;
      const dataURL = await fileToDataURL(f);
      pendingFiles.push({ type: isImage ? 'image' : 'video', src: dataURL });
    }
    e.target.value = '';
    renderPreview();
  });

  const fileToDataURL = (file) => new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

  btnClear.addEventListener('click', ()=>{
    cmpText.value = '';
    pendingFiles = [];
    renderPreview();
  });

  btnPublish.addEventListener('click', ()=>{
    const text = cmpText.value.trim();
    if (!text && pendingFiles.length===0) return alert('Escribe algo o adjunta multimedia 😉');

    const post = {
      id: uid(),
      author: state.me,
      text,
      media: pendingFiles.map(f=>({type:f.type, src:f.src})),
      likes: 0,
      comments: [],
      shares: 0,
      ts: Date.now()
    };
    const list = getPosts();
    list.unshift(post);
    setPosts(list);

    // reset
    cmpText.value=''; pendingFiles=[]; renderPreview();

    // re-render feed desde 0
    reloadFeed();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  btnSeed.addEventListener('click', ()=>{
    const current = getPosts();
    setPosts([...demoPosts(), ...current]);
    reloadFeed();
  });

  /* ==========================
     FEED + INFINITE SCROLL
  ========================== */
  const feed = $('#feed');
  const guard = $('#infinite_guard');

  const applyFilter = (posts, filter) => {
    switch(filter){
      case 'images': return posts.filter(p => p.media.some(m=>m.type==='image'));
      case 'videos': return posts.filter(p => p.media.some(m=>m.type==='video'));
      case 'text':   return posts.filter(p => !p.media || p.media.length===0);
      default:       return posts;
    }
  };

  const applyOrder = (posts, order) => {
    const arr = [...posts];
    if (order==='new') {
      arr.sort((a,b)=>b.ts - a.ts);
    } else if (order==='top') {
      arr.sort((a,b)=> (b.likes + b.shares*2 + (b.comments?.length||0)) - (a.likes + a.shares*2 + (a.comments?.length||0)));
    } else { // random
      for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    }
    return arr;
  };

  const renderPosts = (slice) => {
    const html = slice.map(p => postCard(p)).join('');
    const temp = document.createElement('div');
    temp.innerHTML = html;
    // bind events post by post
    temp.querySelectorAll('.post').forEach(card=>{
      bindCardEvents(card);
    });
    feed.append(...temp.childNodes);
  };

  const postCard = (p) => {
    const media = (p.media||[]).map(m=>{
      if (m.type==='image') return `<figure class="post_media"><img src="${m.src}" alt="Imagen"/></figure>`;
      return `<figure class="post_media"><video src="${m.src}" controls playsinline></video></figure>`;
    }).join('');

    const commentsHtml = (p.comments||[]).slice(-3).map(c=>(
      `<div class="cmt_item">
        <div class="cmt_head">
          <strong class="cmt_author">${escapeHtml(c.author)}</strong>
          <span class="cmt_time">${fmtTime(c.ts)}</span>
        </div>
        <p class="cmt_text">${escapeHtml(c.text)}</p>
      </div>`
    )).join('');

    return `
    <article class="post" data-id="${p.id}">
      <header class="post_head">
        <img class="avatar" src="${p.author?.avatar||'https://i.pravatar.cc/64?img=1'}" alt="Avatar de ${escapeHtml(p.author?.name||'Usuario')}" />
        <div class="who">
          <h3 class="name">${escapeHtml(p.author?.name||'Usuario')}</h3>
          <span class="time">${fmtTime(p.ts)}</span>
        </div>
        <button class="btn_icon more" title="Más opciones" aria-label="Más opciones">⋯</button>
      </header>

      <div class="post_body">
        ${p.text ? `<p class="post_text">${linkify(escapeHtml(p.text))}</p>` : ''}
        ${media}
      </div>

      <footer class="post_foot">
        <div class="stats">
          <span class="stat like_count">👍 ${p.likes||0}</span>
          <span class="stat cmt_count">💬 ${(p.comments?.length||0)}</span>
          <span class="stat share_count">↗ ${(p.shares||0)}</span>
        </div>
        <div class="actions">
          <button class="btn action like">👍 Me gusta</button>
          <button class="btn action comment">💬 Comentar</button>
          <button class="btn action share">↗ Compartir</button>
        </div>

        <div class="comments oculto">
          <div class="cmt_list">${commentsHtml || '<p class="cmt_empty">Sé el primero en comentar</p>'}</div>
          <div class="cmt_form">
            <input class="cmt_input" type="text" maxlength="300" placeholder="Escribe un comentario..."/>
            <button class="btn btn_primary cmt_send" type="button">Enviar</button>
          </div>
        </div>
      </footer>
    </article>`;
  };

  const linkify = (t) => t
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/#(\w+)/g, '<span class="hash">#$1</span>');

  const bindCardEvents = (card) => {
    const id = card.dataset.id;
    const likeBtn = $('.action.like', card);
    const cmtBtn = $('.action.comment', card);
    const shareBtn = $('.action.share', card);
    const cwrap = $('.comments', card);
    const cInput = $('.cmt_input', card);
    const cSend = $('.cmt_send', card);

    likeBtn.addEventListener('click', ()=> toggleLike(id, card));
    cmtBtn.addEventListener('click', ()=> cwrap.classList.toggle('oculto'));
    shareBtn.addEventListener('click', ()=> sharePost(id));
    cSend.addEventListener('click', ()=> {
      const v = cInput.value.trim();
      if (!v) return;
      addComment(id, v);
      cInput.value='';
      reloadOne(card, id);
    });
    cInput.addEventListener('keydown', (e)=>{ if (e.key==='Enter'){ e.preventDefault(); cSend.click(); }});
  };

  const reloadOne = (card, id) => {
    const list = getPosts();
    const p = list.find(x=>x.id===id);
    if (!p) return;
    const replacement = document.createElement('div');
    replacement.innerHTML = postCard(p);
    const newCard = replacement.firstElementChild;
    bindCardEvents(newCard);
    card.replaceWith(newCard);
  };

  const toggleLike = (id, card) => {
    const list = getPosts();
    const idx = list.findIndex(x=>x.id===id);
    if (idx<0) return;
    // simple: alternar +1/-1 por sesión
    const likedKey = `liked_${id}`;
    const already = sessionStorage.getItem(likedKey)==='1';
    list[idx].likes = Math.max(0, (list[idx].likes||0) + (already ? -1 : 1));
    setPosts(list);
    sessionStorage.setItem(likedKey, already ? '0':'1');
    reloadOne(card, id);
  };

  const addComment = (id, text) => {
    const list = getPosts();
    const idx = list.findIndex(x=>x.id===id);
    if (idx<0) return;
    list[idx].comments = list[idx].comments || [];
    list[idx].comments.push({ id: uid(), author: state.me.name, text, ts: Date.now() });
    setPosts(list);
  };

  const sharePost = (id) => {
    const list = getPosts();
    const p = list.find(x=>x.id===id);
    if (!p) return;

    const who = prompt(`Compartir con: (escribe tu amigo o deja vacío para compartir tú)\nEjemplos: ${state.friends.slice(0,5).join(', ')}`);
    const sharer = (who && who.trim()) || state.me.name;

    const repost = {
      ...p,
      id: uid(),
      author: { name: sharer, avatar: `https://i.pravatar.cc/64?u=${encodeURIComponent(sharer)}` },
      ts: Date.now()
    };
    list.unshift(repost);

    // suma contador share al original
    p.shares = (p.shares||0) + 1;
    setPosts(list);
    reloadFeed(true);
  };

  const computeCache = () => {
    const all = getPosts();
    const f = applyFilter(all, state.filter);
    const o = applyOrder(f, state.order);
    state.cache = o;
  };

  const reloadFeed = (keepScroll=false) => {
    const y = window.scrollY;
    computeCache();
    state.cursor = 0;
    feed.innerHTML = '';
    loadMore();
    if (keepScroll) window.scrollTo(0, y);
  };

  const loadMore = () => {
    const slice = state.cache.slice(state.cursor, state.cursor + state.pageSize);
    if (!slice.length) return;
    state.cursor += slice.length;
    renderPosts(slice);
  };

  // Observer para infinito
  const io = new IntersectionObserver(entries=>{
    for (const e of entries) {
      if (e.isIntersecting) {
        loadMore();
      }
    }
  }, { rootMargin: '600px 0px 600px 0px' });
  io.observe(guard);

  // Controles
  $$('.filter').forEach(b=>{
    b.addEventListener('click', ()=>{
      $$('.filter').forEach(x=>x.classList.remove('activa'));
      b.classList.add('activa');
      state.filter = b.dataset.filter;
      reloadFeed();
    });
  });
  $('#order_sel').addEventListener('change', e=>{
    state.order = e.target.value;
    reloadFeed();
  });

  // Init: si está vacío, siembra 1 vez
  if (getPosts().length===0) setPosts(demoPosts());
  reloadFeed();
})();
</script>
@endpush
