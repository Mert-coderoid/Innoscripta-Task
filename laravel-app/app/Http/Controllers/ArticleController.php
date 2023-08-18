<?php

namespace App\Http\Controllers;

use App\Services\GuardianService;
use App\Services\NewsAPIService;
use App\Services\TimesService;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Article;


class ArticleController extends Controller
{
    // CRON JOB İÇİN KULLANILAN METOD
    public function fetchArticles(NewsAPIService $newsAPIService, TimesService $timesService, GuardianService $guardianService): JsonResponse
    {
        try {
            $timesService->getMostPopularArticles();
            $guardianService->getPopularArticles();
            $newsAPIService->fetchArticles();

            return response()->json(['message' => 'Articles fetched successfully'] , 200);
        } catch (\Exception $e) {
            // LOG ERROR
//            \Log::error('An error occurred while fetching articles: ' . $e->getMessage());
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

        // Anahtar kelime araması
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

        // Anahtar kelime araması
        if ($request->keyword) {
            $query->where(function ($query) use ($request) {
                $query->where('title', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('content', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->keyword . '%');
            });
        }

        // Kategoriye göre filtreleme
        if ($request->category) {
            $query->where('category', $request->category);
        }

        // Kaynaklara göre filtreleme
        if ($request->sources) {
            $sources = explode(',', $request->sources); // Virgülle ayrılmış dizgeyi diziye dönüştürün
            $query->whereIn('source', $sources);
        }

        // Tarih aralığına göre filtreleme
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('published_at', [$request->start_date, $request->end_date]);
        }

        // Sıralama
        if ($request->sort_by) {
            $sortOrder = strtolower($request->sort_order ?? 'desc');
            if (!in_array($sortOrder, ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }
            $query->orderBy($request->sort_by, $sortOrder);
        }


        $articles = $query->paginate(15);

        return response()->json($articles);
    }
//    örnek istek: process.env.REACT_APP_BASE_URL+'/api/filter-articles?keyword=corona&category=U.S.&sources=New York Times&start_date=2023-08-11&end_date=2023-08-13&sort_by=published_at&sort_order=desc

    public function testServices(NewsAPIService $newsAPIService, TimesService $timesService, GuardianService $guardianService): JsonResponse
    {
        try {
            $timesService->getMostPopularArticles();
            $guardianService->getPopularArticles();
            $newsAPIService->fetchArticles();

            return response()->json(['message' => 'Articles fetched successfully'] , 200);
        } catch (\Exception $e) {
            // LOG ERROR
//            \Log::error('An error occurred while fetching articles: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

//    veri tabanından kaynakları çekmek için kullanılan metod
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
