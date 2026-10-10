#!/usr/bin/env python3
"""
FSP Career Arena — Mobile & Kotlin Bootstrap Script (Best Practices)
Инициализация и валидация Kotlin-модулей бэкенда и Android-приложения.
"""

import os
import sys
import subprocess

def print_banner():
    print("=" * 70)
    print(" 🚀 FSP Career Arena — Kotlin 2.0 & Android Mobile Ecosystem")
    print(" Команда разработчиков: «NO PHP — NO PROBLEMS — 2026»")
    print("=" * 70)

def step_1_convert_dtos():
    print("\n[ШАГ 1] Конвертация Java DTO в идиоматичный Kotlin 2.0...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    converter_script = os.path.join(script_dir, "convert_to_kotlin.py")
    if os.path.exists(converter_script):
        subprocess.run([sys.executable, converter_script], check=True)
    else:
        print("  Скрипт convert_to_kotlin.py не найден.")

def step_2_verify_backend_kotlin():
    print("\n[ШАГ 2] Проверка Kotlin-контроллеров и DTO бэкенда...")
    backend_kt_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "backend", "src", "main", "kotlin", "ru", "fsp", "careerarena", "kotlin"
    )
    if os.path.exists(backend_kt_dir):
        files = [f for f in os.listdir(backend_kt_dir) if f.endswith(".kt")]
        print(f"  ✓ Найдено Kotlin-файлов бэкенда: {len(files)}")
        for f in files:
            print(f"    - {f}")
    else:
        print("  Директория Kotlin бэкенда пока не создана.")

def step_3_verify_mobile():
    print("\n[ШАГ 3] Проверка структуры Android Jetpack Compose проекта...")
    mobile_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "mobile"
    )
    required_files = [
        "settings.gradle.kts",
        "build.gradle.kts",
        "app/build.gradle.kts",
        "app/src/main/AndroidManifest.xml",
        "app/src/main/kotlin/ru/fsp/careerarena/mobile/MainActivity.kt"
    ]
    all_ok = True
    for req in required_files:
        full_path = os.path.join(mobile_dir, req)
        if os.path.exists(full_path):
            print(f"  ✓ {req}")
        else:
            print(f"  ✗ Отсутствует: {req}")
            all_ok = False

    if all_ok:
        print("\n🎉 Архитектура мобильного приложения полностью готова!")
        print("📱 Чтобы открыть в Android Studio: File -> Open -> выберите папку 'mobile'")
        print("⚡ Для сборки APK в терминале: cd mobile && ./gradlew assembleDebug")

def main():
    print_banner()
    step_1_convert_dtos()
    step_2_verify_backend_kotlin()
    step_3_verify_mobile()
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
