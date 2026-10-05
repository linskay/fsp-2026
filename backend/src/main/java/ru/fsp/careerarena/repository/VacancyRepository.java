package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.List;
import java.util.UUID;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, UUID> {
    List<Vacancy> findByEmployerId(UUID employerId);
    List<Vacancy> findByIsActiveTrue();

    @Query("SELECT v FROM Vacancy v WHERE v.isActive = true AND " +
           "(:spec IS NULL OR v.specialization = :spec) AND " +
           "(:grade IS NULL OR v.grade = :grade) AND " +
           "(:maxRequiredElo IS NULL OR v.minFspElo <= :maxRequiredElo)")
    List<Vacancy> searchVacancies(
            @Param("spec") Specialization specialization,
            @Param("grade") Grade grade,
            @Param("maxRequiredElo") Integer maxRequiredElo
    );
}
