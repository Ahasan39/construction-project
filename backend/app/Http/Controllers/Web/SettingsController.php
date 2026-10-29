<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Services\SiteSettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(private readonly SiteSettingService $settings) {}

    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/General', [
            'settings' => (new SiteSettingResource(SiteSetting::current()))->resolve(),
        ]);
    }

    public function update(SettingsUpdateRequest $request): RedirectResponse
    {
        $this->settings->update($request->validated());

        return back()->with('status', 'General settings saved.');
    }
}
