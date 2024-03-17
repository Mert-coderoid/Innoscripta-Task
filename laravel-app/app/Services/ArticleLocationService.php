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
    }

    public function updateArticleLocations(): void
    {
        $articles = Article::whereNull('latitude')->orWhereNull('longitude')->get();

        if ($articles->isEmpty()) {
            return;
        }

        $articlesData = $articles->map(function ($article) {
            $text = $article->content ?: $article->title;
            return [
                'id' => $article->id,
                'text' => $text,
            ];
        })->toArray();

        try {
            $response = $this->client->post('/extract-locations-batch', [
                'json' => ['articles' => $articlesData],
            ]);

            $locations = json_decode($response->getBody()->getContents(), true);

            foreach ($locations['results'] as $locationData) {
                $article = Article::find($locationData['article']['id']);
                if (!empty($locationData['locations']) && $article) {
                    $firstLocation = current($locationData['locations']);
                    $article->latitude = $firstLocation['coordinates']['latitude'];
                    $article->longitude = $firstLocation['coordinates']['longitude'];
                    $article->location = $firstLocation['place'];
                    $article->save();
                }
            }
        } catch (GuzzleException $e) {
            // Log or handle the error as required
            \Log::error("Error updating article locations: " . $e->getMessage());
        }
    }
}
