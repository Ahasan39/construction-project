<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Throwable;

class MediaService
{
    public function __construct(private readonly ImageSanitizer $sanitizer) {}

    public function store(UploadedFile $file, string $purpose, ?User $uploader = null): Media
    {
        try {
            $sanitized = $this->sanitizer->sanitize($file->getRealPath());
        } catch (InvalidArgumentException $exception) {
            throw ValidationException::withMessages(['file' => $exception->getMessage()]);
        }

        $path = 'uploads/'.$purpose.'/'.Str::uuid().'.'.$sanitized['extension'];
        $disk = 'public';

        Storage::disk($disk)->put($path, $sanitized['binary']);

        try {
            return Media::create([
                'disk' => $disk,
                'path' => $path,
                'original_name' => mb_substr(basename($file->getClientOriginalName()), 0, 255),
                'mime_type' => $sanitized['mime_type'],
                'extension' => $sanitized['extension'],
                'size' => strlen($sanitized['binary']),
                'width' => $sanitized['width'],
                'height' => $sanitized['height'],
                'checksum' => hash('sha256', $sanitized['binary']),
                'purpose' => $purpose,
                'uploaded_by' => $uploader?->getKey(),
            ]);
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($path);

            throw $exception;
        }
    }
}
