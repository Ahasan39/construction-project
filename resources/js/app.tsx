import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType, ReactNode } from 'react';
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

class RootErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Unhandled React Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '640px', margin: '4rem auto', border: '1px solid #cbd5e1', borderRadius: '12px', background: '#ffffff', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', fontWeight: 'bold' }}>!</span>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Application Error</h2>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        An error occurred while rendering the page: <code>{this.state.error?.message || 'Unknown runtime error'}</code>
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ background: '#0f2231', color: '#ffffff', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

createInertiaApp({
    title: (title) => (title ? `${title}` : 'Mr Roof Construction Project'),
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        );
        return ((page as { default?: ComponentType }).default ?? page) as ComponentType;
    },
    setup({ el, App, props }) {
        if (!el) {
            throw new Error('Inertia root element was not found.');
        }

        createRoot(el).render(
            <RootErrorBoundary>
                <App {...props} />
            </RootErrorBoundary>
        );
    },
});

