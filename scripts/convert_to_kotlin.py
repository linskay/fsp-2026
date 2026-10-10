#!/usr/bin/env python3
"""
FSP Career Arena — Java to Kotlin Conversion Utility (Best Practices)
Автоматически конвертирует Java DTO и Entity в идиоматичные Kotlin data class.
"""

import os
import re
import sys

JAVA_TO_KOTLIN_TYPES = {
    'String': 'String',
    'int': 'Int',
    'Integer': 'Int',
    'long': 'Long',
    'Long': 'Long',
    'double': 'Double',
    'Double': 'Double',
    'boolean': 'Boolean',
    'Boolean': 'Boolean',
    'List<String>': 'List<String>',
    'List': 'List<Any>',
    'Map<String, Object>': 'Map<String, Any>',
    'Instant': 'Instant',
    'LocalDateTime': 'LocalDateTime',
    'LocalDate': 'LocalDate',
    'UUID': 'UUID'
}

def convert_java_file_to_kotlin(java_file_path: str) -> str:
    with open(java_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract package
    pkg_match = re.search(r'package\s+([a-zA-Z0-9_\.]+);', content)
    package_name = pkg_match.group(1) if pkg_match else "ru.fsp.careerarena"

    # Extract class name
    class_match = re.search(r'public\s+class\s+([A-Za-z0-9_]+)', content)
    if not class_match:
        return ""
    class_name = class_match.group(1)

    # Extract fields
    fields = []
    field_pattern = re.compile(r'private\s+([A-Za-z0-9_<>\?, ]+)\s+([a-zA-Z0-9_]+)\s*;')
    
    for match in field_pattern.finditer(content):
        java_type, field_name = match.group(1).strip(), match.group(2).strip()
        kotlin_type = JAVA_TO_KOTLIN_TYPES.get(java_type, java_type)
        
        # Default value heuristics
        default_val = ""
        if kotlin_type == 'Int':
            default_val = " = 0"
        elif kotlin_type == 'Boolean':
            default_val = " = false"
        elif kotlin_type.startswith('List'):
            default_val = " = emptyList()"
        elif kotlin_type == 'String':
            default_val = ' = ""'
            
        fields.append(f"    val {field_name}: {kotlin_type}{default_val}")

    # Generate Kotlin Code
    kotlin_code = [
        f"package {package_name}",
        "",
        "import io.swagger.v3.oas.annotations.media.Schema",
        "import java.time.Instant",
        "import java.time.OffsetDateTime",
        "import java.util.UUID",
        "import ru.fsp.careerarena.entity.*",
        "",
        f"/**",
        f" * Автоматически сгенерированный Kotlin Data Class для {class_name}.",
        f" * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.",
        f" */",
        f"@Schema(description = \"{class_name} (Kotlin Data Class)\")",
        f"data class {class_name}("
    ]
    
    kotlin_code.append(",\n".join(fields))
    kotlin_code.append(")\n")

    return "\n".join(kotlin_code)

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dto_dir = os.path.join(root_dir, "backend", "src", "main", "java", "ru", "fsp", "careerarena", "dto")
    out_dir = os.path.join(root_dir, "mobile", "app", "src", "main", "kotlin", "ru", "fsp", "careerarena", "mobile", "model", "dto")

    os.makedirs(out_dir, exist_ok=True)
    print(f"[KOTLIN-CONVERTER] Сканирование Java DTO: {dto_dir}")

    converted_count = 0
    if os.path.exists(dto_dir):
        for item in os.listdir(dto_dir):
            if item.endswith(".java") and not item.startswith("package-info"):
                java_path = os.path.join(dto_dir, item)
                kt_code = convert_java_file_to_kotlin(java_path)
                if kt_code:
                    kt_filename = item.replace(".java", ".kt")
                    kt_path = os.path.join(out_dir, kt_filename)
                    with open(kt_path, "w", encoding="utf-8") as out_f:
                        out_f.write(kt_code)
                    print(f"  ✓ Сконвертирован: {item} -> {kt_filename}")
                    converted_count += 1

    print(f"\n[KOTLIN-CONVERTER] Готово! Успешно сконвертировано DTO: {converted_count}")

if __name__ == "__main__":
    main()
