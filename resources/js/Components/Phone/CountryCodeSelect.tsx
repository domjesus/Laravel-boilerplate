import React from 'react';

import { COUNTRIES, type CountryDial } from './countries';

interface Props {
    value: string; // dial code like "+1"
    onChange: (dial: string) => void;
    className?: string;
}

const baseInputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

const CountryCodeSelect: React.FC<Props> = ({ value, onChange, className }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);

    const items: CountryDial[] = React.useMemo(
        () => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)),
        [],
    );

    // Track the chosen ISO country for the current dial code so we don't default to
    // the first alphabetical match (e.g., +1 shows Anguilla vs United States)
    const [chosenCountryCode, setChosenCountryCode] = React.useState<
        string | null
    >(null);
    const prevDialRef = React.useRef<string | null>(null);

    // Clear chosen country when dial changes to a different value externally
    React.useEffect(() => {
        if (prevDialRef.current !== value) {
            // Only clear when the dial truly changes, preserving the user choice for same dial
            prevDialRef.current = value;
            setChosenCountryCode((prev) =>
                prev && items.some((c) => c.dial === value && c.code === prev)
                    ? prev
                    : null,
            );
        }
    }, [value, items]);

    const selected = React.useMemo(() => {
        const candidates = items.filter((c) => c.dial === value);
        if (candidates.length === 0) return null;
        if (chosenCountryCode) {
            const pick = candidates.find((c) => c.code === chosenCountryCode);
            if (pick) return pick;
        }
        return candidates[0] ?? null;
    }, [items, value, chosenCountryCode]);

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [highlight, setHighlight] = React.useState(0);

    const filtered = React.useMemo(() => {
        if (!query) return items;
        const q = query.toLowerCase();
        return items.filter((c) =>
            [c.name.toLowerCase(), c.code.toLowerCase(), c.dial]
                .join(' ')
                .includes(q),
        );
    }, [items, query]);

    React.useEffect(() => {
        if (open) {
            setQuery('');
            setHighlight(0);
            // Focus input when opening
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (containerRef.current.contains(e.target as Node)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const commit = (c: CountryDial) => {
        setChosenCountryCode(c.code);
        onChange(c.dial);
        setOpen(false);
        inputRef.current?.blur();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            !open &&
            (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')
        ) {
            e.preventDefault();
            setOpen(true);
            return;
        }
        if (!open) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlight((h) =>
                Math.min(h + 1, Math.max(filtered.length - 1, 0)),
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const pick = filtered[highlight];
            if (pick) commit(pick);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center">
                <button
                    type="button"
                    className={className ?? baseInputCls}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {selected ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="text-base leading-none">
                                {selected.flag}
                            </span>
                            <span className="font-medium tabular-nums">
                                {selected.dial}
                            </span>
                            <span className="text-slate-500">
                                — {selected.name}
                            </span>
                        </span>
                    ) : (
                        <span className="text-slate-500">
                            Select country code
                        </span>
                    )}
                </button>
            </div>
            {open && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                    <div className="p-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="Search name, code or dial"
                            className={baseInputCls}
                            aria-autocomplete="list"
                            aria-controls="country-code-list"
                        />
                    </div>
                    <ul
                        ref={listRef}
                        id="country-code-list"
                        role="listbox"
                        className="max-h-64 overflow-auto py-1"
                    >
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-sm text-slate-500">
                                No results
                            </li>
                        )}
                        {filtered.map((c, idx) => (
                            <li
                                key={`${c.code}-${c.dial}`}
                                role="option"
                                aria-selected={value === c.dial}
                                className={
                                    'cursor-pointer px-3 py-2 text-sm hover:bg-slate-50 ' +
                                    (idx === highlight ? 'bg-slate-50' : '')
                                }
                                onMouseEnter={() => setHighlight(idx)}
                                onMouseDown={(e) => {
                                    // Avoid blurring the input before click handler
                                    e.preventDefault();
                                }}
                                onClick={() => commit(c)}
                            >
                                <span className="mr-2 text-base leading-none">
                                    {c.flag}
                                </span>
                                <span className="mr-2 font-medium tabular-nums">
                                    {c.dial}
                                </span>
                                <span className="text-slate-600">{c.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CountryCodeSelect;
