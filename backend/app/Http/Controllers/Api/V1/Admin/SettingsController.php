<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Services\SiteSettingService;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function __construct(private readonly SiteSettingService $settings) {}

    public function show(): JsonResponse
    {
        return (new SiteSettingResource(SiteSetting::current()))
            ->response()
            ->setStatusCode(200);
    }

    public function update(SettingsUpdateRequest $request): JsonResponse
    {
        $settings = $this->settings->update($request->validated());

        return (new SiteSettingResource($settings->refresh()))
            ->response()
            ->setStatusCode(200);
    }
}
