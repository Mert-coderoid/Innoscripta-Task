<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * @method static create(array $array)
 */
class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'author',
        'source',
        'url',
        'image_url',
        'published_at',
        'category',
        'keywords',
        'content',
        'latitude',
        'longitude',
        'location',
        'location_updated',
        'created_at',
        'updated_at',
        'published_at'
    ];

    public static function createOrUpdate(array $articleData)
    {
        $publishedAt = Carbon::parse($articleData['publishedAt'])->toDateTimeString();
        $description = $articleData['description'] ?? '';

        return self::create([
            'title' => $articleData['title'],
            'description' => $description,
            'author' => $articleData['author'],
            'source' => $articleData['source']['name'] ?? $articleData['source'],
            'url' => $articleData['url'],
            'image_url' => $articleData['urlToImage'] ?? $articleData['image_url'],
            'published_at' => $publishedAt,
            'category' => $articleData['category'] ?? '',
            'keywords' => $articleData['keywords'] ?? '',
            'content' => $articleData['content'] ?? '',
            'latitude' => $articleData['latitude'] ?? null,
            'longitude' => $articleData['longitude'] ?? null,
            'location' => $articleData['location'] ?? '',
            'location_updated' => $articleData['location_updated'] ?? null,
            'created_at' => Carbon::now()->toDateTimeString(),
            'updated_at' => Carbon::now()->toDateTimeString()
        ]);
    }

}
