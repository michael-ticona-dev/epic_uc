@extends('app')

@section('titulo', 'Acceder o Crear cuenta | EPIC-UC')

@push('styles')
  @vite('resources/css/principal_login_register.css')
@endpush

@section('contenido')
@php
  // pestaña inicial (?tab=register) o por defecto login
  $tab = request('tab','login') === 'register' ? 'register' : 'login';
@endphp

<section class="auth_wrap">
  <div class="auth_container">
    {{-- Panel Hero / Branding --}}
    <aside class="auth_side">
      <div class="logo_line">
        <img src="{{ asset('logo.svg') }}" alt="EPIC-UC" class="logo_epic" />
        <h1 class="brand_title">EPIC-UC</h1>
      </div>

      <p class="brand_tag">
        Tu universo gamer. Descubre, colecciona y comparte.
      </p>

      <ul class="benefits_list">
        <li>🎮 Catálogo con ofertas y lanzamientos.</li>
        <li>🧡 Lista de deseos sincronizada.</li>
        <li>👥 Amigos, publicaciones y likes.</li>
        <li>🛒 Carrito rápido y seguro.</li>
      </ul>

      <div class="side_footer">
        <small>© {{ date('Y') }} EPIC-UC</small>
      </div>
    </aside>

    {{-- Panel de Formularios (tabs sin Alpine) --}}
    <main class="auth_main" data-initial-tab="{{ $tab }}">
      <div class="tabs_header" role="tablist" aria-label="Cambiar entre iniciar sesión y crear cuenta">
        <button
          class="tab_btn"
          type="button"
          role="tab"
          aria-selected="false"
          aria-controls="panel_login"
          id="tab_login_btn"
          data-tab="login">
          Iniciar sesión
        </button>

        <button
          class="tab_btn"
          type="button"
          role="tab"
          aria-selected="false"
          aria-controls="panel_register"
          id="tab_register_btn"
          data-tab="register">
          Crear cuenta
        </button>
      </div>

      {{-- Alertas de estado/validación globales --}}
      @if (session('status'))
        <div class="alert_info" role="status" aria-live="polite">
          {{ session('status') }}
        </div>
      @endif

      @if ($errors->any())
        <div class="alert_error" role="alert" aria-live="polite">
          <strong>Ups:</strong> revisa los campos marcados.
          <ul class="alert_list">
            @foreach ($errors->all() as $error)
              <li>{{ $error }}</li>
            @endforeach
          </ul>
        </div>
      @endif

      {{-- LOGIN --}}
      <section id="panel_login" class="tab_panel" role="tabpanel" aria-labelledby="tab_login_btn" hidden>
        <form method="POST" action="{{ route('login') }}" class="auth_form" novalidate>
          @csrf

          <div class="field">
            <label class="label" for="login_correo">Correo electrónico</label>
            <input
              id="login_correo"
              class="input @error('email') input_error @enderror"
              type="email"
              name="email"
              value="{{ old('email') }}"
              autocomplete="email"
              required
              placeholder="tucorreo@ejemplo.com">
            @error('email')
              <small class="msg_error">{{ $message }}</small>
            @enderror
          </div>

          <div class="field">
            <label class="label" for="login_contra">Contraseña</label>
            <div class="input_group">
              <input
                id="login_contra"
                class="input @error('password') input_error @enderror"
                type="password"
                name="password"
                autocomplete="current-password"
                required
                placeholder="••••••••">
              <button class="eye_btn" type="button" data-eye="#login_contra" aria-label="Mostrar u ocultar contraseña">🙈</button>
            </div>
            @error('password')
              <small class="msg_error">{{ $message }}</small>
            @enderror
          </div>

          <div class="row_between">
            <label class="check">
              <input type="checkbox" name="remember"> <span>Recordarme</span>
            </label>
            <a href="{{ url('/forgot-password') }}" class="link">¿Olvidaste tu contraseña?</a>

          </div>

          <button class="btn_primary" type="submit">Entrar</button>

          <div class="divider"><span>o</span></div>

          <div class="socials">
            <a class="btn_social" href="{{ url('/auth/google') }}" aria-label="Entrar con Google">
              <img src="{{ asset('icons/google.svg') }}" alt="" width="18" height="18"> Google
            </a>
            <a class="btn_social" href="{{ url('/auth/github') }}" aria-label="Entrar con GitHub">
              <img src="{{ asset('icons/github.svg') }}" alt="" width="18" height="18"> GitHub
            </a>
          </div>

          <p class="hint">
            ¿No tienes cuenta?
            <a href="{{ route('register') }}" class="link js-switch-tab" data-target-tab="register">Créala aquí</a>.
          </p>
        </form>
      </section>

      {{-- REGISTER --}}
      <section id="panel_register" class="tab_panel" role="tabpanel" aria-labelledby="tab_register_btn" hidden>
        <form method="POST" action="{{ route('register') }}" class="auth_form" novalidate>
          @csrf

          <div class="grid2">
            <div class="field">
              <label class="label" for="reg_nombre">Nombre</label>
              <input
                id="reg_nombre"
                class="input @error('name') input_error @enderror"
                type="text"
                name="name"
                value="{{ old('name') }}"
                required
                placeholder="Tu nombre completo">
              @error('name')
                <small class="msg_error">{{ $message }}</small>
              @enderror
            </div>
            <div class="field">
              <label class="label" for="reg_usuario">Usuario (opcional)</label>
              <input
                id="reg_usuario"
                class="input @error('usuario') input_error @enderror"
                type="text"
                name="usuario"
                value="{{ old('usuario') }}"
                placeholder="Tu @usuario">
              @error('usuario')
                <small class="msg_error">{{ $message }}</small>
              @enderror
            </div>
          </div>

          <div class="field">
            <label class="label" for="reg_correo">Correo electrónico</label>
            <input
              id="reg_correo"
              class="input @error('email') input_error @enderror"
              type="email"
              name="email"
              value="{{ old('email') }}"
              required
              autocomplete="email"
              placeholder="tucorreo@ejemplo.com">
            @error('email')
              <small class="msg_error">{{ $message }}</small>
            @enderror
          </div>

          <div class="grid2">
            <div class="field">
              <label class="label" for="reg_pass">Contraseña</label>
              <div class="input_group">
                <input
                  id="reg_pass"
                  class="input @error('password') input_error @enderror"
                  type="password"
                  name="password"
                  required
                  autocomplete="new-password"
                  placeholder="Mínimo 8 caracteres">
                <button class="eye_btn" type="button" data-eye="#reg_pass" aria-label="Mostrar u ocultar contraseña">🙈</button>
              </div>

              {{-- Medidor de fuerza --}}
              <div class="meter" id="meter">
                <span class="m1"></span><span class="m2"></span><span class="m3"></span><span class="m4"></span>
              </div>
              <small class="note">Usa mayúsculas, minúsculas, números y símbolos.</small>

              @error('password')
                <small class="msg_error">{{ $message }}</small>
              @enderror
            </div>

            <div class="field">
              <label class="label" for="reg_pass2">Confirmar contraseña</label>
              <div class="input_group">
                <input
                  id="reg_pass2"
                  class="input"
                  type="password"
                  name="password_confirmation"
                  required
                  autocomplete="new-password"
                  placeholder="Repite tu contraseña">
                <button class="eye_btn" type="button" data-eye="#reg_pass2" aria-label="Mostrar u ocultar contraseña">🙈</button>
              </div>
            </div>
          </div>

          <label class="check">
            <input type="checkbox" name="acepto" required>
            <span>Acepto los <a href="#" class="link">Términos</a> y la <a href="#" class="link">Política de privacidad</a>.</span>
          </label>

          <button class="btn_primary" type="submit">Crear cuenta</button>

          <div class="divider"><span>o</span></div>

          <div class="socials">
            <a class="btn_social" href="{{ url('/auth/google') }}" aria-label="Registrarse con Google">
              <img src="{{ asset('icons/google.svg') }}" alt="" width="18" height="18"> Google
            </a>
            <a class="btn_social" href="{{ url('/auth/github') }}" aria-label="Registrarse con GitHub">
              <img src="{{ asset('icons/github.svg') }}" alt="" width="18" height="18"> GitHub
            </a>
          </div>

          <p class="hint">
            ¿Ya tienes cuenta?
            <a href="{{ route('login') }}" class="link js-switch-tab" data-target-tab="login">Inicia sesión</a>.
          </p>
        </form>
      </section>
    </main>
  </div>
