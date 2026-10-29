import { useId } from 'react';
import type {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';

export function PageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">
                    {actions}
                </div>
            )}
        </div>
    );
}

export function SectionCard({
    title,
    description,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function FormField({
    label,
    hint,
    error,
    required,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: (props: {
        id: string;
        'aria-describedby'?: string;
        'aria-invalid'?: boolean;
    }) => ReactNode;
}) {
    const id = useId();
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-slate-800">
                {label}
                {required && (
                    <span className="ml-0.5 text-[#d9232a]" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            {children({
                id,
                'aria-describedby': describedBy,
                'aria-invalid': Boolean(error),
            })}
            {hint && !error && (
                <p id={hintId} className="text-xs text-slate-500">
                    {hint}
                </p>
            )}
            {error && (
                <p id={errorId} className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export const inputClass =
    'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-500';

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={`${inputClass} ${className}`} {...props} />;
}

export function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className={`${inputClass} min-h-[90px] ${className}`} {...props} />;
}

export function SelectInput({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select className={`${inputClass} ${className}`} {...props}>
            {children}
        </select>
    );
}

export function AdminButton({
    variant = 'primary',
    className = '',
    children,
    type = 'button',
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}) {
    const variantClass = {
        primary: 'bg-[#d9232a] text-white hover:bg-[#b81b22] disabled:opacity-60',
        secondary: 'bg-[#0f2231] text-white hover:bg-[#17334a] disabled:opacity-60',
        outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-60',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-60',
    }[variant];

    return (
        <button
            type={type}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${variantClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
