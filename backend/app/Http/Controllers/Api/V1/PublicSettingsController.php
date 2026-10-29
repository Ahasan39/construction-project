<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class PublicSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return (new SiteSettingResource(SiteSetting::current()))
            ->response()
            ->setStatusCode(200);
    }
}
