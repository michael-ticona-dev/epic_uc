<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    // ===== Tabla y PK
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    // ===== Timestamps personalizados
    public const CREATED_AT = 'creado_en';
    public const UPDATED_AT = 'actualizado_en';

    // (Si prefieres desactivar timestamps: public $timestamps = false;)

    // ===== Columna remember_token personalizada
    // Eloquent por defecto usa 'remember_token'
    public function getRememberTokenName()
    {
        return 'recordar_token';
    }

    // ===== Campos asignables
    protected $fillable = [
        'nombre',
        'usuario',
        'correo',
        'contrasena',
        'url_avatar',
        // 'recordar_token'  // no suele llenarse manualmente
    ];

    // ===== Campos ocultos en arrays/json
    protected $hidden = [
        'contrasena',
        'recordar_token',
    ];

    // ===== Para que Auth use la columna 'contrasena'
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // ===== Alias opcional: $user->email devolverá 'correo'
    public function getEmailAttribute()
    {
        return $this->correo;
    }
}
