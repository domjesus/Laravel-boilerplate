import ModernSidebarLayout from '@/Layouts/ModernSidebarLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Invoice {
    id: string;
    date: string;
    total: string;
    currency: string;
    status: string;
    hosted_invoice_url: string;
    invoice_pdf: string;
    number: string;
}

interface Props extends PageProps {
    invoices: Invoice[];
    error?: string;
}

export default function Receipts({ invoices, error }: Props) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleCustomerPortal = () => {
        setIsRedirecting(true);

        // Create a form and submit it for server-side redirect
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('subscription.customer-portal');

        // Add CSRF token
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        if (csrfToken) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        }

        document.body.appendChild(form);
        form.submit();
    };
    return (
        <ModernSidebarLayout header="Billing History">
            <Head title="Billing History" />

            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Billing History & Receipts
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    View and download your billing receipts
                                </p>
                            </div>
                            <button
                                onClick={handleCustomerPortal}
                                disabled={isRedirecting}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isRedirecting
                                    ? 'Redirecting...'
                                    : 'Manage Billing'}
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800 dark:text-red-200">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {invoices.length === 0 && !error ? (
                            <div className="py-12 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                    No invoices found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    You don't have any billing history yet.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('subscription.plans')}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Invoice
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Status
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {invoice.number ||
                                                        invoice.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        invoice.date,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {invoice.total}{' '}
                                                    {invoice.currency}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                            invoice.status ===
                                                            'paid'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                : invoice.status ===
                                                                    'open'
                                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex space-x-2">
                                                        <a
                                                            href={
                                                                invoice.hosted_invoice_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            View
                                                        </a>
                                                        <a
                                                            href={
                                                                invoice.invoice_pdf
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Download PDF
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModernSidebarLayout>
    );
}
