package ru.fsp.careerarena.mobile.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ru.fsp.careerarena.mobile.model.AssessmentAssignment
import ru.fsp.careerarena.mobile.model.CandidateApplication
import ru.fsp.careerarena.mobile.model.ReverseOffer
import ru.fsp.careerarena.mobile.model.ScheduledInterview
import ru.fsp.careerarena.mobile.theme.*

@Composable
fun OffersScreen(
    offers: List<ReverseOffer>,
    assessments: List<AssessmentAssignment>,
    interviews: List<ScheduledInterview>,
    applications: List<CandidateApplication>,
    onAcceptOffer: (String) -> Unit,
    onDeclineOffer: (String) -> Unit
) {
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FspBgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section: Reverse Offers
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocalOffer,
                    contentDescription = null,
                    tint = FspCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Офферы обратного найма (${offers.size})",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = FspTextWhite
                )
            }
            Text(
                text = "Компании сами выходят на вас с фиксированной ставкой",
                fontSize = 12.sp,
                color = FspTextMuted,
                modifier = Modifier.padding(top = 2.dp)
            )
        }

        if (offers.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = FspCardDark),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
                ) {
                    Text(
                        text = "Пока нет входящих офферов. Решайте задачи в Арене для поднятия рейтинга!",
                        color = FspTextMuted,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        } else {
            items(offers) { offer ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = FspCardDark),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = offer.companyName,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = FspTextWhite
                            )
                            val (badgeBg, badgeText, badgeColor) = when (offer.status) {
                                "accepted" -> Triple(FspEmerald.copy(alpha = 0.2f), "Принят", FspEmerald)
                                "declined" -> Triple(Color(0xFFEF4444).copy(alpha = 0.2f), "Отклонен", Color(0xFFEF4444))
                                else -> Triple(FspPrimaryBlue.copy(alpha = 0.2f), "Ожидает ответа", FspCyan)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(badgeBg)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(text = badgeText, fontSize = 11.sp, color = badgeColor, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = offer.vacancyTitle,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = FspTextMuted
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "${offer.salary} ₽ / мес • ${offer.format}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = FspEmerald
                        )

                        offer.comment?.let { comment ->
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "«$comment»",
                                fontSize = 12.sp,
                                color = Color(0xFF94A3B8)
                            )
                        }

                        if (offer.status == "pending") {
                            Spacer(modifier = Modifier.height(14.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { onAcceptOffer(offer.id) },
                                    modifier = Modifier.weight(1f),
                                    colors = ButtonDefaults.buttonColors(containerColor = FspEmerald),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Принять оффер", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }

                                OutlinedButton(
                                    onClick = { onDeclineOffer(offer.id) },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFEF4444)),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF4444).copy(alpha = 0.5f))
                                ) {
                                    Text("Отклонить", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section: Live Interviews & Assessments
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.VideoCameraFront,
                    contentDescription = null,
                    tint = FspCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Лайв-интервью и Телемост (${interviews.size + assessments.filter { it.isLiveInterview }.size})",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = FspTextWhite
                )
            }
        }

        items(assessments.filter { it.isLiveInterview }) { asmt ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = FspCardDark),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Собеседование с ${asmt.companyName}",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = FspTextWhite
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Позиция: ${asmt.vacancyTitle} • Таймер: ${asmt.timeLimitMinutes} мин",
                        fontSize = 12.sp,
                        color = FspTextMuted
                    )

                    asmt.scheduledInterviewAt?.let { scheduled ->
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AccessTime, contentDescription = null, tint = FspGold, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Назначено: $scheduled", fontSize = 12.sp, color = FspGold, fontWeight = FontWeight.Medium)
                        }
                    }

                    asmt.telemostRoomUrl?.let { url ->
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = FspPrimaryBlue),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.VideoCall, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Войти в Яндекс.Телемост", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Section: ATS Applications
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Description,
                    contentDescription = null,
                    tint = FspCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Ваши отклики (${applications.size})",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = FspTextWhite
                )
            }
        }

        items(applications) { app ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FspCardDark),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = app.vacancyTitle, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = FspTextWhite)
                        Text(text = app.companyName, fontSize = 12.sp, color = FspTextMuted)
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(FspPrimaryBlue.copy(alpha = 0.2f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = when (app.status) {
                                "interview" -> "Собеседование"
                                "offer" -> "Оффер"
                                else -> "На рассмотрении"
                            },
                            fontSize = 11.sp,
                            color = FspCyan,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
