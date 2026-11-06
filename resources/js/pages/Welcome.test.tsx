import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Welcome from './Welcome';

vi.mock('@inertiajs/react', () => ({
    Head: ({ children, title }: { children?: React.ReactNode; title?: string }) => (
        <div data-testid="head" data-title={title}>{children}</div>
    ),
    Link: ({ children, href, ...props }: { children?: React.ReactNode; href?: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

describe('Welcome Landing Page', () => {
    it('renders with full props', () => {
        render(
            <Welcome
                appName="Mr. Roof Test"
                services={[]}
                locations={[]}
                testimonials={[]}
                articles={[]}
                contact={{
                    phone: '1-800-4-MR-ROOF',
                    email: 'contact@mrroof.com',
                    address: '123 Construction Way',
                }}
            />
        );

        expect(screen.getAllByText(/Mr. Roof/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Built to Protect/i)).toBeTruthy();
    });

    it('renders safely when all props are empty or undefined', () => {
        const { container } = render(<Welcome />);
        expect(container).toBeTruthy();
        expect(screen.getAllByText(/Mr. Roof/i).length).toBeGreaterThan(0);
    });

    it('renders safely when props contain explicit null values', () => {
        const { container } = render(
            <Welcome
                appName={null}
                services={null}
                locations={null}
                testimonials={null}
                articles={null}
                contact={null}
                settings={null}
            />
        );
        expect(container).toBeTruthy();
        expect(screen.getAllByText(/Mr. Roof/i).length).toBeGreaterThan(0);
    });

    it('renders safely when collections contain malformed records or negative ratings', () => {
        const { container } = render(
            <Welcome
                appName="Mr. Roof"
                // @ts-expect-error testing malformed records
                services={[{ id: 1 }]}
                // @ts-expect-error testing malformed records
                locations={[{ id: 1 }]}
                // @ts-expect-error testing invalid rating
                testimonials={[{ id: 1, author: 'Jane', body: 'Great work', rating: -1 }]}
                // @ts-expect-error testing malformed records
                articles={[{ id: 1, title: 'Tips' }]}
                contact={{}}
            />
        );
        expect(container).toBeTruthy();
        expect(screen.getByText(/Great work/i)).toBeTruthy();
    });
});
