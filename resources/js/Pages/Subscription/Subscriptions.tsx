import ModernSidebarLayout from '@/Layouts/ModernSidebarLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Subscription {
    id: number;
    name: string;
    stripe_id: string;
    stripe_status: string;
    stripe_price: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    ends_at: string | null;
    trial_ends_at: string | null;
    canceled: boolean;
    active: boolean;
    on_grace_period: boolean;
    recurring: boolean;
    ended: boolean;
}

interface Props {
    subscriptions: Subscription[];
}

export default function Subscriptions({ subscriptions }: Props) {
    const { setData, post, processing } = useForm({
        subscription_id: 0,
    });
    const page = usePage();
    const flash =
        (page.props as { flash?: { success?: string; error?: string } })
            .flash || {};

    const handleCancel = (subscriptionId: number) => {
        if (confirm('Are you sure you want to cancel this subscription?')) {
            setData('subscription_id', subscriptionId);
            post(route('subscription.cancel'));
        }
    };

    const handleResume = (subscriptionId: number) => {
        if (confirm('Are you sure you want to resume this subscription?')) {
            setData('subscription_id', subscriptionId);
            post(route('subscription.resume'));
        }
    };

    const getStatusBadge = (subscription: Subscription) => {
        if (subscription.ended) {
            return (
                <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Ended
                </span>
            );
        }
        if (subscription.canceled && subscription.on_grace_period) {
            return (
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Canceled (Grace Period)
                </span>
            );
        }
        if (subscription.canceled) {
            return (
                <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Canceled
                </span>
            );
        }
        if (subscription.active) {
            return (
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Active
                </span>
            );
        }
        return (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-800">
                {subscription.stripe_status.replace('_', ' ')}
            </span>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatPrice = (priceId: string) => {
        // This is a simplified formatting - you might want to fetch actual price details
        return priceId;
    };

    return (
        <ModernSidebarLayout>
            <Head title="My Subscriptions" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="text-sm text-green-800">
                                    {flash.success}
                                </div>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="text-sm text-red-800">
                                    {flash.error}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Subscriptions
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage all your active and canceled subscriptions
                        </p>
                    </div>

                    {subscriptions.length === 0 ? (
                        <div className="rounded-lg border bg-white p-8 text-center shadow">
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No subscriptions found
                            </h3>
                            <p className="mb-4 text-gray-600">
                                You don't have any subscriptions yet.
                            </p>
                            <a
                                href={route('subscription.plans')}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Browse Plans
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {subscriptions.map((subscription) => (
                                <div
                                    key={subscription.id}
                                    className="rounded-lg border bg-white p-6 shadow"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {subscription.name ||
                                                        'Subscription'}
                                                </h3>
                                                {getStatusBadge(subscription)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Started on{' '}
                                                {formatDate(
                                                    subscription.created_at,
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">
                                                Stripe ID:{' '}
                                                {subscription.stripe_id}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Price:{' '}
                                                {formatPrice(
                                                    subscription.stripe_price,
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Status
                                            </label>
                                            <p className="text-sm capitalize text-gray-900">
                                                {subscription.stripe_status.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Quantity
                                            </label>
                                            <p className="text-sm text-gray-900">
                                                {subscription.quantity}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                {subscription.canceled
                                                    ? 'Ends At'
                                                    : 'Next Billing'}
                                            </label>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(
                                                    subscription.ends_at,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Trial Ends
                                            </label>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(
                                                    subscription.trial_ends_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 border-t pt-4">
                                        {subscription.active &&
                                            !subscription.canceled && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancel(
                                                            subscription.id,
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    Cancel Subscription
                                                </button>
                                            )}

                                        {subscription.canceled &&
                                            subscription.on_grace_period && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleResume(
                                                            subscription.id,
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Resume Subscription
                                                </button>
                                            )}

                                        {subscription.ended && (
                                            <a
                                                href={route(
                                                    'subscription.plans',
                                                )}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Subscribe Again
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ModernSidebarLayout>
    );
}
