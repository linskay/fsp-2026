package ru.fsp.careerarena.mobile.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ru.fsp.careerarena.mobile.model.ArenaTask
import ru.fsp.careerarena.mobile.theme.*

@Composable
fun ArenaScreen() {
    val sampleTasks = listOf(
        ArenaTask("task-1", "Двусвязный кэш с политикой LRU (Highload)", "Medium", 100, true),
        ArenaTask("task-2", "Слияние K сортированных списков (LeetCode #23)", "Hard", 180, true),
        ArenaTask("task-3", "Параллельный Rate Limiter на Token Bucket", "Medium", 120, false),
        ArenaTask("task-4", "Оптимизация распределенного семафора", "Hard", 220, false)
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FspBgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            // Arena Header
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Code,
                        contentDescription = null,
                        tint = FspPrimaryBlue,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Алгоритмическая Арена ФСП",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = FspTextWhite
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Решайте олимпиадные задачи для повышения ELO и разряда в реестре",
                    fontSize = 12.sp,
                    color = FspTextMuted
                )
            }
        }

        items(sampleTasks) { task ->
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
                            text = task.title,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = FspTextWhite,
                            modifier = Modifier.weight(1f)
                        )

                        val diffColor = when (task.difficulty) {
                            "Easy" -> FspEmerald
                            "Medium" -> FspGold
                            else -> Color(0xFFEF4444)
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(diffColor.copy(alpha = 0.15f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = task.difficulty,
                                color = diffColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "+${task.pointsElo} ELO очков",
                            color = FspCyan,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )

                        if (task.solved) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = FspEmerald,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Решено",
                                    color = FspEmerald,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        } else {
                            Button(
                                onClick = { },
                                colors = ButtonDefaults.buttonColors(containerColor = FspPrimaryBlue),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.PlayArrow,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Решать", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
