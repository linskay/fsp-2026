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
import retrofit2.http.Query
import ru.fsp.careerarena.mobile.model.*

/**
 * Retrofit клиент для полного покрытия API платформы ФСП Карьерная Арена.
 */
interface FspApiService {

    // === Кандидаты & ELO ===
    @GET("candidates")
    suspend fun getCandidates(): List<CandidateProfile>

    @GET("candidates/{id}")
    suspend fun getCandidateById(@Path("id") id: String): CandidateProfile

    @GET("candidates/{id}/elo-history")
    suspend fun getCandidateEloHistory(@Path("id") id: String): List<EloHistoryPoint>

    // === Вакансии ===
    @GET("vacancies")
    suspend fun getVacancies(): List<Vacancy>

    @GET("vacancies/{id}")
    suspend fun getVacancyById(@Path("id") id: String): Vacancy

    // === Обратный найм: Офферы соискателя ===
    @GET("offers/candidate/{candidateId}")
    suspend fun getOffersByCandidate(@Path("candidateId") candidateId: String): List<ReverseOffer>

    @POST("offers/{id}/accept")
    suspend fun acceptOffer(@Path("id") id: String): ReverseOffer

    @POST("offers/{id}/decline")
    suspend fun declineOffer(@Path("id") id: String, @Query("reason") reason: String? = null): ReverseOffer

    // === Технические ассессменты & Задания работодателей ===
    @GET("assessments/candidate/{candidateId}")
    suspend fun getAssessmentsByCandidate(@Path("candidateId") candidateId: String): List<AssessmentAssignment>

    // === Собеседования Яндекс.Телемост ===
    @GET("interviews/candidate/{candidateId}")
    suspend fun getInterviewsByCandidate(@Path("candidateId") candidateId: String): List<ScheduledInterview>

    // === Отклики (ATS) ===
    @GET("applications/candidate/{candidateId}")
    suspend fun getApplicationsByCandidate(@Path("candidateId") candidateId: String): List<CandidateApplication>

    @POST("applications")
    suspend fun createApplication(@Body application: CandidateApplication): CandidateApplication

    // === Грейд-тестирование & Кулдаун ===
    @GET("tests/categories")
    suspend fun getGradeTestCategories(): List<GradeTestCategory>

    @GET("tests/cooldown/{candidateId}")
    suspend fun getGradeCooldown(@Path("candidateId") candidateId: String): GradeCooldownInfo

    // === Уведомления ===
    @GET("notifications")
    suspend fun getNotifications(): List<UserNotification>

    @POST("notifications/{id}/read")
    suspend fun markNotificationAsRead(@Path("id") id: String): UserNotification

    // === Чат ===
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
