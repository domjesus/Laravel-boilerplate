import React from 'react';
import Modal from './Modal';

export type ConfirmTone = 'danger' | 'primary' | 'neutral';

interface ConfirmDialogProps {
    show: boolean;
    title: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    tone?: ConfirmTone;
    loading?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    onConfirm: () => void;
    onClose: () => void;
}

const toneStyles: Record<ConfirmTone, string> = {
    danger: 'bg-red-600 hover:bg-red-500 focus-visible:ring-red-600 text-white',
    primary:
        'bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-600 text-white',
    neutral:
        'bg-slate-700 hover:bg-slate-600 focus-visible:ring-slate-700 text-white',
};

export default function ConfirmDialog({
    show,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    tone = 'danger',
    loading = false,
    maxWidth = 'sm',
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>
                {description && (
                    <div className="mt-2 text-sm text-slate-600">
                        {description}
                    </div>
                )}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${toneStyles[tone]}`}
                    >
                        {loading ? 'Please wait…' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
