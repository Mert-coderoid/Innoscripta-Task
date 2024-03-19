<?php

namespace App\Services;

use GuzzleHttp\Client;
use App\Models\Article;
use GuzzleHttp\Exception\GuzzleException;

class ArticleLocationService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'http://flask-app:5000']);
        // $this->client = new Client(['base_uri' => 'http://localhost:5000']);
    }

    public function updateArticleLocations(): bool
{
    try {
        // Only select articles that have not been processed yet
        $articles = Article::where('location_updated', false)->get();
                            // ->where(function ($query) {
                            //     $query->whereNull('latitude')
                            //           ->orWhereNull('longitude');
                            // })->get();
                            
                            // dd($articles);
        if ($articles->isEmpty()) {
            return false;
        }

        $articlesData = $articles->map(function ($article) {
            return [
                'id' => $article->id,
                'text' => $article->content ?: $article->title,
            ];
        })->toArray();

        $response = $this->client->post('/extract-locations-batch', [
            'json' => ['articles' => $articlesData],
        ]);

        $locations = json_decode($response->getBody()->getContents(), true);

        foreach ($articles as $article) {
            $locationData = collect($locations['results'])->firstWhere('article.id', $article->id);
            
            if ($locationData && !empty($locationData['locations'])) {
                $firstLocation = reset($locationData['locations']);
                $article->latitude = $firstLocation['coordinates']['latitude'] ?? null;
                $article->longitude = $firstLocation['coordinates']['longitude'] ?? null;
                $article->location = $firstLocation['place'] ?? null;
                $article->location_updated = true;
            }

            $article->location_updated = true;
            $article->save();
        }

        return true;
    } catch (GuzzleException $e) {
        throw new \Exception('Error updating article locations: ' . $e->getMessage());
    }
}


}
