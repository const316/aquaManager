package com.salabs.amanager.repository;

import com.salabs.amanager.domain.Maestro;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Maestro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaestroRepository extends JpaRepository<Maestro, Long> {}
