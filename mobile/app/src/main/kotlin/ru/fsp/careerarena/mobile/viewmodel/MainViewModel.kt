package ru.fsp.careerarena.mobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import ru.fsp.careerarena.mobile.model.CandidateProfile
import ru.fsp.careerarena.mobile.model.MobileChatMessage
import ru.fsp.careerarena.mobile.model.Vacancy
import ru.fsp.careerarena.mobile.network.FspApiService

sealed interface UiState<out T> {
    object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}

class MainViewModel(
    private val api: FspApiService = FspApiService.create()
) : ViewModel() {

    private val _candidateState = MutableStateFlow<UiState<CandidateProfile>>(UiState.Loading)
    val candidateState: StateFlow<UiState<CandidateProfile>> = _candidateState.asStateFlow()

    private val _vacanciesState = MutableStateFlow<UiState<List<Vacancy>>>(UiState.Loading)
    val vacanciesState: StateFlow<UiState<List<Vacancy>>> = _vacanciesState.asStateFlow()

    private val _messages = MutableStateFlow<List<MobileChatMessage>>(
        listOf(
            MobileChatMessage(
                invitationId = "inv-1",
                sender = "employer",
                text = "Здравствуйте, Иван! Ознакомились с вашим рейтингом ФСП (2540 ELO). Хотим предложить технический созвон по вакансии Senior Java.",
                timestamp = "14:30"
            ),
            MobileChatMessage(
                invitationId = "inv-1",
                sender = "candidate",
                text = "Добрый день! Спасибо за приглашение. Готов обсудить стек и детали проекта.",
                timestamp = "14:35"
            )
        )
    )
    val messages: StateFlow<List<MobileChatMessage>> = _messages.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            _candidateState.value = UiState.Loading
            try {
                // Пытаемся получить данные с бэкенда, либо используем верифицированный дефолт
                val candidates = api.getCandidates()
                val current = candidates.firstOrNull() ?: getDefaultCandidate()
                _candidateState.value = UiState.Success(current)
            } catch (e: Exception) {
                _candidateState.value = UiState.Success(getDefaultCandidate())
            }

            try {
                val vacs = api.getVacancies()
                _vacanciesState.value = UiState.Success(vacs)
            } catch (e: Exception) {
                _vacanciesState.value = UiState.Success(getDefaultVacancies())
            }
        }
    }

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        val newMsg = MobileChatMessage(
            invitationId = "inv-1",
            sender = "candidate",
            text = text,
            timestamp = "Сейчас"
        )
        _messages.value = _messages.value + newMsg

        viewModelScope.launch {
            try {
                api.sendChatMessage(newMsg)
            } catch (_: Exception) {}
        }
    }

    private fun getDefaultCandidate() = CandidateProfile(
        id = "cand-pesterev",
        fullName = "Иван Пестерев",
        title = "Senior Java / Highload Engineer",
        city = "Москва / Удаленно",
        avatarUrl = null,
        fspRating = 2540,
        fspRank = "1-й спортивный разряд",
        isVerified = true,
        skills = listOf("Java 21", "Spring Boot 3", "PostgreSQL", "Docker", "Highload", "Kafka"),
        solvedTasksCount = 14,
        experienceYears = 5,
        about = "Java-разработчик и участник турниров ФСП России. Профиль верифицирован."
    )

    private fun getDefaultVacancies() = listOf(
        Vacancy(
            id = "vac-1",
            title = "Senior Java / Highload Core Engineer",
            companyName = "СберТех (ПАО Сбербанк)",
            salaryMin = 350000,
            salaryMax = 520000,
            requiredGrade = "Senior",
            minFspElo = 2000
        ),
        Vacancy(
            id = "vac-2",
            title = "Backend Developer (Go / Java)",
            companyName = "Яндекс Маркет",
            salaryMin = 280000,
            salaryMax = 420000,
            requiredGrade = "Middle+",
            minFspElo = 1800
        )
    )
}
