<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

trait HttpResponses
{
    /**
     * Başarılı yanıt için yardımcı metod.
     *
     * @param array $data Yanıt verileri.
     * @param string|null $message Yanıt mesajı.
     * @param int $code HTTP durum kodu.
     * @return JsonResponse
     */
    protected function success(array $data, string $message = null, int $code = ResponseAlias::HTTP_OK): JsonResponse
    {
        return response()->json([
            'status' => 'success', // Başarılı yanıtlar için 'success' durumu
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Hatalı yanıt için yardımcı metod.
     *
     * @param array $data Yanıt verileri.
     * @param string|null $message Yanıt mesajı.
     * @param int $code HTTP durum kodu.
     * @return JsonResponse
     */
    protected function error(array $data, string $message = null, int $code = ResponseAlias::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'status' => 'error', // Hatalı yanıtlar için 'error' durumu
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
