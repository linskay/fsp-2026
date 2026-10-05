package ru.fsp.careerarena.entity.enums;

public enum FspRank {
    MS("Мастер спорта России"),
    KMS("Кандидат в мастера спорта"),
    FIRST_CLASS("I спортивный разряд"),
    SECOND_CLASS("II спортивный разряд"),
    UNRANKED("Без разряда");

    private final String displayName;

    FspRank(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
