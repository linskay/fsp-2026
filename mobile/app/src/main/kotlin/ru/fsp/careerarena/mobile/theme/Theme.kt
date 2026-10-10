package ru.fsp.careerarena.mobile.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val FspBgDark = Color(0xFF04060D)
val FspCardDark = Color(0xFF0B0F19)
val FspPrimaryBlue = Color(0xFF2B35FF)
val FspSecondaryIndigo = Color(0xFF6366F1)
val FspCyan = Color(0xFF06B6D4)
val FspGold = Color(0xFFF59E0B)
val FspEmerald = Color(0xFF10B981)
val FspTextWhite = Color(0xFFF8FAFC)
val FspTextMuted = Color(0xFF94A3B8)

private val FspDarkColorScheme = darkColorScheme(
    primary = FspPrimaryBlue,
    secondary = FspSecondaryIndigo,
    tertiary = FspCyan,
    background = FspBgDark,
    surface = FspCardDark,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = FspTextWhite,
    onSurface = FspTextWhite
)

@Composable
fun FspTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = FspDarkColorScheme,
        content = content
    )
}
