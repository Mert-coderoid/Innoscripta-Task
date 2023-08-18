<?php


namespace App\Services;

use App\Models\Article;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class TimesService
{
    private Client $client;
    private mixed $apiKey;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'https://api.nytimes.com/svc/']);
        $this->apiKey = env('NYT_API_KEY'); // .env dosyasından API anahtarını alın
    }

    /**
     * @throws Exception
     */
    public function getMostPopularArticles($days = 1)
    {
        $endpoint = "mostpopular/v2/viewed/$days.json";

//        istek atılan url: https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=NYT_API_KEY
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
                'publishedAt' => $articleData['published_date'],
                'category' => $category,
                'keywords' => $keywords,
                'content' => '',
            ];

            Article::createOrUpdate($article);
        }

        return $articles;
    }

    // Diğer NYT API endpoint'leriyle etkileşime girecek diğer yöntemler burada olabilir.
}
