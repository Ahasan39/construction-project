import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
    AdminButton,
    FormField,
    PageHeader,
    SectionCard,
    SelectInput,
    TextArea,
    TextInput,
    inputClass,
} from '../../../components/AdminUI';
import { AdminLayout } from '../../../layouts/AdminLayout';

type BusinessHour = {
    day: string;
    open: string;
    close: string;
    closed: boolean;
};

type SocialLinks = {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    x: string;
    tiktok: string;
};

type Settings = {
    company_name: string;
    short_description: string | null;
    website_url: string | null;
    locale: string;
    timezone: string;
    default_cta: string | null;
    business_hours: BusinessHour[] | null;
    contact_number: string | null;
    secondary_phone: string | null;
    email: string | null;
    address: string | null;
    emergency_label: string | null;
    estimate_destination: string | null;
    social_links: Partial<SocialLinks> | null;
    logo_url: string | null;
    favicon_url: string | null;
    primary_color: string;
    accent_color: string;
    updated_at: string | null;
};

type SettingsFormData = {
    company_name: string;
    short_description: string;
    website_url: string;
    locale: string;
    timezone: string;
    default_cta: string;
    business_hours: BusinessHour[];
    contact_number: string;
    secondary_phone: string;
    email: string;
    address: string;
    emergency_label: string;
    estimate_destination: string;
    social_links: SocialLinks;
    primary_color: string;
    accent_color: string;
    logo_media_id?: number | null;
    favicon_media_id?: number | null;
};

