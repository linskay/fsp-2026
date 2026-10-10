package ru.fsp.careerarena.util;

public final class DataMaskingUtils {

    private DataMaskingUtils() {}

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***@fsp.ru";
        String[] parts = email.split("@", 2);
        String name = parts[0];
        String domain = parts[1];

        if (name.length() <= 2) {
            return name.charAt(0) + "***@" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + "@" + domain;
    }

    public static String maskPhone(String phone) {
        if (phone == null || phone.isBlank()) return "+7 (9**) ***-**-**";
        if (phone.length() >= 4) {
            String lastTwo = phone.substring(phone.length() - 2);
            return "+7 (9**) ***-**-" + lastTwo;
        }
        return "+7 (9**) ***-**-**";
    }

    public static String maskTelegram(String tg) {
        if (tg == null || tg.isBlank()) return "@****_dev";
        String handle = tg.startsWith("@") ? tg.substring(1) : tg;
        if (handle.length() <= 2) {
            return "@" + handle.charAt(0) + "***";
        }
        return "@" + handle.charAt(0) + "***" + handle.charAt(handle.length() - 1);
    }

    public static String maskFullName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Кандидат ФСП";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length >= 2) {
            return parts[0] + " " + parts[1].charAt(0) + ".";
        }
        return parts[0];
    }
}
