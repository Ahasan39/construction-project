<?php

namespace App\Services;

use InvalidArgumentException;

class ImageSanitizer
{
    private const MAX_PIXELS = 24_000_000;

    private const MAX_DIMENSION = 4096;

    /**
     * Re-encode an uploaded image with GD so EXIF metadata and embedded
     * payloads are discarded. Returns the safe bytes and server-derived type.
     *
     * @return array{binary: string, mime_type: string, extension: string, width: int, height: int}
     */
    public function sanitize(string $path): array
    {
        $contents = @file_get_contents($path);

        if ($contents === false || $contents === '') {
            throw new InvalidArgumentException('The uploaded file could not be read.');
        }

        $info = @getimagesizefromstring($contents);

        if ($info === false) {
            throw new InvalidArgumentException('The uploaded file is not a valid image.');
        }

        [$width, $height, $type] = [(int) $info[0], (int) $info[1], (int) $info[2]];

        $types = [
            IMAGETYPE_JPEG => ['image/jpeg', 'jpg'],
            IMAGETYPE_PNG => ['image/png', 'png'],
            IMAGETYPE_WEBP => ['image/webp', 'webp'],
        ];

        if (! isset($types[$type])) {
            throw new InvalidArgumentException('Only JPEG, PNG, and WebP images are accepted.');
        }

        if ($width < 1 || $height < 1 || ($width * $height) > self::MAX_PIXELS) {
            throw new InvalidArgumentException('The image dimensions are not acceptable.');
        }

        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            throw new InvalidArgumentException('The uploaded image could not be decoded.');
        }

        if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_WEBP) {
            imagepalettetotruecolor($image);
        }

        if ($width > self::MAX_DIMENSION || $height > self::MAX_DIMENSION) {
            $scale = min(self::MAX_DIMENSION / $width, self::MAX_DIMENSION / $height);
            $targetWidth = max(1, (int) floor($width * $scale));
            $targetHeight = max(1, (int) floor($height * $scale));
            $scaled = imagescale($image, $targetWidth, $targetHeight, IMG_BICUBIC);

            if ($scaled === false) {
                imagedestroy($image);

                throw new InvalidArgumentException('The image could not be resized safely.');
            }

            imagedestroy($image);
            $image = $scaled;
            $width = $targetWidth;
            $height = $targetHeight;
        }

        if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_WEBP) {
            imagealphablending($image, false);
            imagesavealpha($image, true);
        }

        $temporary = tempnam(sys_get_temp_dir(), 'upload_');

        if ($temporary === false) {
            imagedestroy($image);

            throw new InvalidArgumentException('A temporary file could not be created.');
        }

        $written = match ($type) {
            IMAGETYPE_JPEG => imagejpeg($image, $temporary, 85),
            IMAGETYPE_PNG => imagepng($image, $temporary, 9),
            IMAGETYPE_WEBP => imagewebp($image, $temporary, 85),
            default => false,
        };

        imagedestroy($image);

        if ($written === false) {
            @unlink($temporary);

            throw new InvalidArgumentException('The image could not be re-encoded safely.');
        }

        $binary = file_get_contents($temporary);
        @unlink($temporary);

        if ($binary === false || $binary === '') {
            throw new InvalidArgumentException('The re-encoded image is empty.');
        }

        return [
            'binary' => $binary,
            'mime_type' => $types[$type][0],
            'extension' => $types[$type][1],
            'width' => $width,
            'height' => $height,
        ];
    }
}
