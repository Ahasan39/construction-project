<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditLogger
{
    /**
     * Record a privileged action. Metadata is redacted defensively so a caller
     * cannot accidentally persist passwords, tokens, or authorization headers.
     *
     * @param  array<string, mixed>  $metadata
     */
    public function record(string $action, ?Model $subject = null, array $metadata = [], ?User $actor = null): AuditLog
    {
        $request = request();
        $user = $actor ?? $request?->user();

        return AuditLog::create([
            'user_id' => $user?->getKey(),
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'metadata' => $metadata === [] ? null : $this->redact($metadata),
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function redact(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->redact($value);

                continue;
            }

            if (preg_match('/password|token|secret|authorization|api[_-]?key/i', (string) $key) === 1) {
                $data[$key] = '[redacted]';
            }
        }

        return $data;
    }
}
