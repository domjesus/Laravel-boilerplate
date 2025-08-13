<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        if ($authUser->hasRole('admin')) {
            $users = User::with(['roles'])->get();
        }

        $roles = Role::all();
        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'array',
            'roles.*' => 'integer|exists:roles,id',
        ]);


        // Handle role assignment
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        // Assign user roles
        if (!empty($roles)) {
            $user->assignRole($roles);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],

            'roles' => 'array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        // Handle role assignment
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $user->update($data);

        // Sync user roles
        if (isset($roles)) {
            $user->syncRoles($roles);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }
}
