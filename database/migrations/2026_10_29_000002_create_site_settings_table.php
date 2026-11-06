<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name', 160);
            $table->text('short_description')->nullable();
            $table->string('website_url', 255)->nullable();
            $table->string('locale', 10)->default('en-US');
            $table->string('timezone', 64)->default('America/New_York');
            $table->string('default_cta', 80)->nullable();
            $table->json('business_hours')->nullable();
            $table->string('contact_number', 40)->nullable();
            $table->string('secondary_phone', 40)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_label', 160)->nullable();
            $table->string('estimate_destination', 255)->default('/free-estimate');
            $table->json('social_links')->nullable();
            $table->string('logo_path', 255)->nullable();
            $table->string('favicon_path', 255)->nullable();
            $table->string('primary_color', 7)->default('#0f2231');
            $table->string('accent_color', 7)->default('#d9232a');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
