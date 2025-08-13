import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, pricingPlans = [] }: PageProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleSubscribe = (priceId: string) => {
        setProcessing(priceId);

        // Create a form and submit it for full page redirect
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('subscription.checkout', priceId);

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
        <>
            <Head title="Brown Ads - Advanced Ad Tracking Platform" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
                {/* Navigation */}
                <nav className="relative border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            Brown Ads
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-8">
                                    <a
                                        href="#features"
                                        className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                    >
                                        Features
                                    </a>
                                    <a
                                        href="#pricing"
                                        className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                    >
                                        Pricing
                                    </a>
                                    <a
                                        href="#about"
                                        className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                    >
                                        About
                                    </a>
                                </div>
                            </div>

                            {/* Auth Links */}
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center space-x-4 md:ml-6">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() =>
                                        setMobileMenuOpen(!mobileMenuOpen)
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={
                                                mobileMenuOpen
                                                    ? 'M6 18L18 6M6 6l12 12'
                                                    : 'M4 6h16M4 12h16M4 18h16'
                                            }
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden">
                            <div className="space-y-1 border-t border-gray-200 bg-white px-2 pb-3 pt-2 sm:px-3 dark:border-gray-700 dark:bg-gray-900">
                                <a
                                    href="#features"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Features
                                </a>
                                <a
                                    href="#pricing"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Pricing
                                </a>
                                <a
                                    href="#about"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    About
                                </a>
                                <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="mx-3 block rounded-lg bg-blue-600 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <div className="space-y-2 px-3">
                                            <Link
                                                href={route('login')}
                                                className="block py-2 text-base font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="block rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700"
                                            >
                                                Get Started
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <main className="relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="py-20 sm:py-24 lg:py-32">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
                                    <span className="block">
                                        Track Your Ads
                                    </span>
                                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        Maximize ROI
                                    </span>
                                </h1>
                                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300">
                                    Advanced ad tracking platform that helps
                                    businesses monitor, analyze, and optimize
                                    their advertising campaigns across all
                                    channels for maximum return on investment.
                                </p>
                                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="transform rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="transform rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                                            >
                                                Start Free Trial
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="transform rounded-lg border border-gray-300 bg-white/20 px-8 py-4 text-lg font-semibold text-gray-900 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/30 dark:text-white"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-300/30 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-blue-900/30 dark:to-purple-900/30"></div>
                            <svg
                                viewBox="0 0 1113 440"
                                aria-hidden="true"
                                className="absolute left-1/2 top-0 ml-[-19rem] w-[69.5625rem] fill-white blur-[26px] dark:hidden"
                            >
                                <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z" />
                            </svg>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section
                    id="features"
                    className="bg-white/50 py-20 backdrop-blur-sm sm:py-24 dark:bg-gray-800/50"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                Powerful Features
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Everything you need to track and optimize your
                                advertising campaigns
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Real-time Analytics
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Monitor your campaign performance in
                                        real-time with detailed analytics and
                                        insights.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Multi-Channel Tracking
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Track campaigns across Google, Facebook,
                                        Instagram, TikTok, and more from one
                                        dashboard.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        ROI Optimization
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        AI-powered recommendations to optimize
                                        your ad spend and maximize return on
                                        investment.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Lead Management
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Capture, track, and manage leads from
                                        all your advertising channels in one
                                        place.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Advanced Reports
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Generate detailed reports with custom
                                        metrics and export data for further
                                        analysis.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6 */}
                            <div className="group relative">
                                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Mobile Responsive
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Access your dashboard and analytics from
                                        any device with our mobile-first design.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Choose the perfect plan for your business needs
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {pricingPlans && pricingPlans.length > 0 ? (
                                pricingPlans.map((plan, index) => (
                                    <div
                                        key={plan.id}
                                        className={`group relative rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                                            index === 1
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-500 dark:from-blue-900/20 dark:to-indigo-900/20'
                                                : 'border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80'
                                        }`}
                                    >
                                        {index === 1 && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {plan.name}
                                            </h3>

                                            {plan.description && (
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    {plan.description}
                                                </p>
                                            )}

                                            {plan.default_price && (
                                                <div className="mt-6">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        {
                                                            plan.default_price
                                                                .formatted_amount
                                                        }
                                                    </span>
                                                    {plan.default_price
                                                        .interval && (
                                                        <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                                                            /
                                                            {(() => {
                                                                const count =
                                                                    plan
                                                                        .default_price
                                                                        .interval_count ??
                                                                    1;
                                                                const interval =
                                                                    plan
                                                                        .default_price
                                                                        .interval;
                                                                return count > 1
                                                                    ? `${count} ${interval}s`
                                                                    : interval;
                                                            })()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-8">
                                                {auth.user ? (
                                                    plan.default_price ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                plan.default_price &&
                                                                handleSubscribe(
                                                                    plan
                                                                        .default_price
                                                                        .id,
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                plan
                                                                    .default_price
                                                                    ?.id
                                                            }
                                                            className={`block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                                index === 1
                                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            {processing ===
                                                            plan.default_price
                                                                ?.id
                                                                ? 'Processing...'
                                                                : 'Subscribe Now'}
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={route(
                                                                'subscription.plans',
                                                            )}
                                                            className={`block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                                                                index === 1
                                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            View Plans
                                                        </Link>
                                                    )
                                                ) : (
                                                    <Link
                                                        href={route('register')}
                                                        className={`block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                                                            index === 1
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        Get Started
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Features from metadata */}
                                            {plan.metadata &&
                                                Object.keys(plan.metadata)
                                                    .length > 0 && (
                                                    <div className="mt-8 space-y-3 text-left">
                                                        {Object.entries(
                                                            plan.metadata,
                                                        ).map(
                                                            ([key, value]) =>
                                                                key.startsWith(
                                                                    'feature_',
                                                                ) && (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <svg
                                                                            className="h-4 w-4 text-green-500"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M5 13l4 4L19 7"
                                                                            />
                                                                        </svg>
                                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                                            {
                                                                                value
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback pricing plans if Stripe data is not available
                                <div className="col-span-full">
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                        {/* Starter Plan */}
                                        <div className="group relative rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Starter
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    Perfect for small businesses
                                                </p>
                                                <div className="mt-6">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        $29
                                                    </span>
                                                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                                                        /month
                                                    </span>
                                                </div>
                                                <div className="mt-8">
                                                    {auth.user ? (
                                                        <Link
                                                            href={route(
                                                                'dashboard',
                                                            )}
                                                            className="block w-full rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                                        >
                                                            Go to Dashboard
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route(
                                                                'register',
                                                            )}
                                                            className="block w-full rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                                        >
                                                            Get Started
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="mt-8 space-y-3 text-left">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Up to 5 campaigns
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Basic analytics
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Email support
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Plan */}
                                        <div className="group relative rounded-2xl border border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg ring-2 ring-blue-500 transition-all duration-300 hover:shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20">
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                                                    Most Popular
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Professional
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    For growing businesses
                                                </p>
                                                <div className="mt-6">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        $79
                                                    </span>
                                                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                                                        /month
                                                    </span>
                                                </div>
                                                <div className="mt-8">
                                                    {auth.user ? (
                                                        <Link
                                                            href={route(
                                                                'dashboard',
                                                            )}
                                                            className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
                                                        >
                                                            Go to Dashboard
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route(
                                                                'register',
                                                            )}
                                                            className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
                                                        >
                                                            Get Started
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="mt-8 space-y-3 text-left">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Unlimited campaigns
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Advanced analytics
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Priority support
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            API access
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="group relative rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80">
                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Enterprise
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    For large organizations
                                                </p>
                                                <div className="mt-6">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        $199
                                                    </span>
                                                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                                                        /month
                                                    </span>
                                                </div>
                                                <div className="mt-8">
                                                    {auth.user ? (
                                                        <Link
                                                            href={route(
                                                                'dashboard',
                                                            )}
                                                            className="block w-full rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                                        >
                                                            Go to Dashboard
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route(
                                                                'register',
                                                            )}
                                                            className="block w-full rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                                        >
                                                            Get Started
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="mt-8 space-y-3 text-left">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Everything in
                                                            Professional
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            White-label solution
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            24/7 phone support
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-4 w-4 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                                            Custom integrations
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-center sm:p-16">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Ready to maximize your ad ROI?
                            </h2>
                            <p className="mt-4 text-xl text-blue-100">
                                Join thousands of businesses already tracking
                                their ads with Brown Ads
                            </p>
                            <div className="mt-8">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="transform rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100"
                                    >
                                        Access Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="transform rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100"
                                    >
                                        Start Your Free Trial
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="col-span-1 md:col-span-2">
                                <div className="mb-4 flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                                        <svg
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold">
                                        Brown Ads
                                    </span>
                                </div>
                                <p className="max-w-md text-gray-400">
                                    Advanced ad tracking platform helping
                                    businesses maximize their advertising ROI
                                    across all channels.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Product
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a
                                            href="#features"
                                            className="transition-colors hover:text-white"
                                        >
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#pricing"
                                            className="transition-colors hover:text-white"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-white"
                                        >
                                            API
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Company
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a
                                            href="#about"
                                            className="transition-colors hover:text-white"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-white"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-white"
                                        >
                                            Privacy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 Brown Ads. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
