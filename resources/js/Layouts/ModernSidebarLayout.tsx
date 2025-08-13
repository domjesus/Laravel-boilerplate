import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface ModernSidebarLayoutProps {
    header?: ReactNode;
}

interface NavItem {
    name: string;
    routeName: string;
    icon: (active: boolean) => JSX.Element;
    method?: 'get' | 'post';
    adminOnly?: boolean;
    managerOrAdminOnly?: boolean;
}

const navItems: NavItem[] = [
    {
        name: 'Dashboard',
        routeName: 'dashboard',
        icon: (active) => (
            <svg
                className={clsx(
                    'h-5 w-5',
                    active
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11 2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                />
            </svg>
        ),
    },

    // ...existing nav items...
    {
        name: 'Roles & Permissions',
        routeName: 'admin.roles_permissions.index',
        icon: (active) => (
            <svg
                className={clsx(
                    'h-5 w-5',
                    active
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
        adminOnly: true,
    },

    {
        name: 'Users',
        routeName: 'users.index',
        icon: (active) => (
            <svg
                className={clsx(
                    'h-5 w-5',
                    active
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 4.197a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>
        ),
        managerOrAdminOnly: true,
    },
];

export default function ModernSidebarLayout({
    header,
    children,
}: PropsWithChildren<ModernSidebarLayoutProps>) {
    const user = usePage().props.auth.user;
    const userRoles = (user?.roles ?? []).map((role) => role.name);
    const hasActiveSubscription =
        (user?.has_active_subscription || userRoles.includes('admin')) ?? false;

    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
    const [collapsed, setCollapsed] = useState(false); // desktop

    const isActive = (item: NavItem) => route().current(item.routeName);

    // Filter navigation items based on roles (keep subscription-based items visible)
    const filteredNavItems = navItems.filter((item) => {
        if (item.name === 'Companies') {
            return userRoles.includes('admin');
        }
        if (item.managerOrAdminOnly) {
            return userRoles.includes('admin') || userRoles.includes('manager');
        }
        if (item.adminOnly) {
            return userRoles.includes('admin');
        }
        // All other items (including subscription-required ones) are visible
        return true;
    });

    const handleCustomerPortal = () => {
        // Create a form and submit it for server-side redirect
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('subscription.customer-portal');

        // Add CSRF token
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        if (!csrfToken) {
            console.error(
                'CSRF token not found - refreshing page to get new token',
            );
            // If no CSRF token found, refresh the page to get a fresh token
            window.location.reload();
            return;
        }

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    aria-hidden="true"
                />
            )}
            <aside
                className={clsx(
                    'fixed z-40 flex h-full flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-700 dark:bg-gray-800',
                    collapsed ? 'w-20' : 'w-64',
                    sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0',
                )}
            >
                <div className="flex h-16 items-center gap-2 px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-8 fill-current text-indigo-600 dark:text-indigo-400" />
                        {!collapsed && (
                            <span className="font-semibold tracking-tight text-gray-700 dark:text-gray-200">
                                App
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        aria-label={
                            collapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                    >
                        <svg
                            className={clsx(
                                'h-5 w-5 transition-transform',
                                collapsed && 'rotate-180',
                            )}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-6">
                    {!hasActiveSubscription && (
                        <div className="mb-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-yellow-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        {!collapsed
                                            ? 'Subscription Required'
                                            : 'Sub'}
                                    </p>
                                    {!collapsed && (
                                        <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                            Subscribe to access leads,
                                            campaigns, and user management.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {filteredNavItems.map((item) => {
                        const active = isActive(item);
                        const requiresSubscription = [
                            'Leads',
                            'Campaigns',
                            'Users',
                            'Customers',
                        ].includes(item.name);
                        const showSubscriptionWarning =
                            requiresSubscription && !hasActiveSubscription;

                        return (
                            <Link
                                key={item.name}
                                href={route(item.routeName)}
                                className={clsx(
                                    'group relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                                        : showSubscriptionWarning
                                          ? 'text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 dark:text-gray-500 dark:hover:bg-yellow-500/10 dark:hover:text-yellow-400'
                                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/60 dark:hover:text-white',
                                )}
                            >
                                {item.icon(active)}
                                {!collapsed && (
                                    <span className="ms-3 flex items-center gap-2">
                                        {item.name}
                                        {showSubscriptionWarning && (
                                            <svg
                                                className="h-4 w-4 text-yellow-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                            >
                                                <title>
                                                    Subscription required
                                                </title>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-gray-200 px-3 py-4 dark:border-gray-700">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-sm font-semibold uppercase text-white">
                                    {user.name.charAt(0)}
                                </div>
                                {!collapsed && (
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate text-sm font-semibold leading-tight">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </span>
                                    </div>
                                )}
                                <svg
                                    className={clsx(
                                        '-me-1 ms-auto h-4 w-4',
                                        collapsed && 'hidden',
                                    )}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right">
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href={route('subscription.plans')}>
                                Manage Subscription
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('subscription.subscriptions')}
                            >
                                My Subscriptions
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('subscription.receipts')}
                            >
                                Billing History
                            </Dropdown.Link>
                            <button
                                type="button"
                                onClick={handleCustomerPortal}
                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                            >
                                Customer Portal
                            </button>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>
            <div className="flex flex-1 flex-col lg:pl-0">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <button
                        onClick={() => setSidebarOpen((o) => !o)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring lg:hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    {header && (
                        <div className="flex-1 truncate text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {header}
                        </div>
                    )}
                </header>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
