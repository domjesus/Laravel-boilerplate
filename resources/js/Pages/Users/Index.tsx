import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useToast } from '../../Components/Toast';
import ModernSidebarLayout from '../../Layouts/ModernSidebarLayout';

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    users: User[];
    roles: Role[];
}

export default function UsersIndex({ users, roles }: Props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { addToast } = useToast();

    // Assume the first user in the list is the current user (adjust if you have a better way)
    const currentUser = usePage().props.auth.user as User;
    const isAdmin = currentUser.roles.some((role) => role.name === 'admin');
    const visibleRoles = isAdmin
        ? roles
        : roles.filter((role) => role.name !== 'admin');

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as number[],
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',

        roles: [] as number[],
    });

    const deleteForm = useForm({});

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();

        createForm.post(route('users.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
                addToast({
                    type: 'success',
                    title: 'User created successfully',
                    message: 'The user has been added to your system.',
                });
            },
            onError: () => {
                addToast({
                    type: 'error',
                    title: 'Error creating user',
                    message: 'Please check the form and try again.',
                });
            },
        });
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',

            roles: user.roles.map((role) => role.id),
        });
    };

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingUser) {
            editForm.put(route('users.update', editingUser.id), {
                onSuccess: () => {
                    editForm.reset();
                    setEditingUser(null);
                    addToast({
                        type: 'success',
                        title: 'User updated successfully',
                        message: 'The user information has been saved.',
                    });
                },
                onError: () => {
                    addToast({
                        type: 'error',
                        title: 'Error updating user',
                        message: 'Please check the form and try again.',
                    });
                },
            });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            deleteForm.delete(route('users.destroy', user.id), {
                onSuccess: () => {
                    addToast({
                        type: 'success',
                        title: 'User deleted successfully',
                        message: `${user.name} has been removed.`,
                    });
                },
                onError: () => {
                    addToast({
                        type: 'error',
                        title: 'Error deleting user',
                        message: 'Could not delete the user. Please try again.',
                    });
                },
            });
        }
    };

    return (
        <ModernSidebarLayout>
            <Head title="Users" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Users
                    </h1>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add User
                    </button>
                </div>

                {/* Create Form Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Create User
                            </h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {createForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                    {createForm.errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {createForm.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                    {createForm.errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {createForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            createForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            createForm.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Roles
                                    </label>
                                    <div className="mt-2 max-h-32 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-3 dark:border-gray-600">
                                        {visibleRoles.map((role) => (
                                            <label
                                                key={role.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        editingUser
                                                            ? editForm.data.roles.includes(
                                                                  role.id,
                                                              )
                                                            : createForm.data.roles.includes(
                                                                  role.id,
                                                              )
                                                    }
                                                    onChange={(e) => {
                                                        const currentRoles =
                                                            editingUser
                                                                ? editForm.data
                                                                      .roles
                                                                : createForm
                                                                      .data
                                                                      .roles;
                                                        const newRoles = e
                                                            .target.checked
                                                            ? [
                                                                  ...currentRoles,
                                                                  role.id,
                                                              ]
                                                            : currentRoles.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      role.id,
                                                              );
                                                        if (editingUser) {
                                                            editForm.setData(
                                                                'roles',
                                                                newRoles,
                                                            );
                                                        } else {
                                                            createForm.setData(
                                                                'roles',
                                                                newRoles,
                                                            );
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {role.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {createForm.errors.roles && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {createForm.errors.roles}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {createForm.processing
                                            ? 'Creating...'
                                            : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Form Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Edit User
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                    {editForm.errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editForm.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    {editForm.errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            editForm.data.password_confirmation
                                        }
                                        onChange={(e) =>
                                            editForm.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Roles
                                    </label>
                                    <div className="mt-2 max-h-32 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-3 dark:border-gray-600">
                                        {visibleRoles.map((role) => (
                                            <label
                                                key={role.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.data.roles.includes(
                                                        role.id,
                                                    )}
                                                    onChange={(e) => {
                                                        const currentRoles =
                                                            editForm.data.roles;
                                                        const newRoles = e
                                                            .target.checked
                                                            ? [
                                                                  ...currentRoles,
                                                                  role.id,
                                                              ]
                                                            : currentRoles.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      role.id,
                                                              );
                                                        editForm.setData(
                                                            'roles',
                                                            newRoles,
                                                        );
                                                    }}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {role.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {editForm.errors.roles && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {editForm.errors.roles}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {editForm.processing
                                            ? 'Updating...'
                                            : 'Update'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-gray-400">
                                                        No roles
                                                    </span>
                                                ) : (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </ModernSidebarLayout>
    );
}
