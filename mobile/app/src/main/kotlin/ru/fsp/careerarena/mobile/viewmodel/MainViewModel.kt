package ru.fsp.careerarena.mobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import ru.fsp.careerarena.mobile.model.*
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

    private val _offersState = MutableStateFlow<UiState<List<ReverseOffer>>>(UiState.Loading)
    val offersState: StateFlow<UiState<List<ReverseOffer>>> = _offersState.asStateFlow()

    private val _assessmentsState = MutableStateFlow<UiState<List<AssessmentAssignment>>>(UiState.Loading)
    val assessmentsState: StateFlow<UiState<List<AssessmentAssignment>>> = _assessmentsState.asStateFlow()

    private val _interviewsState = MutableStateFlow<UiState<List<ScheduledInterview>>>(UiState.Loading)
    val interviewsState: StateFlow<UiState<List<ScheduledInterview>>> = _interviewsState.asStateFlow()

    private val _applicationsState = MutableStateFlow<UiState<List<CandidateApplication>>>(UiState.Loading)
    val applicationsState: StateFlow<UiState<List<CandidateApplication>>> = _applicationsState.asStateFlow()

    private val _gradeCooldownState = MutableStateFlow<UiState<GradeCooldownInfo>>(UiState.Loading)
    val gradeCooldownState: StateFlow<UiState<GradeCooldownInfo>> = _gradeCooldownState.asStateFlow()

    private val _eloHistoryState = MutableStateFlow<UiState<List<EloHistoryPoint>>>(UiState.Loading)
    val eloHistoryState: StateFlow<UiState<List<EloHistoryPoint>>> = _eloHistoryState.asStateFlow()

    private val _notificationsState = MutableStateFlow<UiState<List<UserNotification>>>(UiState.Loading)
    val notificationsState: StateFlow<UiState<List<UserNotification>>> = _notificationsState.asStateFlow()

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
        val candidateId = "cand-pesterev"

        viewModelScope.launch {
            _candidateState.value = UiState.Loading
            try {
                val candidates = api.getCandidates()
                val current = candidates.find { it.id == candidateId } ?: candidates.firstOrNull() ?: getDefaultCandidate()
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

            try {
                val offers = api.getOffersByCandidate(candidateId)
                _offersState.value = UiState.Success(offers)
            } catch (e: Exception) {
                _offersState.value = UiState.Success(getDefaultOffers())
            }

            try {
                val assessments = api.getAssessmentsByCandidate(candidateId)
                _assessmentsState.value = UiState.Success(assessments)
            } catch (e: Exception) {
                _assessmentsState.value = UiState.Success(getDefaultAssessments())
            }

            try {
                val interviews = api.getInterviewsByCandidate(candidateId)
                _interviewsState.value = UiState.Success(interviews)
            } catch (e: Exception) {
                _interviewsState.value = UiState.Success(getDefaultInterviews())
            }

            try {
                val apps = api.getApplicationsByCandidate(candidateId)
                _applicationsState.value = UiState.Success(apps)
            } catch (e: Exception) {
                _applicationsState.value = UiState.Success(getDefaultApplications())
            }

            try {
                val cooldown = api.getGradeCooldown(candidateId)
                _gradeCooldownState.value = UiState.Success(cooldown)
            } catch (e: Exception) {
                _gradeCooldownState.value = UiState.Success(GradeCooldownInfo(canTakeTest = true, waitHoursRemaining = 0))
            }

            try {
                val eloHistory = api.getCandidateEloHistory(candidateId)
                _eloHistoryState.value = UiState.Success(eloHistory)
            } catch (e: Exception) {
                _eloHistoryState.value = UiState.Success(getDefaultEloHistory())
            }

            try {
                val notifs = api.getNotifications()
                _notificationsState.value = UiState.Success(notifs)
            } catch (e: Exception) {
                _notificationsState.value = UiState.Success(getDefaultNotifications())
            }
        }
    }

    fun acceptOffer(offerId: String) {
        viewModelScope.launch {
            try {
                api.acceptOffer(offerId)
            } catch (_: Exception) {}
            // Update local state
            val currentList = (_offersState.value as? UiState.Success)?.data ?: emptyList()
            _offersState.value = UiState.Success(
                currentList.map { if (it.id == offerId) it.copy(status = "accepted") else it }
            )
        }
    }

    fun declineOffer(offerId: String, reason: String = "Не подходит стек") {
        viewModelScope.launch {
            try {
                api.declineOffer(offerId, reason)
            } catch (_: Exception) {}
            val currentList = (_offersState.value as? UiState.Success)?.data ?: emptyList()
            _offersState.value = UiState.Success(
                currentList.map { if (it.id == offerId) it.copy(status = "declined") else it }
            )
        }
    }

    fun applyToVacancy(vacancy: Vacancy) {
        viewModelScope.launch {
            val newApp = CandidateApplication(
                id = "app-${System.currentTimeMillis()}",
                vacancyId = vacancy.id,
                vacancyTitle = vacancy.title,
                companyName = vacancy.companyName,
                candidateId = "cand-pesterev",
                candidateName = "Иван Пестерев",
                status = "new",
                coverLetter = "Отклик через мобильное приложение ФСП Карьера",
                createdAt = "Только что"
            )
            try {
                api.createApplication(newApp)
            } catch (_: Exception) {}
            val current = (_applicationsState.value as? UiState.Success)?.data ?: emptyList()
            _applicationsState.value = UiState.Success(listOf(newApp) + current)
        }
    }

    fun markNotificationAsRead(notifId: String) {
        viewModelScope.launch {
            try {
                api.markNotificationAsRead(notifId)
            } catch (_: Exception) {}
            val current = (_notificationsState.value as? UiState.Success)?.data ?: emptyList()
            _notificationsState.value = UiState.Success(
                current.map { if (it.id == notifId) it.copy(read = true) else it }
            )
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
            minFspElo = 2000,
            location = "Москва / Удаленно",
            workFormat = "Удаленно"
        ),
        Vacancy(
            id = "vac-2",
            title = "Backend Developer (Go / Java)",
            companyName = "Яндекс Маркет",
            salaryMin = 280000,
            salaryMax = 420000,
            requiredGrade = "Middle+",
            minFspElo = 1800,
            location = "Москва",
            workFormat = "Гибрид"
        )
    )

    private fun getDefaultOffers() = listOf(
        ReverseOffer(
            id = "off-1",
            vacancyId = "vac-1",
            vacancyTitle = "Senior Java Highload Engineer",
            employerId = "emp-1",
            companyName = "СберТех",
            companyLogo = null,
            candidateId = "cand-pesterev",
            candidateName = "Иван Пестерев",
            salary = 480000,
            format = "Удаленно",
            city = "Москва",
            comment = "Здравствуйте, Иван! Высоко оценили ваш результат в Арене ФСП (2540 ELO). Предлагаем позицию лид-разработчика.",
            status = "pending",
            createdAt = "2 часа назад"
        )
    )

    private fun getDefaultAssessments() = listOf(
        AssessmentAssignment(
            id = "asmt-1",
            employerId = "emp-1",
            companyName = "СберТех",
            vacancyId = "vac-1",
            vacancyTitle = "Senior Java Highload Engineer",
            candidateId = "cand-pesterev",
            candidateName = "Иван Пестерев",
            status = "pending",
            timeLimitMinutes = 45,
            isLiveInterview = true,
            telemostRoomUrl = "https://telemost.yandex.ru/j/84920491823901",
            scheduledInterviewAt = "Завтра в 15:00",
            createdAt = "Сегодня"
        )
    )

    private fun getDefaultInterviews() = listOf(
        ScheduledInterview(
            id = "int-1",
            candidateId = "cand-pesterev",
            employerId = "emp-1",
            companyName = "СберТех",
            positionTitle = "Senior Java Highload",
            telemostRoomUrl = "https://telemost.yandex.ru/j/84920491823901",
            scheduledAt = "Завтра в 15:00 (МСК)",
            status = "scheduled",
            durationMinutes = 45
        )
    )

    private fun getDefaultApplications() = listOf(
        CandidateApplication(
            id = "app-1",
            vacancyId = "vac-1",
            vacancyTitle = "Senior Java / Highload Core Engineer",
            companyName = "СберТех",
            candidateId = "cand-pesterev",
            candidateName = "Иван Пестерев",
            status = "interview",
            coverLetter = "Высокий рейтинг в Арене и подтвержденный разряд ФСП.",
            createdAt = "Вчера"
        )
    )

    private fun getDefaultEloHistory() = listOf(
        EloHistoryPoint(elo = 2200, change = 100, reason = "Решение задачи 'LRU Cache'", timestamp = "01.10.2026"),
        EloHistoryPoint(elo = 2380, change = 180, reason = "LeetCode #23 Merge K Sorted Lists", timestamp = "05.10.2026"),
        EloHistoryPoint(elo = 2540, change = 160, reason = "Победа в Чемпионате ФСП РФ 2026", timestamp = "09.10.2026")
    )

    private fun getDefaultNotifications() = listOf(
        UserNotification(
            id = "notif-1",
            userId = "cand-pesterev",
            title = "Вам поступил оффер от СберТеха",
            message = "Оффер на позицию Senior Java (480 000 ₽) с удаленным форматом.",
            type = "offer",
            read = false,
            createdAt = "10 мин назад"
        )
    )
}
