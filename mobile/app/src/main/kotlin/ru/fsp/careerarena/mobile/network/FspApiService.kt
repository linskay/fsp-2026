package ru.fsp.careerarena.mobile.network

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import ru.fsp.careerarena.mobile.model.CandidateProfile
import ru.fsp.careerarena.mobile.model.MobileChatMessage
import ru.fsp.careerarena.mobile.model.Vacancy

/**
 * Retrofit клиент для обращения к Spring Boot 3 Backend платформы ФСП Карьера.
 */
interface FspApiService {

    @GET("candidates")
    suspend fun getCandidates(): List<CandidateProfile>

    @GET("candidates/{id}")
    suspend fun getCandidateById(@Path("id") id: String): CandidateProfile

    @GET("vacancies")
    suspend fun getVacancies(): List<Vacancy>

    @POST("mobile/chat/send")
    suspend fun sendChatMessage(@Body message: MobileChatMessage): MobileChatMessage

    companion object {
        // По умолчанию 10.0.2.2 для Android эмулятора, либо реальный адрес стенда
        private const val BASE_URL = "http://10.0.2.2:8080/api/v1/"

        fun create(): FspApiService {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .build()

            val moshi = Moshi.Builder()
                .add(KotlinJsonAdapterFactory())
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(MoshiConverterFactory.create(moshi))
                .build()
                .create(FspApiService::class.java)
        }
    }
}
