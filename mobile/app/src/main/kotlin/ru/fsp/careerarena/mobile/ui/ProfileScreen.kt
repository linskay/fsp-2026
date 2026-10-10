package ru.fsp.careerarena.mobile.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ru.fsp.careerarena.mobile.model.CandidateProfile
import ru.fsp.careerarena.mobile.theme.*

@Composable
fun ProfileScreen(candidate: CandidateProfile) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FspBgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Profile Header Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF0F172A), FspCardDark)
                        )
                    )
                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertizally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        // Avatar placeholder
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(FspPrimaryBlue),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = candidate.fullName.take(1),
                                color = Color.White,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = candidate.fullName,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = FspTextWhite
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(
                                    imageVector = Icons.Default.Verified,
                                    contentDescription = "Верифицирован",
                                    tint = FspCyan,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Text(
                                text = candidate.title,
                                fontSize = 13.sp,
                                color = FspTextMuted
                            )
                            Text(
                                text = candidate.city,
                                fontSize = 11.sp,
                                color = FspTextMuted
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // ELO & Sports Rank Metric Card
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFF030712))
                            .border(1.dp, FspPrimaryBlue.copy(alpha = 0.3f), RoundedCornerShape(14.dp))
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "СПОРТИВНЫЙ РЕЙТИНГ",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = FspTextMuted,
                                letterSpacing = 0.8.sp
                            )
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "${candidate.fspRating} ELO",
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Black,
                                    color = FspCyan
                                )
                            }
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "РАЗРЯД ФСП",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = FspTextMuted,
                                letterSpacing = 0.8.sp
                            )
                            Text(
                                text = candidate.fspRank,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = FspGold
                            )
                        }
                    }
                }
            }
        }

        item {
            // Verified Skills Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = FspCardDark),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E293B))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Подтвержденный стек технологий",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = FspTextWhite
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    @OptIn(ExperimentalLayoutApi::class)
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        candidate.skills.forEach { skill ->
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF1E293B))
                                    .border(1.dp, Color(0xFF334155), RoundedCornerShape(8.dp))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = skill,
                                    fontSize = 12.sp,
                                    color = Color(0xFFE2E8F0),
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }
        }

        item {
            // Legal Privacy 152-FZ Attribution
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = null,
                    tint = FspEmerald,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Защищено Федерацией спортивного программирования РФ (152-ФЗ)",
                    fontSize = 11.sp,
                    color = FspTextMuted
                )
            }
        }
    }
}
