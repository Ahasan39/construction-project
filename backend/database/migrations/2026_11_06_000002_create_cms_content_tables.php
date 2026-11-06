<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_services', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 120);
            $table->string('slug', 120)->unique();
            $table->string('tagline', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('hero_image', 255)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('display_order')->default(0);
            $table->json('variants')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_locations', function (Blueprint $table): void {
            $table->id();
            $table->string('city', 120);
            $table->string('state', 10);
            $table->string('slug', 120)->unique();
            $table->string('region', 120)->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('address', 255)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('display_order')->default(0);
            $table->json('service_areas')->nullable();
            $table->json('supported_services')->nullable();
            $table->timestamps();
        });

        Schema::create('cms_galleries', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 255);
            $table->string('category', 80)->index();
            $table->string('location', 120)->nullable();
            $table->string('image_url', 255);
            $table->string('before_image_url', 255)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cms_articles', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body_html');
            $table->string('category', 80)->index();
            $table->string('thumbnail_url', 255)->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamp('published_at')->nullable();
            $table->string('author_name', 120)->nullable();
            $table->timestamps();
        });

        Schema::create('cms_testimonials', function (Blueprint $table): void {
            $table->id();
            $table->string('author', 120);
            $table->string('city_state', 120);
            $table->integer('rating')->default(5);
            $table->string('service', 80)->nullable();
            $table->text('body');
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cms_seo_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('route_pattern', 255)->unique();
            $table->string('title', 255);
            $table->text('meta_description')->nullable();
            $table->string('canonical_url', 255)->nullable();
            $table->string('og_title', 255)->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image', 255)->nullable();
            $table->string('twitter_title', 255)->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image', 255)->nullable();
            $table->json('schema_json')->nullable();
            $table->boolean('is_noindex')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_seo_settings');
        Schema::dropIfExists('cms_testimonials');
        Schema::dropIfExists('cms_articles');
        Schema::dropIfExists('cms_galleries');
        Schema::dropIfExists('cms_locations');
        Schema::dropIfExists('cms_services');
    }
};
