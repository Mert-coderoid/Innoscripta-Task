<?php

namespace App\Http\Controllers;

use App\Services\GuardianService;
use App\Services\NewsAPIService;
use App\Services\TimesService;
use App\Services\ArticleLocationService;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Article;

class ArticleController extends Controller
{
    public function fetchArticles(NewsAPIService $newsAPIService, TimesService $timesService, GuardianService $guardianService): JsonResponse
    {
        try {
            $guardianService->getPopularArticles();
            $newsAPIService->fetchArticles();
            $timesService->getMostPopularArticles();

            return response()->json(['message' => 'Articles fetched successfully'] , 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getLocations(ArticleLocationService $articleLocationService): JsonResponse
    {
        try {
            $articleLocationService->updateArticleLocations();
            return response()->json(['message' => 'Locations updated successfully'] , 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getArticles(): JsonResponse
    {
        $articles = Article::paginate(15);
        return response()->json($articles);
    }

    public function searchArticles(Request $request): JsonResponse
    {
        $query = Article::query();

        if ($request->keyword) {
            $query->where('title', 'LIKE', '%' . $request->keyword . '%')
                ->orWhere('content', 'LIKE', '%' . $request->keyword . '%')
                ->orWhere('keywords', 'LIKE', '%' . $request->keyword . '%');
        }

        $articles = $query->paginate(15);
        return response()->json($articles);
    }

    public function filterArticles(Request $request): JsonResponse
    {
        $query = Article::query();

        if ($request->has('has_image')) {
            if ($request->has_image === 'yes') {
                $query->whereNotNull('image_url')->where('image_url', '<>', '');
            } elseif ($request->has_image === 'no') {
                $query->whereNull('image_url')->orWhere('image_url', '=', '');
            }
        }
    
        if ($request->keyword) {
            $query->where(function ($query) use ($request) {
                $query->where('title', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('content', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->keyword . '%');
            });
        }
    
        if ($request->category) {
            $query->where('category', $request->category);
        }
    
        if ($request->sources) {
            $sources = explode(',', $request->sources);
            $query->whereIn('source', $sources);
        }
    
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('published_at', [$request->start_date, $request->end_date]);
        }
    
        $sortOrder = strtolower($request->sort_order ?? 'desc');
        $sortBy = $request->sort_by ?? 'published_at'; 
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $query->orderBy($sortBy, $sortOrder);
        $articles = $query->paginate(15);
        return response()->json($articles);
    }
    

    public function getLocationArticles(): JsonResponse
    {
        $articles = Article::whereNotNull('latitude')->whereNotNull('longitude')->select('id', 'title', 'location', 'latitude', 'longitude')->get();
        return response()->json($articles);
    }

    public function testServices(NewsAPIService $newsAPIService, TimesService $timesService, GuardianService $guardianService): JsonResponse
    {
        try {
            $timesService->getMostPopularArticles();
            $guardianService->getPopularArticles();
            $newsAPIService->fetchArticles();

            return response()->json(['message' => 'Articles fetched successfully'] , 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getSources(): JsonResponse
    {
        $sources = Article::select('source')->distinct()->get();
        return response()->json($sources);
    }

    public function getCategories(): JsonResponse
    {
        $categories = Article::select('category')->distinct()->get();
        return response()->json($categories);
    }
}
