<?php

//    #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
//1	id Primary	bigint(20)		UNSIGNED	No	None		AUTO_INCREMENT	Change Change	Drop Drop
//2	title	varchar(255)	utf8mb4_unicode_ci		No	None			Change Change	Drop Drop
//3	description	text	utf8mb4_unicode_ci		No	' '			Change Change	Drop Drop
//4	author	varchar(255)	utf8mb4_unicode_ci		Yes	NULL			Change Change	Drop Drop
//5	source	varchar(255)	utf8mb4_unicode_ci		No	None			Change Change	Drop Drop
//6	category	varchar(1000)	utf8mb4_general_ci		No				Change Change	Drop Drop
//7	keywords	varchar(1000)	utf8mb4_general_ci		No				Change Change	Drop Drop
//8	url Index	varchar(255)	utf8mb4_unicode_ci		Yes	NULL			Change Change	Drop Drop
//9	image_url	varchar(1000)	utf8mb4_unicode_ci		Yes	NULL			Change Change	Drop Drop
//10	created_at	timestamp			Yes	NULL			Change Change	Drop Drop
//11	updated_at	timestamp			Yes	NULL			Change Change	Drop Drop
//12	published_at	timestamp			Yes	NULL			Change Change	Drop Drop

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
        'content'
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
        ]);
    }

}
