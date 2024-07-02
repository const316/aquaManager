package com.salabs.amanager.web.rest;

import com.salabs.amanager.domain.Maestro;
import com.salabs.amanager.repository.MaestroRepository;
import com.salabs.amanager.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.salabs.amanager.domain.Maestro}.
 */
@RestController
@RequestMapping("/api/maestros")
@Transactional
public class MaestroResource {

    private static final Logger log = LoggerFactory.getLogger(MaestroResource.class);

    private static final String ENTITY_NAME = "maestro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MaestroRepository maestroRepository;

    public MaestroResource(MaestroRepository maestroRepository) {
        this.maestroRepository = maestroRepository;
    }

    /**
     * {@code POST  /maestros} : Create a new maestro.
     *
     * @param maestro the maestro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new maestro, or with status {@code 400 (Bad Request)} if the maestro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Maestro> createMaestro(@RequestBody Maestro maestro) throws URISyntaxException {
        log.debug("REST request to save Maestro : {}", maestro);
        if (maestro.getId() != null) {
            throw new BadRequestAlertException("A new maestro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        maestro = maestroRepository.save(maestro);
        return ResponseEntity.created(new URI("/api/maestros/" + maestro.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, maestro.getId().toString()))
            .body(maestro);
    }

    /**
     * {@code PUT  /maestros/:id} : Updates an existing maestro.
     *
     * @param id the id of the maestro to save.
     * @param maestro the maestro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maestro,
     * or with status {@code 400 (Bad Request)} if the maestro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the maestro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Maestro> updateMaestro(@PathVariable(value = "id", required = false) final Long id, @RequestBody Maestro maestro)
        throws URISyntaxException {
        log.debug("REST request to update Maestro : {}, {}", id, maestro);
        if (maestro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maestro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maestroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        maestro = maestroRepository.save(maestro);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maestro.getId().toString()))
            .body(maestro);
    }

    /**
     * {@code PATCH  /maestros/:id} : Partial updates given fields of an existing maestro, field will ignore if it is null
     *
     * @param id the id of the maestro to save.
     * @param maestro the maestro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maestro,
     * or with status {@code 400 (Bad Request)} if the maestro is not valid,
     * or with status {@code 404 (Not Found)} if the maestro is not found,
     * or with status {@code 500 (Internal Server Error)} if the maestro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Maestro> partialUpdateMaestro(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Maestro maestro
    ) throws URISyntaxException {
        log.debug("REST request to partial update Maestro partially : {}, {}", id, maestro);
        if (maestro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maestro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maestroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Maestro> result = maestroRepository
            .findById(maestro.getId())
            .map(existingMaestro -> {
                if (maestro.getNombre() != null) {
                    existingMaestro.setNombre(maestro.getNombre());
                }
                if (maestro.getApellidos() != null) {
                    existingMaestro.setApellidos(maestro.getApellidos());
                }
                if (maestro.getContacto() != null) {
                    existingMaestro.setContacto(maestro.getContacto());
                }
                if (maestro.getActivo() != null) {
                    existingMaestro.setActivo(maestro.getActivo());
                }
                if (maestro.getSucursalId() != null) {
                    existingMaestro.setSucursalId(maestro.getSucursalId());
                }

                return existingMaestro;
            })
            .map(maestroRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maestro.getId().toString())
        );
    }

    /**
     * {@code GET  /maestros} : get all the maestros.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of maestros in body.
     */
    @GetMapping("")
    public List<Maestro> getAllMaestros() {
        log.debug("REST request to get all Maestros");
        return maestroRepository.findAll();
    }

    /**
     * {@code GET  /maestros/:id} : get the "id" maestro.
     *
     * @param id the id of the maestro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the maestro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Maestro> getMaestro(@PathVariable("id") Long id) {
        log.debug("REST request to get Maestro : {}", id);
        Optional<Maestro> maestro = maestroRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(maestro);
    }

    /**
     * {@code DELETE  /maestros/:id} : delete the "id" maestro.
     *
     * @param id the id of the maestro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaestro(@PathVariable("id") Long id) {
        log.debug("REST request to delete Maestro : {}", id);
        maestroRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
