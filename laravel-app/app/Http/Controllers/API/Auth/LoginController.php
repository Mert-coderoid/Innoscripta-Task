<?php

namespace App\Http\Controllers\API\Auth;

use App\Constants\AuthConstants;
use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Http\Traits\HttpResponses;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    use HttpResponses;

    /**
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function login(AuthRequest $request): JsonResponse
    {        
        // E-posta adresi geçerli bir format içeriyor mu kontrol et
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            // E-posta formatı geçersizse hata mesajı döndür
            return $this->error(['error' => 'Invalid Email'], 'The email address is invalid.', 422);
        }

        if (auth()->attempt($request->only(['email', 'password']))) {
            $user = auth()->user();

            $user->tokens()->delete();

            $success = $user->createToken('MyApp')->plainTextToken;

            // Başarılı giriş mesajını özelleştirme
            return $this->success(['token' => $success], 'User Login successfully.');
        } else {
            // Giriş bilgileri yanlışsa özel hata mesajı
            return $this->error(['error' => 'Unauthorized'], 'Login credentials are incorrect.', 401);
        }
    }
    /**
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        auth()->user()->tokens()->delete();

        return $this->success([], AuthConstants::LOGOUT);
    }

    /**
     * @return JsonResponse
     */
    public function details(): JsonResponse
    {
        $user = auth()->user();
        
        return $this->success(['user' => $user->toArray()], AuthConstants::USER_DETAILS);
    }

}
