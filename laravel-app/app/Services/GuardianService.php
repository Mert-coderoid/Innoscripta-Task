<?php

namespace App\Services;

use App\Models\Article;
use Carbon\Carbon;
use GuzzleHttp\Client;

class GuardianService
{
    private Client $client;
    private mixed $apiKey;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'https://content.guardianapis.com/']);
        $this->apiKey = env('GUARDIAN_API_KEY');
    }

    public function getPopularArticles($section = 'world', $order = 'relevance', $pageSize = 10)
    {
        $endpoint = "search";
        $query = [
            'api-key' => $this->apiKey,
            'section' => $section,
            'order-by' => $order,
            'page-size' => $pageSize,
        ];

        $response = $this->client->get($endpoint, ['query' => $query]);

        $articles = json_decode($response->getBody(), true);

        foreach ($articles['response']['results'] as $articleData) {
            // Tarih-saat formatını düzeltilmiş hali
            $publishedAtFormatted = Carbon::parse($articleData['webPublicationDate'])->format('Y-m-d H:i:s');
            
            $article = [
                'source' => $articleData['sectionName'],
                'published_at' => $publishedAtFormatted, // Düzeltme yapıldı
                'url' => $articleData['webUrl'],
                'image_url' => '',
                'description' => '',
                'author' => '',
                'title' => $articleData['webTitle'],
                'category' => $articleData['pillarName'],
                'keywords' => '',
                'content' => '', // Varsa içeriği de ekleyin
            ];

            Article::updateOrCreate(
                ['url' => $article['url']], // URL'ye göre kontrol et
                $article // Eğer yoksa oluşturulacak veya güncellenecek alanlar
            );
        }
        return $articles['response']['results'];
    }
}
