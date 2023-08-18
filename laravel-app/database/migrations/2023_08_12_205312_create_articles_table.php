<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
        public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 1000);
            $table->text('description')->nullable();
            $table->string('author', 1000)->default('');
            $table->string('source', 1000);
            $table->string('category', 1000)->default('');
            $table->string('keywords', 1000)->default('');
            $table->string('url')->unique();
            $table->string('image_url', 1000)->default('');
            $table->timestamps();
            $table->timestamp('published_at')->useCurrent();
            $table->text('content')->nullable();
        });
    }

        public function down()
    {
        Schema::dropIfExists('articles');
    }

};
