<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Http\Resources\MediaResource;
use App\Services\AuditLogger;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function __construct(
        private readonly MediaService $media,
        private readonly AuditLogger $audit,
    ) {}

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $media = $this->media->store(
            $request->file('file'),
            $request->validated('purpose'),
            $request->user()
        );

        $this->audit->record('media.uploaded', $media, [
            'purpose' => $media->purpose,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
        ]);

        return (new MediaResource($media))->response()->setStatusCode(201);
    }
}
