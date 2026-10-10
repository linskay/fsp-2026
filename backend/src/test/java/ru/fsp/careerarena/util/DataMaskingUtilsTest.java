package ru.fsp.careerarena.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Юнит-тесты маскирования персональных данных (152-ФЗ РФ)")
class DataMaskingUtilsTest {

    @Test
    @DisplayName("Маскирование Email: скрытие символов между первой и последней буквой логина")
    void testMaskEmail() {
        assertEquals("i***v@yandex.ru", DataMaskingUtils.maskEmail("ivan.pesterev@yandex.ru"));
        assertEquals("a***a@fsp.ru", DataMaskingUtils.maskEmail("alina@fsp.ru"));
        assertEquals("a***@domain.com", DataMaskingUtils.maskEmail("ab@domain.com"));
        assertEquals("a***@domain.com", DataMaskingUtils.maskEmail("a@domain.com"));
        assertEquals("***@fsp.ru", DataMaskingUtils.maskEmail(null));
        assertEquals("***@fsp.ru", DataMaskingUtils.maskEmail("invalid-email"));
    }

    @Test
    @DisplayName("Маскирование телефона: сохранение формата РФ и открытие только двух последних цифр")
    void testMaskPhone() {
        assertEquals("+7 (9**) ***-**-42", DataMaskingUtils.maskPhone("+7 (916) 459-33-42"));
        assertEquals("+7 (9**) ***-**-00", DataMaskingUtils.maskPhone("+79990000000"));
        assertEquals("+7 (9**) ***-**-**", DataMaskingUtils.maskPhone(null));
        assertEquals("+7 (9**) ***-**-**", DataMaskingUtils.maskPhone(""));
    }

    @Test
    @DisplayName("Маскирование Telegram: маскирование символов имени пользователя")
    void testMaskTelegram() {
        assertEquals("@a***v", DataMaskingUtils.maskTelegram("@alex_belov"));
        assertEquals("@i***v", DataMaskingUtils.maskTelegram("ipesterev"));
        assertEquals("@****_dev", DataMaskingUtils.maskTelegram(null));
        assertEquals("@****_dev", DataMaskingUtils.maskTelegram(""));
    }

    @Test
    @DisplayName("Маскирование ФИО: сокращение фамилии до первой буквы с точкой")
    void testMaskFullName() {
        assertEquals("Пестерев И.", DataMaskingUtils.maskFullName("Пестерев Иван"));
        assertEquals("Романова Е.", DataMaskingUtils.maskFullName("Романова Елена Сергеевна"));
        assertEquals("Иван", DataMaskingUtils.maskFullName("Иван"));
        assertEquals("Кандидат ФСП", DataMaskingUtils.maskFullName(null));
        assertEquals("Кандидат ФСП", DataMaskingUtils.maskFullName("  "));
    }
}
