package ru.fsp.careerarena.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import ru.fsp.careerarena.mobile.theme.FspCardDark
import ru.fsp.careerarena.mobile.theme.FspPrimaryBlue
import ru.fsp.careerarena.mobile.theme.FspTheme
import ru.fsp.careerarena.mobile.ui.ArenaScreen
import ru.fsp.careerarena.mobile.ui.ChatScreen
import ru.fsp.careerarena.mobile.ui.ProfileScreen
import ru.fsp.careerarena.mobile.viewmodel.MainViewModel
import ru.fsp.careerarena.mobile.viewmodel.UiState

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FspTheme {
                MainApp(viewModel)
            }
        }
    }
}

@Composable
fun MainApp(viewModel: MainViewModel) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val candidateState by viewModel.candidateState.collectAsState()
    val messages by viewModel.messages.collectAsState()

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = FspCardDark,
                contentColor = Color.White
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Профиль") },
                    label = { Text("Профиль") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        indicatorColor = FspPrimaryBlue
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Chat, contentDescription = "Чат") },
                    label = { Text("Чат") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        indicatorColor = FspPrimaryBlue
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Code, contentDescription = "Арена") },
                    label = { Text("Арена") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        indicatorColor = FspPrimaryBlue
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                0 -> {
                    when (val state = candidateState) {
                        is UiState.Loading -> {
                            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                CircularProgressIndicator(color = FspPrimaryBlue)
                            }
                        }
                        is UiState.Success -> {
                            ProfileScreen(candidate = state.data)
                        }
                        is UiState.Error -> {
                            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text(text = "Ошибка: ${state.message}", color = Color.Red)
                            }
                        }
                    }
                }
                1 -> {
                    ChatScreen(
                        messages = messages,
                        onSendMessage = { text -> viewModel.sendMessage(text) }
                    )
                }
                2 -> {
                    ArenaScreen()
                }
            }
        }
    }
}
