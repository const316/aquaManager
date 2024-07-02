package com.salabs.amanager.web.rest;

import static com.salabs.amanager.domain.SucursalAsserts.*;
import static com.salabs.amanager.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.salabs.amanager.IntegrationTest;
import com.salabs.amanager.domain.Sucursal;
import com.salabs.amanager.repository.SucursalRepository;
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
 * Integration tests for the {@link SucursalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SucursalResourceIT {

    private static final Long DEFAULT_UNIQUE_ID = 1L;
    private static final Long UPDATED_UNIQUE_ID = 2L;

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DIRECCION = "AAAAAAAAAA";
    private static final String UPDATED_DIRECCION = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONO = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sucursals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSucursalMockMvc;

    private Sucursal sucursal;

    private Sucursal insertedSucursal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sucursal createEntity(EntityManager em) {
        Sucursal sucursal = new Sucursal()
            .uniqueId(DEFAULT_UNIQUE_ID)
            .nombre(DEFAULT_NOMBRE)
            .direccion(DEFAULT_DIRECCION)
            .telefono(DEFAULT_TELEFONO);
        return sucursal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sucursal createUpdatedEntity(EntityManager em) {
        Sucursal sucursal = new Sucursal()
            .uniqueId(UPDATED_UNIQUE_ID)
            .nombre(UPDATED_NOMBRE)
            .direccion(UPDATED_DIRECCION)
            .telefono(UPDATED_TELEFONO);
        return sucursal;
    }

    @BeforeEach
    public void initTest() {
        sucursal = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedSucursal != null) {
            sucursalRepository.delete(insertedSucursal);
            insertedSucursal = null;
        }
    }

    @Test
    @Transactional
    void createSucursal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Sucursal
        var returnedSucursal = om.readValue(
            restSucursalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sucursal)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Sucursal.class
        );

        // Validate the Sucursal in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSucursalUpdatableFieldsEquals(returnedSucursal, getPersistedSucursal(returnedSucursal));

        insertedSucursal = returnedSucursal;
    }

    @Test
    @Transactional
    void createSucursalWithExistingId() throws Exception {
        // Create the Sucursal with an existing ID
        sucursal.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSucursalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sucursal)))
            .andExpect(status().isBadRequest());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSucursals() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        // Get all the sucursalList
        restSucursalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sucursal.getId().intValue())))
            .andExpect(jsonPath("$.[*].uniqueId").value(hasItem(DEFAULT_UNIQUE_ID.intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].direccion").value(hasItem(DEFAULT_DIRECCION)))
            .andExpect(jsonPath("$.[*].telefono").value(hasItem(DEFAULT_TELEFONO)));
    }

    @Test
    @Transactional
    void getSucursal() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        // Get the sucursal
        restSucursalMockMvc
            .perform(get(ENTITY_API_URL_ID, sucursal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sucursal.getId().intValue()))
            .andExpect(jsonPath("$.uniqueId").value(DEFAULT_UNIQUE_ID.intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.direccion").value(DEFAULT_DIRECCION))
            .andExpect(jsonPath("$.telefono").value(DEFAULT_TELEFONO));
    }

    @Test
    @Transactional
    void getNonExistingSucursal() throws Exception {
        // Get the sucursal
        restSucursalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSucursal() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sucursal
        Sucursal updatedSucursal = sucursalRepository.findById(sucursal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSucursal are not directly saved in db
        em.detach(updatedSucursal);
        updatedSucursal.uniqueId(UPDATED_UNIQUE_ID).nombre(UPDATED_NOMBRE).direccion(UPDATED_DIRECCION).telefono(UPDATED_TELEFONO);

        restSucursalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSucursal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSucursal))
            )
            .andExpect(status().isOk());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSucursalToMatchAllProperties(updatedSucursal);
    }

    @Test
    @Transactional
    void putNonExistingSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sucursal.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sucursal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(sucursal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(sucursal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSucursalWithPatch() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sucursal using partial update
        Sucursal partialUpdatedSucursal = new Sucursal();
        partialUpdatedSucursal.setId(sucursal.getId());

        partialUpdatedSucursal.nombre(UPDATED_NOMBRE).direccion(UPDATED_DIRECCION).telefono(UPDATED_TELEFONO);

        restSucursalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSucursal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSucursal))
            )
            .andExpect(status().isOk());

        // Validate the Sucursal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSucursalUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSucursal, sucursal), getPersistedSucursal(sucursal));
    }

    @Test
    @Transactional
    void fullUpdateSucursalWithPatch() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the sucursal using partial update
        Sucursal partialUpdatedSucursal = new Sucursal();
        partialUpdatedSucursal.setId(sucursal.getId());

        partialUpdatedSucursal.uniqueId(UPDATED_UNIQUE_ID).nombre(UPDATED_NOMBRE).direccion(UPDATED_DIRECCION).telefono(UPDATED_TELEFONO);

        restSucursalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSucursal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSucursal))
            )
            .andExpect(status().isOk());

        // Validate the Sucursal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSucursalUpdatableFieldsEquals(partialUpdatedSucursal, getPersistedSucursal(partialUpdatedSucursal));
    }

    @Test
    @Transactional
    void patchNonExistingSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sucursal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sucursal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(sucursal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSucursal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        sucursal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSucursalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(sucursal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sucursal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSucursal() throws Exception {
        // Initialize the database
        insertedSucursal = sucursalRepository.saveAndFlush(sucursal);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the sucursal
        restSucursalMockMvc
            .perform(delete(ENTITY_API_URL_ID, sucursal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sucursalRepository.count();
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

    protected Sucursal getPersistedSucursal(Sucursal sucursal) {
        return sucursalRepository.findById(sucursal.getId()).orElseThrow();
    }

    protected void assertPersistedSucursalToMatchAllProperties(Sucursal expectedSucursal) {
        assertSucursalAllPropertiesEquals(expectedSucursal, getPersistedSucursal(expectedSucursal));
    }

    protected void assertPersistedSucursalToMatchUpdatableProperties(Sucursal expectedSucursal) {
        assertSucursalAllUpdatablePropertiesEquals(expectedSucursal, getPersistedSucursal(expectedSucursal));
    }
}
