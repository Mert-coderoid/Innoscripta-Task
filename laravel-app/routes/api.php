<?php

use App\Http\Controllers\API\Auth\LoginController;
use App\Http\Controllers\API\Auth\RegisterController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PreferenceController;
use Illuminate\Support\Facades\Route;

Route::post('login', [LoginController::class, 'login']);
Route::post('register', RegisterController::class);

Route::get('search-articles', [ArticleController::class, 'searchArticles']);
Route::get('articles', [ArticleController::class, 'getArticles']);
Route::get('search-articles', [ArticleController::class, 'searchArticles']);
Route::get('filter-articles', [ArticleController::class, 'filterArticles']);
Route::get('location-articles', [ArticleController::class, 'getLocationArticles']);


Route::group(['middleware' => 'api.auth'], function () {
    Route::get('user', [LoginController::class, 'details']);
    Route::post('user', [LoginController::class, 'updateUser']);
    Route::get('logout', [LoginController::class, 'logout']);
    Route::get('preferences', [PreferenceController::class, 'getPreferences']);
    Route::post('preferences', [PreferenceController::class, 'updatePreferences']);
    Route::get('personalized-articles', [PreferenceController::class, 'getPersonalizedArticles']);
    route::post('user-update', [PreferenceController::class, 'updateUser']);
    Route::post('change-password', [PreferenceController::class, 'changePassword']);
});

Route::get('sources', [ArticleController::class, 'getSources']);
Route::get('categories', [ArticleController::class, 'getCategories']);

Route::get('test-services', [ArticleController::class, 'testServices']);
Route::get('fetch-articles', [ArticleController::class, 'fetchArticles']);
Route::get('get-locations', [ArticleController::class, 'getLocations']);