</section>
@endsection

@push('scripts')
<script>
/* -------------------------
   Tabs accesibles (vanilla)
-------------------------- */
(function(){
  const main = document.querySelector('.auth_main');
  if (!main) return;

  const initial = main.getAttribute('data-initial-tab') === 'register' ? 'register' : 'login';
  const btnLogin = document.querySelector('#tab_login_btn');
  const btnReg   = document.querySelector('#tab_register_btn');
  const panelLogin = document.querySelector('#panel_login');
  const panelReg   = document.querySelector('#panel_register');
  const buttons = [btnLogin, btnReg];
  const panels  = { login: panelLogin, register: panelReg };

  function setTab(tab){
    // botones
    buttons.forEach(b=>{
      const active = b.dataset.tab === tab;
      b.classList.toggle('activa', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.tabIndex = active ? 0 : -1;
    });
    // panels
    Object.entries(panels).forEach(([key, el])=>{
      const show = key === tab;
      el.hidden = !show;
    });
    // Enfocar el primer campo visible para UX
    const firstInput = panels[tab].querySelector('input:not([type=hidden])');
    if (firstInput) firstInput.focus({ preventScroll: true });
    // Guardar en history (para refresh conservando pestaña)
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    history.replaceState(null, '', url);
  }

  // Eventos: click y teclado (accesible con flechas)
  buttons.forEach(b=>{
    b.addEventListener('click', ()=> setTab(b.dataset.tab));
    b.addEventListener('keydown', (e)=>{
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = b === btnLogin ? 'register' : 'login';
        setTab(next);
      }
    });
  });

  // Enlaces que cambian de pestaña (por si el usuario hace click en los CTA)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('.js-switch-tab');
    if (!a) return;
    e.preventDefault();
    const target = a.getAttribute('data-target-tab') === 'register' ? 'register' : 'login';
    setTab(target);
  });

  setTab(initial);
})();

/* -------------------------
   Mostrar/ocultar contraseña
-------------------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.eye_btn');
  if (!btn) return;
  const sel = btn.getAttribute('data-eye');
  const input = document.querySelector(sel);
  if (!input) return;
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
  btn.textContent = type === 'password' ? '🙈' : '👀';
});

/* -------------------------
   Medidor fuerza contraseña
-------------------------- */
(function(){
  const pass = document.querySelector('#reg_pass');
  const bars = document.querySelectorAll('#meter span');
  if (!pass || bars.length !== 4) return;

  function score(p) {
    let s = 0;
    if (!p) return 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  }

  pass.addEventListener('input', () => {
    const n = score(pass.value);
    bars.forEach((b,i)=> b.classList.toggle('on', i < n));
  });
})();
</script>
@endpush
