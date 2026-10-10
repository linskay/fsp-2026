package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.VacancyReport;

import java.util.List;
import java.util.UUID;

@Repository
public interface VacancyReportRepository extends JpaRepository<VacancyReport, UUID> {
    List<VacancyReport> findByVacancyId(UUID vacancyId);
}
