<?php

namespace App\Services;

use App\Models\Article;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Carbon\Carbon;

class TimesService
{
    private Client $client;
    private mixed $apiKey;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'https://api.nytimes.com/svc/']);
        $this->apiKey = env('NYT_API_KEY'); 
    }

    /**
     * @throws Exception
     */
    public function getMostPopularArticles($days = 1)
    {
        $endpoint = "mostpopular/v2/viewed/$days.json";
        
        try {
            $response = $this->client->get($endpoint, [
                'query' => ['api-key' => $this->apiKey]
            ]);
        } catch (GuzzleException $e) {
            throw new Exception('An error occurred while fetching articles: ' . $e->getMessage());
        }

        $data = json_decode($response->getBody(), true);
        $articles = $data['results'];

        foreach ($articles as $articleData) {
            $media = $articleData['media'][0] ?? null;
            $image_url = $media && isset($media['media-metadata'][2]['url']) ? $media['media-metadata'][2]['url'] : '';
            $category = $articleData['section'];
            $keywords = $articleData['adx_keywords'] ?? '';
            $article = [
                'title' => $articleData['title'],
                'description' => $articleData['abstract'],
                'author' => $articleData['byline'],
                'source' => $articleData['source'],
                'url' => $articleData['url'],
                'image_url' => $image_url,
                'published_at' => Carbon::parse($articleData['published_date'])->format('Y-m-d H:i:s'),
                'category' => $category,
                'keywords' => $keywords,
                'content' => '',
            ];

            Article::updateOrCreate(
                ['url' => $article['url']],
                $article
            );
        }

        return $articles;
    }
    
}
