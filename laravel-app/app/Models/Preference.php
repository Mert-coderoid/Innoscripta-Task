<?php

//public function up()
//{
//    Schema::create('preferences', function (Blueprint $table) {
//        $table->bigIncrements('id');
//        $table->unsignedBigInteger('user_id');
//        $table->string('sources', 2000)->default('[]');
//        $table->string('categories', 2000)->default('[]');
//        $table->string('keywords', 2000)->default('[]');
//        $table->string('authors', 2000)->default('[]');
//        $table->timestamps();
//
//        $table->foreign('user_id')->references('id')->on('users');
//    });

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Preference extends Model
{
    use HasFactory;

    protected $casts = [
        'sources' => 'json',
        'categories' => 'json',
        'authors' => 'json',
    ];

    protected $fillable = [
        'user_id',
        'sources',
        'categories',
        'keywords',
        'authors',
    ];

    public function updatePreferences(Request $request)
    {
        // Veri doğrulama işlemi burada yapılmalıdır.
        $request->validate([
            'sources' => 'required|array',
            'categories' => 'required|array',
            'keywords' => 'required|array',
            'authors' => 'required|array',
        ]);

        if (count($request->sources) > 20) {
            return response()->json('You can select up to 20 sources');
        }

        $preferences = Preference::updateOrCreate(
            ['user_id' => auth()->user()->id],
            $request->only('sources', 'categories', 'keywords', 'authors')
        );

        return response()->json('Preferences updated successfully');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getSourcesAttribute($value)
    {
        return json_decode($value);
    }

    public function getCategoriesAttribute($value)
    {
        return json_decode($value);
    }
}
