<?php


////public function up()
////{
////    Schema::create('preferences', function (Blueprint $table) {
////        $table->bigIncrements('id');
////        $table->unsignedBigInteger('user_id');
////        $table->string('sources', 2000)->default('[]');
////        $table->string('categories', 2000)->default('[]');
////        $table->string('keywords', 2000)->default('[]');
////        $table->string('authors', 2000)->default('[]');
////        $table->timestamps();
////
////        $table->foreign('user_id')->references('id')->on('users');
////    });
//
//namespace App\Models;
//
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//
//class Preference extends Model
//{
//    use HasFactory;
//
//    protected $casts = [
//        'sources' => 'json',
//        'categories' => 'json',
//        'authors' => 'json',
//    ];
//
//    protected $fillable = [
//        'user_id',
//        'sources',
//        'categories',
//        'keywords',
//        'authors',
//    ];
//
//    public function updatePreferences(Request $request)
//    {
//        // Veri doğrulama işlemi burada yapılmalıdır.
//        $request->validate([
//            'sources' => 'required|array',
//            'categories' => 'required|array',
//            'keywords' => 'required|array',
//            'authors' => 'required|array',
//        ]);
//
//        if (count($request->sources) > 20) {
//            return response()->json('You can select up to 20 sources');
//        }
//
//        $preferences = Preference::updateOrCreate(
//            ['user_id' => auth()->user()->id],
//            $request->only('sources', 'categories', 'keywords', 'authors')
//        );
//
//        return response()->json('Preferences updated successfully');
//    }
//
//    public function user()
//    {
//        return $this->belongsTo(User::class);
//    }
//
//    public function getSourcesAttribute($value)
//    {
//        return json_decode($value);
//    }
//
//    public function getCategoriesAttribute($value)
//    {
//        return json_decode($value);
//    }
//
//}


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Preference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\ChangePasswordRequest;

class PreferenceController extends Controller
{
    public function updatePreferences(Request $request)
    {
        $preferences = Preference::updateOrCreate(
            ['user_id' => auth()->user()->id],
            $request->all()
        );

        return response()->json($preferences);
    }

    public function getPreferences()
    {
        $preferences = Preference::where('user_id', auth()->user()->id)->first();

        if (!$preferences) {
            return response()->json(['error' => 'Preferences not found for user'], 404);
        }

        return response()->json($preferences);
    }

    public function getPersonalizedArticles(Request $request)
    {
        $preferences = Preference::where('user_id', auth()->user()->id)->first();

        if (!$preferences) {
            return response()->json(['error' => 'Preferences not found for user'], 404);
        }

        // JSON decode sonuçlarını kontrol ederek null değerleri boş dizilerle değiştir
        $preferences->sources = is_string($preferences->sources) ? json_decode($preferences->sources, true) : $preferences->sources;
        $preferences->categories = is_string($preferences->categories) ? json_decode($preferences->categories, true) : $preferences->categories;
        $preferences->keywords = is_string($preferences->keywords) ? json_decode($preferences->keywords, true) : $preferences->keywords;
        $preferences->authors = is_string($preferences->authors) ? json_decode($preferences->authors, true) : $preferences->authors;


        $query = Article::query();

        $query->where(function($q) use ($preferences) {
            $q->whereIn('category', $preferences->categories)
                ->orWhereIn('source', $preferences->sources)
                ->orWhereIn('author', $preferences->authors);
        });

        if ($request->keyword) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('content', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->keyword . '%');
            });
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('published_at', [$request->start_date, $request->end_date]);
        }


        if ($request->category) {
            $query->whereIn('category', (array) $request->category);  // use whereIn to cater for arrays
        }

        if ($request->sources) {
            $query->whereIn('source', (array) $request->sources);  // use whereIn to cater for arrays
        }

        $articles = $query->paginate(15);
        return response()->json($articles);
    }

    public function searchArticles(Request $request)
    {
        $query = Article::query();

        // If you need to fetch user preferences, uncomment and use the below:
        // $preferences = Preference::where('user_id', auth()->user()->id)->first();
        // If not, remove any references to $preferences

        if (isset($preferences) && !empty($preferences->categories)) {
            $query->whereIn('category', $preferences->categories);
        }

        if (isset($preferences) && !empty($preferences->sources)) {
            $query->orWhereIn('source', $preferences->sources);
        }

        if (isset($preferences) && !empty($preferences->authors)) {
            $query->orWhereIn('author', $preferences->authors);
        }

        if ($request->keyword) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('content', 'LIKE', '%' . $request->keyword . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->keyword . '%');
            });
        }

        if ($request->date_from && $request->date_to) {
            $query->whereBetween('published_at', [$request->date_from, $request->date_to]);
        }

        if ($request->category) {
            $query->whereIn('category', (array) $request->category);
        }

        if ($request->source) {
            $query->whereIn('source', (array) $request->source);
        }

        $articles = $query->paginate(15);
        return response()->json($articles);
    }

//    kullanıcı bilgilerini güncellemek için kullanılan metod
    public function updateUser(Request $request)
    {
        $user = auth()->user();
        $user->update($request->all());

        return response()->json($user);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        if (auth()->attempt(['email' => auth()->user()->email, 'password' => $request->old_password])) {
            $user = auth()->user();
            $user->update(['password' => bcrypt($request->password)]);

            return response()->json($user);
        } else {
            return response()->json(['error' => 'Old password is incorrect'], 401);
        }
    }
}
