<?php

namespace App\Services;

use GuzzleHttp\Client;
use App\Models\Article;

class NewsAPIService
{
    public function fetchArticles(): void
    {
        $client = new Client();
        $apiKey = env('NEWS_API_KEY');
        $response = $client->get('https://newsapi.org/v2/top-headlines?country=us&apiKey=' . $apiKey);
        $articles = json_decode($response->getBody(), true);
        $this->saveArticles($articles['articles']);
    }

    private function saveArticles(array $articles): void
    {
        try {
            foreach ($articles as $article) {
                $article['source'] = $article['source']['name'];
                $article['published_at'] = $article['publishedAt'];
                $article['image_url'] = $article['urlToImage'];
                $article['category'] = '';

                $result = Article::createOrUpdate($article);
            }
        } catch (\Exception $e) {
            // LOG ERROR
//            \Log::error('An error occurred while fetching articles: ' . $e->getMessage());
        }
    }
}
