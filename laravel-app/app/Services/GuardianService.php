<?php

namespace App\Services;

use App\Models\Article;
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

        foreach ($articles['response']['results'] as $article) {
            $article['source'] = $article['sectionName'];
            $article['publishedAt'] = $article['webPublicationDate'];
            $article['url'] = $article['webUrl'];
            $article['image_url'] = '';
            $article['description'] = '';
            $article['author'] = '';
            $article['title'] = $article['webTitle'];
            $article['category'] = $article['pillarName'];
            $article['keywords'] = '';

            Article::createOrUpdate($article);
        }
        return $articles['response']['results'];
    }

}
