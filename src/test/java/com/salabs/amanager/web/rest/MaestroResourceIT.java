package com.salabs.amanager.web.rest;

import static com.salabs.amanager.domain.MaestroAsserts.*;
import static com.salabs.amanager.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.salabs.amanager.IntegrationTest;
import com.salabs.amanager.domain.Maestro;
import com.salabs.amanager.repository.MaestroRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MaestroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MaestroResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACTO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACTO = "BBBBBBBBBB";

    private static final Integer DEFAULT_ACTIVO = 1;
    private static final Integer UPDATED_ACTIVO = 2;

    private static final Long DEFAULT_SUCURSAL_ID = 1L;
    private static final Long UPDATED_SUCURSAL_ID = 2L;

    private static final String ENTITY_API_URL = "/api/maestros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MaestroRepository maestroRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMaestroMockMvc;

    private Maestro maestro;

    private Maestro insertedMaestro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maestro createEntity(EntityManager em) {
        Maestro maestro = new Maestro()
            .nombre(DEFAULT_NOMBRE)
            .apellidos(DEFAULT_APELLIDOS)
            .contacto(DEFAULT_CONTACTO)
            .activo(DEFAULT_ACTIVO)
            .sucursalId(DEFAULT_SUCURSAL_ID);
        return maestro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maestro createUpdatedEntity(EntityManager em) {
        Maestro maestro = new Maestro()
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .contacto(UPDATED_CONTACTO)
            .activo(UPDATED_ACTIVO)
            .sucursalId(UPDATED_SUCURSAL_ID);
        return maestro;
    }

    @BeforeEach
    public void initTest() {
        maestro = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedMaestro != null) {
            maestroRepository.delete(insertedMaestro);
            insertedMaestro = null;
        }
    }

    @Test
    @Transactional
    void createMaestro() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Maestro
        var returnedMaestro = om.readValue(
            restMaestroMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(maestro)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Maestro.class
        );

        // Validate the Maestro in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMaestroUpdatableFieldsEquals(returnedMaestro, getPersistedMaestro(returnedMaestro));

        insertedMaestro = returnedMaestro;
    }

    @Test
    @Transactional
    void createMaestroWithExistingId() throws Exception {
        // Create the Maestro with an existing ID
        maestro.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMaestroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(maestro)))
            .andExpect(status().isBadRequest());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMaestros() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        // Get all the maestroList
        restMaestroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(maestro.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].contacto").value(hasItem(DEFAULT_CONTACTO)))
            .andExpect(jsonPath("$.[*].activo").value(hasItem(DEFAULT_ACTIVO)))
            .andExpect(jsonPath("$.[*].sucursalId").value(hasItem(DEFAULT_SUCURSAL_ID.intValue())));
    }

    @Test
    @Transactional
    void getMaestro() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        // Get the maestro
        restMaestroMockMvc
            .perform(get(ENTITY_API_URL_ID, maestro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(maestro.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.contacto").value(DEFAULT_CONTACTO))
            .andExpect(jsonPath("$.activo").value(DEFAULT_ACTIVO))
            .andExpect(jsonPath("$.sucursalId").value(DEFAULT_SUCURSAL_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMaestro() throws Exception {
        // Get the maestro
        restMaestroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMaestro() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the maestro
        Maestro updatedMaestro = maestroRepository.findById(maestro.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMaestro are not directly saved in db
        em.detach(updatedMaestro);
        updatedMaestro
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .contacto(UPDATED_CONTACTO)
            .activo(UPDATED_ACTIVO)
            .sucursalId(UPDATED_SUCURSAL_ID);

        restMaestroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaestro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMaestro))
            )
            .andExpect(status().isOk());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMaestroToMatchAllProperties(updatedMaestro);
    }

    @Test
    @Transactional
    void putNonExistingMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(put(ENTITY_API_URL_ID, maestro.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(maestro)))
            .andExpect(status().isBadRequest());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(maestro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(maestro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMaestroWithPatch() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the maestro using partial update
        Maestro partialUpdatedMaestro = new Maestro();
        partialUpdatedMaestro.setId(maestro.getId());

        partialUpdatedMaestro.nombre(UPDATED_NOMBRE);

        restMaestroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaestro.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMaestro))
            )
            .andExpect(status().isOk());

        // Validate the Maestro in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMaestroUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMaestro, maestro), getPersistedMaestro(maestro));
    }

    @Test
    @Transactional
    void fullUpdateMaestroWithPatch() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the maestro using partial update
        Maestro partialUpdatedMaestro = new Maestro();
        partialUpdatedMaestro.setId(maestro.getId());

        partialUpdatedMaestro
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .contacto(UPDATED_CONTACTO)
            .activo(UPDATED_ACTIVO)
            .sucursalId(UPDATED_SUCURSAL_ID);

        restMaestroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaestro.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMaestro))
            )
            .andExpect(status().isOk());

        // Validate the Maestro in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMaestroUpdatableFieldsEquals(partialUpdatedMaestro, getPersistedMaestro(partialUpdatedMaestro));
    }

    @Test
    @Transactional
    void patchNonExistingMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, maestro.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(maestro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(maestro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMaestro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        maestro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaestroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(maestro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maestro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMaestro() throws Exception {
        // Initialize the database
        insertedMaestro = maestroRepository.saveAndFlush(maestro);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the maestro
        restMaestroMockMvc
            .perform(delete(ENTITY_API_URL_ID, maestro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return maestroRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Maestro getPersistedMaestro(Maestro maestro) {
        return maestroRepository.findById(maestro.getId()).orElseThrow();
    }

    protected void assertPersistedMaestroToMatchAllProperties(Maestro expectedMaestro) {
        assertMaestroAllPropertiesEquals(expectedMaestro, getPersistedMaestro(expectedMaestro));
    }

    protected void assertPersistedMaestroToMatchUpdatableProperties(Maestro expectedMaestro) {
        assertMaestroAllUpdatablePropertiesEquals(expectedMaestro, getPersistedMaestro(expectedMaestro));
    }
}
