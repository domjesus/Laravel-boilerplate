import { Transition } from '@headlessui/react';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
    triggerRef: React.RefObject<HTMLDivElement>;
}>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
    triggerRef: { current: null },
});

const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider
            value={{ open, setOpen, toggleOpen, triggerRef }}
        >
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen, triggerRef } =
        useContext(DropDownContext);

    return (
        <>
            <div ref={triggerRef} onClick={toggleOpen}>
                {children}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white dark:bg-gray-700',
    children,
}: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48';
    contentClasses?: string;
}>) => {
    const { open, setOpen, triggerRef } = useContext(DropDownContext);
    const [dropUp, setDropUp] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Use actual content height if available, otherwise estimate
            const dropdownHeight = contentRef.current?.offsetHeight || 280;
            const spaceBelow = viewportHeight - triggerRect.bottom - 8; // 8px for margin
            const spaceAbove = triggerRect.top - 8; // 8px for margin

            // If there's not enough space below and there's more space above, drop up
            setDropUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
        }
    }, [open, triggerRef]);

    let alignmentClasses = dropUp ? 'origin-bottom' : 'origin-top';

    if (align === 'left') {
        alignmentClasses += dropUp
            ? ' ltr:origin-bottom-left rtl:origin-bottom-right start-0'
            : ' ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses += dropUp
            ? ' ltr:origin-bottom-right rtl:origin-bottom-left end-0'
            : ' ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    const positionClasses = dropUp ? 'mb-2 bottom-full' : 'mt-2';

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    ref={contentRef}
                    className={`absolute z-50 rounded-md shadow-lg ${positionClasses} ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={
                            `rounded-md ring-1 ring-black ring-opacity-5 ` +
                            contentClasses
                        }
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({
    className = '',
    children,
    ...props
}: InertiaLinkProps) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
