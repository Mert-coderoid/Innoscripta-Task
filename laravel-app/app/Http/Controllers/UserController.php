<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function updatePreferences(Request $request, User $user)
    {
        $preferences = $user->preferences;

        $preferences->sources = $request->sources;
        $preferences->categories = $request->categories;
        $preferences->authors = $request->authors;

        $preferences->save();

        return response()->json(['message' => 'Preferences updated successfully']);
    }

    public function getPreferences(User $user)
    {
        return response()->json($user->preferences);
    }

    public function personalizedFeed(Request $request, User $user)
    {
        $preferences = $user->preferences;

        $query = Article::query();

        if ($preferences->sources) {
            $query->whereIn('source_id', $preferences->sources);
        }

        if ($preferences->categories) {
            $query->whereIn('category_id', $preferences->categories);
        }

        if ($preferences->authors) {
            $query->whereIn('author_id', $preferences->authors);
        }

        $articles = $query->paginate(15);

        return response()->json($articles);
    }

}
