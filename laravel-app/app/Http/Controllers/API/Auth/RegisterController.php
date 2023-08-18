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
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('MyApp')->plainTextToken;
        $success['name'] = $user->name;

        event(new UserRegistered($user));

        $preferences = Preference::updateOrCreate(
            ['user_id' => $user->id],  // Burada yeni oluşturduğumuz kullanıcının ID'sini kullanıyoruz.
            $request->all()
        );
        return $this->success($success, AuthConstants::REGISTER);
    }
}
