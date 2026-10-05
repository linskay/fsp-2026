package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, UUID> {
    Optional<CandidateProfile> findByUserId(UUID userId);
    Optional<CandidateProfile> findByFspId(String fspId);

    @Query("SELECT c FROM CandidateProfile c WHERE " +
           "(:specialization IS NULL OR c.specialization = :specialization) AND " +
           "(:grade IS NULL OR c.grade = :grade) AND " +
           "(:minElo IS NULL OR c.fspElo >= :minElo) AND " +
           "(:fspRank IS NULL OR c.fspRank = :fspRank) " +
           "ORDER BY c.fspElo DESC")
    List<CandidateProfile> searchCandidates(
            @Param("specialization") Specialization specialization,
            @Param("grade") Grade grade,
            @Param("minElo") Integer minElo,
            @Param("fspRank") FspRank fspRank
    );
}