type SharedProps = {
    auth: {
        user: {
            permissions: string[];
        } | null;
    };
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSocialLinks: SocialLinks = {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    x: '',
    tiktok: '',
};

function normalizeHours(hours: BusinessHour[] | null): BusinessHour[] {
    return DAYS.map((day) => {
        const existing = hours?.find((row) => row.day === day);

        return {
            day,
            open: existing?.open ?? (day === 'Sunday' ? '' : '08:00'),
            close: existing?.close ?? (day === 'Sunday' ? '' : '17:00'),
            closed: existing?.closed ?? day === 'Sunday',
        };
    });
}

function toFormData(settings: Settings): SettingsFormData {
    return {
        company_name: settings.company_name,
        short_description: settings.short_description ?? '',
        website_url: settings.website_url ?? '',
        locale: settings.locale,
        timezone: settings.timezone,
        default_cta: settings.default_cta ?? '',
        business_hours: normalizeHours(settings.business_hours),
        contact_number: settings.contact_number ?? '',
        secondary_phone: settings.secondary_phone ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
        emergency_label: settings.emergency_label ?? '',
        estimate_destination: settings.estimate_destination ?? '/free-estimate',
        social_links: { ...defaultSocialLinks, ...(settings.social_links ?? {}) },
        primary_color: settings.primary_color,
        accent_color: settings.accent_color,
    };
}

export default function GeneralSettings({ settings }: { settings: Settings }) {
    const { auth } = usePage<SharedProps>().props;
    const permissions = auth.user?.permissions ?? [];
    const canManage = permissions.includes('settings.manage');
    const canUpload = permissions.includes('media.upload');

    const form = useForm<SettingsFormData>(toFormData(settings));
    const [baseline, setBaseline] = useState<SettingsFormData>(() => toFormData(settings));
    const [logoPreview, setLogoPreview] = useState(settings.logo_url ?? '');
    const [faviconPreview, setFaviconPreview] = useState(settings.favicon_url ?? '');
    const [baselineLogo, setBaselineLogo] = useState(settings.logo_url ?? '');
    const [baselineFavicon, setBaselineFavicon] = useState(settings.favicon_url ?? '');
    const [logoUploading, setLogoUploading] = useState(false);
    const [faviconUploading, setFaviconUploading] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);
    const [faviconError, setFaviconError] = useState<string | null>(null);
    const logoChanged = useRef(false);
    const faviconChanged = useRef(false);

    const errors = form.errors as Record<string, string | undefined>;

    function setHour(index: number, patch: Partial<BusinessHour>) {
        form.setData(
            'business_hours',
            form.data.business_hours.map((row, rowIndex) =>
                rowIndex === index ? { ...row, ...patch } : row
            )
        );
    }

    function setSocialLink(key: keyof SocialLinks, value: string) {
        form.setData('social_links', {
            ...form.data.social_links,
            [key]: value,
        });
    }

    async function uploadImage(file: File, purpose: 'logo' | 'favicon') {
        const setUploading = purpose === 'logo' ? setLogoUploading : setFaviconUploading;
        const setUploadError = purpose === 'logo' ? setLogoError : setFaviconError;
        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

        setUploading(true);
        setUploadError(null);

        try {
            const body = new FormData();
            body.append('file', file);
            body.append('purpose', purpose);

            const response = await fetch('/admin/media', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ...(token ? { 'X-CSRF-TOKEN': token } : {}),
                },
                body,
            });

            const payload = (await response.json().catch(() => ({}))) as {
                data?: { id: number; url: string };
                errors?: { file?: string[] };
                message?: string;
            };

            if (!response.ok || !payload.data) {
                throw new Error(payload.errors?.file?.[0] ?? payload.message ?? 'Upload failed.');
            }

            if (purpose === 'logo') {
                form.setData('logo_media_id', payload.data.id);
                logoChanged.current = true;
                setLogoPreview(payload.data.url);
            } else {
                form.setData('favicon_media_id', payload.data.id);
                faviconChanged.current = true;
                setFaviconPreview(payload.data.url);
            }
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed.');
        } finally {
            setUploading(false);
        }
    }

    function chooseImage(event: ChangeEvent<HTMLInputElement>, purpose: 'logo' | 'favicon') {
        const file = event.target.files?.[0];

        if (file) {
            void uploadImage(file, purpose);
        }

        event.target.value = '';
    }

    function removeImage(purpose: 'logo' | 'favicon') {
        if (purpose === 'logo') {
            form.setData('logo_media_id', null);
            logoChanged.current = true;
            setLogoPreview('');
            setLogoError(null);
        } else {
            form.setData('favicon_media_id', null);
            faviconChanged.current = true;
            setFaviconPreview('');
            setFaviconError(null);
        }
    }

    function resetForm() {
        form.setData(baseline);
        form.clearErrors();
        logoChanged.current = false;
        faviconChanged.current = false;
        setLogoPreview(baselineLogo);
        setFaviconPreview(baselineFavicon);
        setLogoError(null);
        setFaviconError(null);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) => {
            const payload: SettingsFormData = { ...data };

            if (!logoChanged.current) {
                delete payload.logo_media_id;
            }

            if (!faviconChanged.current) {
                delete payload.favicon_media_id;
            }

            return payload;
        });

        form.put('/admin/settings/general', {
            preserveScroll: true,
            onSuccess: () => {
                setBaseline({ ...form.data });
                setBaselineLogo(logoPreview);
                setBaselineFavicon(faviconPreview);
                logoChanged.current = false;
                faviconChanged.current = false;
            },
        });
    }

    return (
        <AdminLayout>
            <Head title="General settings">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="General settings"
                description={`Company identity, contact details, hours, social profiles, and brand assets. ${
                    settings.updated_at
                        ? `Last saved ${new Date(settings.updated_at).toLocaleString()}.`
                        : 'Not saved yet.'
                }`}
                actions={
                    <>
                        <AdminButton variant="ghost" onClick={resetForm} disabled={form.processing}>
                            Reset
                        </AdminButton>
                        <AdminButton
                            type="submit"
                            form="general-settings-form"
                            disabled={!canManage || form.processing}
                        >
                            {form.processing ? 'Saving…' : 'Save settings'}
                        </AdminButton>
                    </>
                }
            />

            {!canManage && (
                <div className="mb-5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                    Your role can view these settings but cannot change them.
                </div>
            )}

            {Object.keys(form.errors).length > 0 && (
                <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                    Please fix the highlighted fields and try again.
                </div>
            )}

            <form id="general-settings-form" onSubmit={submit} className="space-y-6">
                <fieldset disabled={!canManage} className="space-y-6">
                    <SectionCard
                        title="Business identity"
                        description="Core display information used across the website and metadata defaults."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField label="Company display name" required error={errors.company_name}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        value={form.data.company_name}
                                        onChange={(event) => form.setData('company_name', event.target.value)}
                                        autoComplete="organization"
                                    />
                                )}
                            </FormField>
                            <FormField label="Website URL" error={errors.website_url}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        type="url"
                                        value={form.data.website_url}
                                        onChange={(event) => form.setData('website_url', event.target.value)}
                                        placeholder="https://example.com"
                                    />
                                )}
                            </FormField>
                            <div className="md:col-span-2">
                                <FormField
                                    label="Short business description"
                                    hint="Used as a default meta description where a page does not override it."
                                    error={errors.short_description}
                                >
                                    {(props) => (
                                        <TextArea
                                            {...props}
                                            rows={3}
                                            value={form.data.short_description}
                                            onChange={(event) => form.setData('short_description', event.target.value)}
                                        />
                                    )}
                                </FormField>
                            </div>
                            <FormField label="Default locale" error={errors.locale}>
                                {(props) => (
                                    <SelectInput
                                        {...props}
                                        value={form.data.locale}
                                        onChange={(event) => form.setData('locale', event.target.value)}
                                    >
                                        <option value="en-US">English — United States</option>
                                        <option value="en-GB">English — United Kingdom</option>
                                        <option value="en-CA">English — Canada</option>
                                        <option value="en-AU">English — Australia</option>
                                    </SelectInput>
                                )}
                            </FormField>
                            <FormField label="Default timezone" error={errors.timezone}>
                                {(props) => (
                                    <SelectInput
                                        {...props}
                                        value={form.data.timezone}
                                        onChange={(event) => form.setData('timezone', event.target.value)}
                                    >
                                        <option value="America/New_York">America/New_York</option>
                                        <option value="America/Chicago">America/Chicago</option>
                                        <option value="America/Denver">America/Denver</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                                        <option value="Etc/UTC">Etc/UTC</option>
                                    </SelectInput>
                                )}
                            </FormField>
                            <FormField label="Default CTA label" error={errors.default_cta}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        value={form.data.default_cta}
                                        onChange={(event) => form.setData('default_cta', event.target.value)}
                                        placeholder="Request a Free Estimate"
                                    />
                                )}
                            </FormField>
                            <FormField
                                label="Estimate page destination"
                                hint="Where the public “Request a Free Estimate” CTA points."
                                error={errors.estimate_destination}
                            >
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        value={form.data.estimate_destination}
                                        onChange={(event) => form.setData('estimate_destination', event.target.value)}
                                        placeholder="/free-estimate"
                                    />
                                )}
                            </FormField>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Contact and location"
                        description="Primary contact information shown in the header, footer, and contact pages."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField label="Primary phone" error={errors.contact_number}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        type="tel"
                                        value={form.data.contact_number}
                                        onChange={(event) => form.setData('contact_number', event.target.value)}
                                        autoComplete="tel"
                                    />
                                )}
                            </FormField>
                            <FormField label="Secondary phone" error={errors.secondary_phone}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        type="tel"
                                        value={form.data.secondary_phone}
                                        onChange={(event) => form.setData('secondary_phone', event.target.value)}
                                    />
                                )}
                            </FormField>
                            <FormField label="Contact email" error={errors.email}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) => form.setData('email', event.target.value)}
                                        autoComplete="email"
                                    />
                                )}
                            </FormField>
                            <FormField label="Emergency banner label" error={errors.emergency_label}>
                                {(props) => (
                                    <TextInput
                                        {...props}
                                        value={form.data.emergency_label}
                                        onChange={(event) => form.setData('emergency_label', event.target.value)}
                                        placeholder="Storm damage? Call our emergency line 24/7."
                                    />
                                )}
                            </FormField>
                            <div className="md:col-span-2">
                                <FormField label="Business address" error={errors.address}>
                                    {(props) => (
                                        <TextArea
                                            {...props}
                                            rows={2}
                                            value={form.data.address}
                                            onChange={(event) => form.setData('address', event.target.value)}
                                            autoComplete="street-address"
                                        />
                                    )}
                                </FormField>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Business hours"
                        description="Mark days as closed or set opening and closing times."
                    >
                        <div className="space-y-3">
                            {form.data.business_hours.map((row, index) => {
                                const dayError =
                                    errors[`business_hours.${index}.open`] ??
                                    errors[`business_hours.${index}.close`] ??
                                    errors[`business_hours.${index}.closed`];

                                return (
                                    <div
                                        key={row.day}
                                        className="grid grid-cols-1 items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-[minmax(7rem,1fr)_auto_1fr_1fr]"
                                    >
                                        <p className="text-sm font-semibold text-slate-800 sm:pb-2">{row.day}</p>
                                        <label className="flex items-center gap-2 text-sm text-slate-700 sm:pb-2">
                                            <input
                                                type="checkbox"
                                                checked={row.closed}
                                                onChange={(event) => setHour(index, { closed: event.target.checked })}
                                                className="h-4 w-4 rounded border-slate-300 text-[#d9232a] focus:ring-sky-200"
                                            />
                                            Closed
                                        </label>
                                        <FormField label="Opens" error={errors[`business_hours.${index}.open`]}>
                                            {(props) => (
                                                <TextInput
                                                    {...props}
                                                    type="time"
                                                    value={row.open}
                                                    disabled={row.closed}
                                                    onChange={(event) => setHour(index, { open: event.target.value })}
                                                />
                                            )}
                                        </FormField>
                                        <FormField label="Closes" error={errors[`business_hours.${index}.close`]}>
                                            {(props) => (
                                                <TextInput
                                                    {...props}
                                                    type="time"
                                                    value={row.close}
                                                    disabled={row.closed}
                                                    onChange={(event) => setHour(index, { close: event.target.value })}
                                                />
                                            )}
                                        </FormField>
                                        {dayError && (
                                            <p className="text-xs font-medium text-red-600 sm:col-span-4">{dayError}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Social profiles"
                        description="Leave a field blank when the profile does not exist."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(Object.keys(defaultSocialLinks) as Array<keyof SocialLinks>).map((key) => (
                                <FormField
                                    key={key}
                                    label={`${key === 'x' ? 'X' : key[0].toUpperCase() + key.slice(1)} URL`}
                                    error={errors[`social_links.${key}`]}
                                >
                                    {(props) => (
                                        <TextInput
                                            {...props}
                                            type="url"
                                            value={form.data.social_links[key]}
                                            onChange={(event) => setSocialLink(key, event.target.value)}
                                            placeholder="https://"
                                        />
                                    )}
                                </FormField>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Brand assets"
                        description="Logo, favicon, and brand colors. Uploads are re-encoded and stored through the media service."
                    >
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-800">Logo</p>
                                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Current logo" className="h-full w-full object-contain p-4" />
                                    ) : (
                                        <span className="text-xs text-slate-500">No logo uploaded</span>
                                    )}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {canUpload && (
                                        <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                            {logoUploading ? 'Uploading…' : 'Choose logo'}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="sr-only"
                                                disabled={logoUploading}
                                                onChange={(event) => chooseImage(event, 'logo')}
                                            />
                                        </label>
                                    )}
                                    {logoPreview && (
                                        <AdminButton variant="ghost" onClick={() => removeImage('logo')}>
                                            Remove
                                        </AdminButton>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Recommended: PNG or WebP, up to 5 MB. JPEG, PNG, and WebP are accepted.
                                </p>
                                {(logoError ?? errors.logo_media_id) && (
                                    <p className="mt-1 text-xs font-medium text-red-600">
                                        {logoError ?? errors.logo_media_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-800">Favicon</p>
                                <div className="flex aspect-square w-full max-w-56 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    {faviconPreview ? (
                                        <img src={faviconPreview} alt="Current favicon" className="h-full w-full object-contain p-8" />
                                    ) : (
                                        <span className="text-xs text-slate-500">No favicon uploaded</span>
                                    )}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {canUpload && (
                                        <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                            {faviconUploading ? 'Uploading…' : 'Choose favicon'}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="sr-only"
                                                disabled={faviconUploading}
                                                onChange={(event) => chooseImage(event, 'favicon')}
                                            />
                                        </label>
                                    )}
                                    {faviconPreview && (
                                        <AdminButton variant="ghost" onClick={() => removeImage('favicon')}>
                                            Remove
                                        </AdminButton>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Recommended: square PNG or WebP, up to 5 MB.
                                </p>
                                {(faviconError ?? errors.favicon_media_id) && (
                                    <p className="mt-1 text-xs font-medium text-red-600">
                                        {faviconError ?? errors.favicon_media_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2">
                                <FormField label="Primary color" error={errors.primary_color}>
                                    {(props) => (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={form.data.primary_color}
                                                onChange={(event) => form.setData('primary_color', event.target.value)}
                                                className="h-10 w-14 cursor-pointer rounded border border-slate-300"
                                                aria-label="Primary color picker"
                                            />
                                            <TextInput
                                                {...props}
                                                value={form.data.primary_color}
                                                onChange={(event) => form.setData('primary_color', event.target.value)}
                                            />
                                        </div>
                                    )}
                                </FormField>
                                <FormField label="Accent color" error={errors.accent_color}>
                                    {(props) => (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={form.data.accent_color}
                                                onChange={(event) => form.setData('accent_color', event.target.value)}
                                                className="h-10 w-14 cursor-pointer rounded border border-slate-300"
                                                aria-label="Accent color picker"
                                            />
                                            <TextInput
                                                {...props}
                                                value={form.data.accent_color}
                                                onChange={(event) => form.setData('accent_color', event.target.value)}
                                            />
                                        </div>
                                    )}
                                </FormField>
                            </div>
                        </div>
                    </SectionCard>
                </fieldset>

                <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <AdminButton variant="ghost" onClick={resetForm} disabled={form.processing}>
                        Reset
                    </AdminButton>
                    <AdminButton type="submit" disabled={!canManage || form.processing}>
                        {form.processing ? 'Saving…' : 'Save settings'}
                    </AdminButton>
                </div>
            </form>
        </AdminLayout>
    );
}
