<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function show(): JsonResponse
    {
        try {
            DB::select('select 1');
            $database = 'ok';
            $status = 200;
        } catch (Throwable) {
            $database = 'unavailable';
            $status = 503;
        }

        return response()->json([
            'status' => $status === 200 ? 'ok' : 'degraded',
            'database' => $database,
            'timestamp' => now()->toIso8601String(),
        ], $status);
    }
}
