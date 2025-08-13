<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->hasRole('admin');
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ];
    }
}
