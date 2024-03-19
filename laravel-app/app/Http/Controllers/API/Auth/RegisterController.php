<?php

namespace App\Http\Controllers\API\Auth;

use App\Constants\AuthConstants;
use App\Events\UserRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Traits\HttpResponses;
use App\Models\Preference;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    use HttpResponses;

    /**
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $input = $request->validated(); // Doğrulanmış verileri al
        $input['password'] = bcrypt($input['password']); // Şifreyi hash'le
        $user = User::create($input); // Kullanıcıyı oluştur
    
        $success['token'] = $user->createToken('MyApp')->plainTextToken; // Token oluştur
        $success['name'] = $user->name; // Kullanıcı adını yanıta ekle
    
        event(new UserRegistered($user)); // Kullanıcı kayıt event'ini tetikle
    
        // Kullanıcı tercihlerini oluştur veya güncelle
        Preference::updateOrCreate(
            ['user_id' => $user->id],
            $request->only(['preferences']) // Tercihleri almak için gerekli alanları buraya ekleyin
        );
    
        return $this->success($success, AuthConstants::REGISTER); // Başarılı yanıt döndür
    }
    
}
