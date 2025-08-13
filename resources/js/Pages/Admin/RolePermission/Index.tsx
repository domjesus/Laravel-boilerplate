import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputLabel from '../../../Components/InputLabel';
import Modal from '../../../Components/Modal';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import TextInput from '../../../Components/TextInput';
import { useToast } from '../../../Components/Toast';
import ModernSidebarLayout from '../../../Layouts/ModernSidebarLayout';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    company_id: number;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface Props {
    roles: Role[];
    permissions: Permission[];
    users: User[];
    flash?: { success?: string; error?: string };
}

export default function Index({ roles, permissions, users, flash }: Props) {
    const { addToast } = useToast();

    // State for modals and forms
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [showCreatePermissionModal, setShowCreatePermissionModal] =
        useState(false);
    const [showUserRoleModal, setShowUserRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Forms
    const createRoleForm = useForm({
        name: '',
        permissions: [] as number[],
    });

    const editRoleForm = useForm({
        name: '',
        permissions: [] as number[],
    });

    const createPermissionForm = useForm({
        name: '',
    });

    const userRoleForm = useForm({
        role_id: '',
    });

    const deleteRoleForm = useForm({});
    const deletePermissionForm = useForm({});

    // Role handlers
    const handleCreateRole: FormEventHandler = (e) => {
        e.preventDefault();
        createRoleForm.post(route('admin.roles.store'), {
            onSuccess: () => {
                createRoleForm.reset();
                setShowCreateRoleModal(false);
                addToast({
                    type: 'success',
                    title: 'Role created',
                    message: 'The role has been created successfully.',
                });
            },
            onError: () => {
                addToast({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to create role. Please try again.',
                });
            },
        });
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        editRoleForm.setData({
            name: role.name,
            permissions: role.permissions.map((p) => p.id),
        });
        setShowEditRoleModal(true);
    };

    const handleUpdateRole: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingRole) return;

        editRoleForm.put(route('admin.roles.update', editingRole.id), {
            onSuccess: () => {
                editRoleForm.reset();
                setEditingRole(null);
                setShowEditRoleModal(false);
                addToast({
                    type: 'success',
                    title: 'Role updated',
                    message: 'The role has been updated successfully.',
                });
            },
            onError: () => {
                addToast({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update role. Please try again.',
                });
            },
        });
    };

    const handleDeleteRole = (role: Role) => {
        if (
            confirm(`Are you sure you want to delete the "${role.name}" role?`)
        ) {
            deleteRoleForm.delete(route('admin.roles.destroy', role.id), {
                onSuccess: () => {
                    addToast({
                        type: 'success',
                        title: 'Role deleted',
                        message: 'The role has been deleted successfully.',
                    });
                },
                onError: () => {
                    addToast({
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete role. Please try again.',
                    });
                },
            });
        }
    };

    // Permission handlers
    const handleCreatePermission: FormEventHandler = (e) => {
        e.preventDefault();
        createPermissionForm.post(route('admin.permissions.store'), {
            onSuccess: () => {
                createPermissionForm.reset();
                setShowCreatePermissionModal(false);
                addToast({
                    type: 'success',
                    title: 'Permission created',
                    message: 'The permission has been created successfully.',
                });
            },
            onError: () => {
                addToast({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to create permission. Please try again.',
                });
            },
        });
    };

    const handleDeletePermission = (permission: Permission) => {
        if (
            confirm(
                `Are you sure you want to delete the "${permission.name}" permission?`,
            )
        ) {
            deletePermissionForm.delete(
                route('admin.permissions.destroy', permission.id),
                {
                    onSuccess: () => {
                        addToast({
                            type: 'success',
                            title: 'Permission deleted',
                            message:
                                'The permission has been deleted successfully.',
                        });
                    },
                    onError: () => {
                        addToast({
                            type: 'error',
                            title: 'Error',
                            message:
                                'Failed to delete permission. Please try again.',
                        });
                    },
                },
            );
        }
    };

    const handlePermissionToggle = (
        permissionId: number,
        form: typeof createRoleForm | typeof editRoleForm,
    ) => {
        const currentPermissions = form.data.permissions;
        const newPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter((id) => id !== permissionId)
            : [...currentPermissions, permissionId];

        form.setData({
            ...form.data,
            permissions: newPermissions,
        });
    };

    // User role management handlers
    const handleAssignRole = (user: User) => {
        setSelectedUser(user);
        userRoleForm.reset();
        setShowUserRoleModal(true);
    };

    const handleAssignUserRole: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        userRoleForm.post(route('admin.users.assign_role', selectedUser.id), {
            onSuccess: () => {
                userRoleForm.reset();
                setSelectedUser(null);
                setShowUserRoleModal(false);
                addToast({
                    type: 'success',
                    title: 'Role assigned',
                    message:
                        'The role has been assigned to the user successfully.',
                });
            },
            onError: () => {
                addToast({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to assign role. Please try again.',
                });
            },
        });
    };

    const handleRemoveUserRole = (user: User, role: Role) => {
        if (confirm(`Remove "${role.name}" role from ${user.name}?`)) {
            deleteRoleForm.delete(
                route('admin.users.remove_role', [user.id, role.id]),
                {
                    onSuccess: () => {
                        addToast({
                            type: 'success',
                            title: 'Role removed',
                            message: 'The role has been removed from the user.',
                        });
                    },
                    onError: () => {
                        addToast({
                            type: 'error',
                            title: 'Error',
                            message: 'Failed to remove role. Please try again.',
                        });
                    },
                },
            );
        }
    };

    return (
        <ModernSidebarLayout>
            <Head title="Roles & Permissions" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Roles & Permissions Management
                    </h1>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <p className="text-green-800 dark:text-green-200">
                            {flash.success}
                        </p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-red-800 dark:text-red-200">
                            {flash.error}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Roles Section */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Roles ({roles.length})
                            </h2>
                            <button
                                onClick={() => setShowCreateRoleModal(true)}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Add Role
                            </button>
                        </div>

                        <div className="space-y-4">
                            {roles.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    No roles created yet.
                                </p>
                            ) : (
                                roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {role.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {role.permissions.length}{' '}
                                                    permission(s):{' '}
                                                    {role.permissions.length > 0
                                                        ? role.permissions
                                                              .map(
                                                                  (p) => p.name,
                                                              )
                                                              .join(', ')
                                                        : 'No permissions assigned'}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    Created:{' '}
                                                    {new Date(
                                                        role.created_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditRole(role)
                                                    }
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteRole(role)
                                                    }
                                                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Permissions ({permissions.length})
                            </h2>
                            <button
                                onClick={() =>
                                    setShowCreatePermissionModal(true)
                                }
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add Permission
                            </button>
                        </div>

                        <div className="space-y-2">
                            {permissions.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    No permissions created yet.
                                </p>
                            ) : (
                                permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 dark:border-gray-700"
                                    >
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {permission.name}
                                            </span>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                Created:{' '}
                                                {new Date(
                                                    permission.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDeletePermission(
                                                    permission,
                                                )
                                            }
                                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Users Section */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Users ({users.length})
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {users.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    No users found.
                                </p>
                            ) : (
                                users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {user.roles.length === 0 ? (
                                                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                            No roles
                                                        </span>
                                                    ) : (
                                                        user.roles.map(
                                                            (role) => (
                                                                <span
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                                                >
                                                                    {role.name}
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRemoveUserRole(
                                                                                user,
                                                                                role,
                                                                            )
                                                                        }
                                                                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                                                        title="Remove role"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ),
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleAssignRole(user)
                                                }
                                                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                            >
                                                Assign Role
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Role Modal */}
                <Modal
                    show={showCreateRoleModal}
                    onClose={() => setShowCreateRoleModal(false)}
                    maxWidth="md"
                >
                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Role
                        </h3>
                        <form onSubmit={handleCreateRole} className="space-y-4">
                            <div>
                                <InputLabel
                                    htmlFor="role_name"
                                    value="Role Name"
                                />
                                <TextInput
                                    id="role_name"
                                    type="text"
                                    value={createRoleForm.data.name}
                                    onChange={(e) =>
                                        createRoleForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Editor, Manager"
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel value="Permissions" />
                                <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-3 dark:border-gray-600">
                                    {permissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={createRoleForm.data.permissions.includes(
                                                    permission.id,
                                                )}
                                                onChange={() =>
                                                    handlePermissionToggle(
                                                        permission.id,
                                                        createRoleForm,
                                                    )
                                                }
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {permission.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <SecondaryButton
                                    onClick={() =>
                                        setShowCreateRoleModal(false)
                                    }
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={createRoleForm.processing}
                                >
                                    {createRoleForm.processing
                                        ? 'Creating...'
                                        : 'Create Role'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Edit Role Modal */}
                <Modal
                    show={showEditRoleModal}
                    onClose={() => setShowEditRoleModal(false)}
                    maxWidth="md"
                >
                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Edit Role: {editingRole?.name}
                        </h3>
                        <form onSubmit={handleUpdateRole} className="space-y-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_role_name"
                                    value="Role Name"
                                />
                                <TextInput
                                    id="edit_role_name"
                                    type="text"
                                    value={editRoleForm.data.name}
                                    onChange={(e) =>
                                        editRoleForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel value="Permissions" />
                                <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-3 dark:border-gray-600">
                                    {permissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={editRoleForm.data.permissions.includes(
                                                    permission.id,
                                                )}
                                                onChange={() =>
                                                    handlePermissionToggle(
                                                        permission.id,
                                                        editRoleForm,
                                                    )
                                                }
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {permission.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <SecondaryButton
                                    onClick={() => setShowEditRoleModal(false)}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={editRoleForm.processing}
                                >
                                    {editRoleForm.processing
                                        ? 'Updating...'
                                        : 'Update Role'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Create Permission Modal */}
                <Modal
                    show={showCreatePermissionModal}
                    onClose={() => setShowCreatePermissionModal(false)}
                    maxWidth="sm"
                >
                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Permission
                        </h3>
                        <form
                            onSubmit={handleCreatePermission}
                            className="space-y-4"
                        >
                            <div>
                                <InputLabel
                                    htmlFor="permission_name"
                                    value="Permission Name"
                                />
                                <TextInput
                                    id="permission_name"
                                    type="text"
                                    value={createPermissionForm.data.name}
                                    onChange={(e) =>
                                        createPermissionForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="e.g., edit posts, delete users"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <SecondaryButton
                                    onClick={() =>
                                        setShowCreatePermissionModal(false)
                                    }
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={createPermissionForm.processing}
                                >
                                    {createPermissionForm.processing
                                        ? 'Creating...'
                                        : 'Create Permission'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Assign User Role Modal */}
                <Modal
                    show={showUserRoleModal}
                    onClose={() => setShowUserRoleModal(false)}
                    maxWidth="sm"
                >
                    <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Assign Role to {selectedUser?.name}
                        </h3>
                        <form
                            onSubmit={handleAssignUserRole}
                            className="space-y-4"
                        >
                            <div>
                                <InputLabel
                                    htmlFor="user_role"
                                    value="Select Role"
                                />
                                <select
                                    id="user_role"
                                    value={userRoleForm.data.role_id}
                                    onChange={(e) =>
                                        userRoleForm.setData(
                                            'role_id',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles
                                        .filter(
                                            (role) =>
                                                !selectedUser?.roles.some(
                                                    (userRole) =>
                                                        userRole.id === role.id,
                                                ),
                                        )
                                        .map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <SecondaryButton
                                    onClick={() => setShowUserRoleModal(false)}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={userRoleForm.processing}
                                >
                                    {userRoleForm.processing
                                        ? 'Assigning...'
                                        : 'Assign Role'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </ModernSidebarLayout>
    );
}
