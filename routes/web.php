<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;

/*
|--------------------------------------------------------------------------
| PÁGINAS PRINCIPALES
|--------------------------------------------------------------------------
*/
Route::view('/', 'principal_inicio')->name('inicio');
Route::view('/catalogo', 'principal_catalogo_juegos')->name('catalogo');
Route::view('/ofertas', 'principal_ofertas_descuentos')->name('ofertas');
Route::view('/proximos', 'principal_proximos_lanzamientos')->name('proximos');
Route::view('/noticias', 'principal_noticias')->name('noticias');
Route::view('/carrito', 'principal_carrito')->name('carrito');
Route::view('/favoritos', 'principal_favoritos')->name('favoritos');
Route::view('/publicaciones', 'principal_publicaciones')->name('publicaciones');

/*
|--------------------------------------------------------------------------
| AUTH – Login / Register / Logout (custom con tabla `usuarios`)
| Vista: resources/views/principal_login_register.blade.php
| Modelo: App\Models\Usuario (mapea a tabla `usuarios`)
|--------------------------------------------------------------------------
*/

// Vista combinada Login/Register (tabs)
Route::get('/login', fn () => view('principal_login_register', ['tab' => 'login']))
    ->name('login')->middleware('guest');

Route::get('/register', fn () => view('principal_login_register', ['tab' => 'register']))
    ->name('register')->middleware('guest');

// Procesar LOGIN
Route::post('/login', function (Request $request) {
    $data = $request->validate([
        'email'    => ['required','email'],
        'password' => ['required','min:6'],
    ]);

    /** @var \App\Models\Usuario|null $usuario */
    $usuario = Usuario::where('correo', $data['email'])->first();

    if (! $usuario || ! Hash::check($data['password'], $usuario->contrasena)) {
        return back()
            ->withErrors(['email' => 'Credenciales inválidas.'])
            ->withInput($request->only('email'));
    }

    Auth::login($usuario, $request->boolean('remember'));
    return redirect()->intended(route('inicio'));
})->middleware('guest');

// Procesar REGISTER
Route::post('/register', function (Request $request) {
    $data = $request->validate([
        'name'                  => ['required','string','max:120'],
        'usuario'               => ['nullable','string','max:60','unique:usuarios,usuario'],
        'email'                 => ['required','email','max:190','unique:usuarios,correo'],
        'password'              => ['required','string','min:8','confirmed'],
        'acepto'                => ['accepted'],
    ], [
        'acepto.accepted' => 'Debes aceptar los términos y la privacidad.',
    ]);

    /** @var \App\Models\Usuario $usuario */
    $usuario = Usuario::create([
        'nombre'     => $data['name'],
        'usuario'    => $data['usuario'] ?? null,
        'correo'     => $data['email'],
        'contrasena' => Hash::make($data['password']),
        'url_avatar' => null,
    ]);

    Auth::login($usuario);
    return redirect()->intended(route('inicio'));
})->middleware('guest');

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect()->route('inicio');
})->name('logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| VISTAS DE PERFIL / CONFIG (placeholders)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::view('/perfil', 'perfil')->name('perfil');
    // 👇 nombre de ruta alineado con tu Blade: route('configuracion')
    Route::view('/configuracion', 'configuracion')->name('configuracion');
});

/*
|--------------------------------------------------------------------------
| OAuth (stubs opcionales; elimina si usas Socialite)
|--------------------------------------------------------------------------
*/
Route::get('/auth/google', fn () => abort(501, 'OAuth Google no configurado.'));
Route::get('/auth/github', fn () => abort(501, 'OAuth GitHub no configurado.'));
