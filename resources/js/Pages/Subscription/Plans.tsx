import ModernSidebarLayout from '@/Layouts/ModernSidebarLayout';
import { PageProps, PricingPlan } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Subscription {
    id: number;
    stripe_id: string;
    stripe_status: string;
    stripe_price: string;
    created_at: string;
    ends_at: string | null;
    trial_ends_at: string | null;
    canceled: boolean;
    active: boolean;
    on_grace_period: boolean;
}

interface Props extends PageProps {
    pricingPlans: PricingPlan[];
    userSubscriptions: Subscription[];
}

export default function Plans({ pricingPlans, userSubscriptions }: Props) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const { props } = usePage();
    const flash = props.flash as { error?: string; requested_feature?: string };

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

    const handleCancel = (subscriptionId: number) => {
        if (
            !confirm(
                'Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.',
            )
        ) {
            return;
        }

        setCancelling(true);

        // Create a form and submit it for cancel
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('subscription.cancel');

        // Add CSRF token
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        if (!csrfToken) {
            console.error(
                'CSRF token not found - refreshing page to get new token',
            );
            setCancelling(false);
            // If no CSRF token found, refresh the page to get a fresh token
            window.location.reload();
            return;
        }

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);

        // Add subscription ID
        const subscriptionInput = document.createElement('input');
        subscriptionInput.type = 'hidden';
        subscriptionInput.name = 'subscription_id';
        subscriptionInput.value = subscriptionId.toString();
        form.appendChild(subscriptionInput);

        document.body.appendChild(form);
        form.submit();
    };

    const getSubscriptionForPlan = (plan: PricingPlan): Subscription | null => {
        return (
            userSubscriptions.find(
                (sub) =>
                    sub.active && sub.stripe_price === plan.default_price?.id,
            ) || null
        );
    };

    const isSubscribedToPlan = (plan: PricingPlan) => {
        const subscription = getSubscriptionForPlan(plan);
        return subscription !== null;
    };

    return (
        <ModernSidebarLayout header="Choose Your Plan">
            <Head title="Subscription Plans" />

            <div className="mx-auto max-w-7xl">
                {/* Flash Message */}
                {flash?.error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
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
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Subscription Required
                                </h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <p>{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="mb-12 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Simple, Transparent Pricing
                            </h3>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Choose the perfect plan for your business needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {pricingPlans.map((plan, index) => {
                                const isSubscribed = isSubscribedToPlan(plan);
                                const subscription =
                                    getSubscriptionForPlan(plan);
                                const isCanceled =
                                    subscription?.canceled && isSubscribed;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                                            isSubscribed
                                                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-500 dark:from-green-900/20 dark:to-emerald-900/20'
                                                : index === 1
                                                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-500 dark:from-blue-900/20 dark:to-indigo-900/20'
                                                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                                        }`}
                                    >
                                        {isSubscribed && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                                                <span
                                                    className={`rounded-full px-4 py-1 text-sm font-semibold text-white ${
                                                        isCanceled
                                                            ? 'bg-yellow-600'
                                                            : 'bg-green-600'
                                                    }`}
                                                >
                                                    {isCanceled
                                                        ? 'Cancelled'
                                                        : 'Current Plan'}
                                                </span>
                                            </div>
                                        )}
                                        {!isSubscribed && index === 1 && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
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
                                                            {plan.default_price
                                                                .interval_count &&
                                                            plan.default_price
                                                                .interval_count >
                                                                1
                                                                ? `${
                                                                      plan
                                                                          .default_price
                                                                          .interval_count
                                                                  } ${
                                                                      plan
                                                                          .default_price
                                                                          .interval
                                                                  }s`
                                                                : plan
                                                                      .default_price
                                                                      .interval}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {isSubscribed ? (
                                                <div className="mt-8 space-y-3">
                                                    {!isCanceled ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={true}
                                                                className="w-full cursor-not-allowed rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white opacity-75"
                                                            >
                                                                ✓ Already
                                                                Subscribed
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    subscription &&
                                                                    handleCancel(
                                                                        subscription.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    cancelling
                                                                }
                                                                className="w-full rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {cancelling
                                                                    ? 'Cancelling...'
                                                                    : 'Cancel Subscription'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="text-sm text-yellow-600 dark:text-yellow-400">
                                                            <p className="font-medium">
                                                                Subscription
                                                                cancelled
                                                            </p>
                                                            <p className="mt-1 text-xs">
                                                                Access until:{' '}
                                                                {subscription?.ends_at
                                                                    ? new Date(
                                                                          subscription.ends_at,
                                                                      ).toLocaleDateString()
                                                                    : 'N/A'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        plan.default_price &&
                                                        handleSubscribe(
                                                            plan.default_price
                                                                .id,
                                                        )
                                                    }
                                                    disabled={
                                                        processing ===
                                                            plan.default_price
                                                                ?.id ||
                                                        !plan.default_price
                                                    }
                                                    className={`mt-8 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        index === 1
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {processing ===
                                                    plan.default_price?.id
                                                        ? 'Processing...'
                                                        : 'Subscribe Now'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </ModernSidebarLayout>
    );
}
