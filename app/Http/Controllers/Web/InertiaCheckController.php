<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class InertiaCheckController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('InertiaCheck', [
            'message' => 'Laravel + Inertia + React are wired up.',
            'checkedAt' => now()->toIso8601String(),
        ]);
    }
}

