package com.salabs.amanager.web.rest;

import static com.salabs.amanager.domain.AlumnoAsserts.*;
import static com.salabs.amanager.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.salabs.amanager.IntegrationTest;
import com.salabs.amanager.domain.Alumno;
import com.salabs.amanager.repository.AlumnoRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link AlumnoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AlumnoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA_NACIMIENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_NACIMIENTO = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DIRECCION = "AAAAAAAAAA";
    private static final String UPDATED_DIRECCION = "BBBBBBBBBB";

    private static final String DEFAULT_MADRE = "AAAAAAAAAA";
    private static final String UPDATED_MADRE = "BBBBBBBBBB";

    private static final String DEFAULT_PADRE = "AAAAAAAAAA";
    private static final String UPDATED_PADRE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACTO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACTO = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACTO_2 = "AAAAAAAAAA";
    private static final String UPDATED_CONTACTO_2 = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Integer DEFAULT_ACTIVO = 1;
    private static final Integer UPDATED_ACTIVO = 2;

    private static final Integer DEFAULT_INSCRITO = 1;
    private static final Integer UPDATED_INSCRITO = 2;

    private static final Long DEFAULT_SUCURSAL_ID = 1L;
    private static final Long UPDATED_SUCURSAL_ID = 2L;

    private static final String ENTITY_API_URL = "/api/alumnos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAlumnoMockMvc;

    private Alumno alumno;

    private Alumno insertedAlumno;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alumno createEntity(EntityManager em) {
        Alumno alumno = new Alumno()
            .nombre(DEFAULT_NOMBRE)
            .apellidos(DEFAULT_APELLIDOS)
            .fechaNacimiento(DEFAULT_FECHA_NACIMIENTO)
            .direccion(DEFAULT_DIRECCION)
            .madre(DEFAULT_MADRE)
            .padre(DEFAULT_PADRE)
            .contacto(DEFAULT_CONTACTO)
            .contacto2(DEFAULT_CONTACTO_2)
            .email(DEFAULT_EMAIL)
            .activo(DEFAULT_ACTIVO)
            .inscrito(DEFAULT_INSCRITO)
            .sucursalId(DEFAULT_SUCURSAL_ID);
        return alumno;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alumno createUpdatedEntity(EntityManager em) {
        Alumno alumno = new Alumno()
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .fechaNacimiento(UPDATED_FECHA_NACIMIENTO)
            .direccion(UPDATED_DIRECCION)
            .madre(UPDATED_MADRE)
            .padre(UPDATED_PADRE)
            .contacto(UPDATED_CONTACTO)
            .contacto2(UPDATED_CONTACTO_2)
            .email(UPDATED_EMAIL)
            .activo(UPDATED_ACTIVO)
            .inscrito(UPDATED_INSCRITO)
            .sucursalId(UPDATED_SUCURSAL_ID);
        return alumno;
    }

    @BeforeEach
    public void initTest() {
        alumno = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedAlumno != null) {
            alumnoRepository.delete(insertedAlumno);
            insertedAlumno = null;
        }
    }

    @Test
    @Transactional
    void createAlumno() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Alumno
        var returnedAlumno = om.readValue(
            restAlumnoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(alumno)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Alumno.class
        );

        // Validate the Alumno in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAlumnoUpdatableFieldsEquals(returnedAlumno, getPersistedAlumno(returnedAlumno));

        insertedAlumno = returnedAlumno;
    }

    @Test
    @Transactional
    void createAlumnoWithExistingId() throws Exception {
        // Create the Alumno with an existing ID
        alumno.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlumnoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(alumno)))
            .andExpect(status().isBadRequest());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAlumnos() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        // Get all the alumnoList
        restAlumnoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alumno.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].fechaNacimiento").value(hasItem(DEFAULT_FECHA_NACIMIENTO.toString())))
            .andExpect(jsonPath("$.[*].direccion").value(hasItem(DEFAULT_DIRECCION)))
            .andExpect(jsonPath("$.[*].madre").value(hasItem(DEFAULT_MADRE)))
            .andExpect(jsonPath("$.[*].padre").value(hasItem(DEFAULT_PADRE)))
            .andExpect(jsonPath("$.[*].contacto").value(hasItem(DEFAULT_CONTACTO)))
            .andExpect(jsonPath("$.[*].contacto2").value(hasItem(DEFAULT_CONTACTO_2)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].activo").value(hasItem(DEFAULT_ACTIVO)))
            .andExpect(jsonPath("$.[*].inscrito").value(hasItem(DEFAULT_INSCRITO)))
            .andExpect(jsonPath("$.[*].sucursalId").value(hasItem(DEFAULT_SUCURSAL_ID.intValue())));
    }

    @Test
    @Transactional
    void getAlumno() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        // Get the alumno
        restAlumnoMockMvc
            .perform(get(ENTITY_API_URL_ID, alumno.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(alumno.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.fechaNacimiento").value(DEFAULT_FECHA_NACIMIENTO.toString()))
            .andExpect(jsonPath("$.direccion").value(DEFAULT_DIRECCION))
            .andExpect(jsonPath("$.madre").value(DEFAULT_MADRE))
            .andExpect(jsonPath("$.padre").value(DEFAULT_PADRE))
            .andExpect(jsonPath("$.contacto").value(DEFAULT_CONTACTO))
            .andExpect(jsonPath("$.contacto2").value(DEFAULT_CONTACTO_2))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.activo").value(DEFAULT_ACTIVO))
            .andExpect(jsonPath("$.inscrito").value(DEFAULT_INSCRITO))
            .andExpect(jsonPath("$.sucursalId").value(DEFAULT_SUCURSAL_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAlumno() throws Exception {
        // Get the alumno
        restAlumnoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAlumno() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the alumno
        Alumno updatedAlumno = alumnoRepository.findById(alumno.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAlumno are not directly saved in db
        em.detach(updatedAlumno);
        updatedAlumno
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .fechaNacimiento(UPDATED_FECHA_NACIMIENTO)
            .direccion(UPDATED_DIRECCION)
            .madre(UPDATED_MADRE)
            .padre(UPDATED_PADRE)
            .contacto(UPDATED_CONTACTO)
            .contacto2(UPDATED_CONTACTO_2)
            .email(UPDATED_EMAIL)
            .activo(UPDATED_ACTIVO)
            .inscrito(UPDATED_INSCRITO)
            .sucursalId(UPDATED_SUCURSAL_ID);

        restAlumnoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAlumno.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAlumno))
            )
            .andExpect(status().isOk());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAlumnoToMatchAllProperties(updatedAlumno);
    }

    @Test
    @Transactional
    void putNonExistingAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(put(ENTITY_API_URL_ID, alumno.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(alumno)))
            .andExpect(status().isBadRequest());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(alumno))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(alumno)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAlumnoWithPatch() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the alumno using partial update
        Alumno partialUpdatedAlumno = new Alumno();
        partialUpdatedAlumno.setId(alumno.getId());

        partialUpdatedAlumno.contacto(UPDATED_CONTACTO).contacto2(UPDATED_CONTACTO_2);

        restAlumnoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlumno.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAlumno))
            )
            .andExpect(status().isOk());

        // Validate the Alumno in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlumnoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAlumno, alumno), getPersistedAlumno(alumno));
    }

    @Test
    @Transactional
    void fullUpdateAlumnoWithPatch() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the alumno using partial update
        Alumno partialUpdatedAlumno = new Alumno();
        partialUpdatedAlumno.setId(alumno.getId());

        partialUpdatedAlumno
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .fechaNacimiento(UPDATED_FECHA_NACIMIENTO)
            .direccion(UPDATED_DIRECCION)
            .madre(UPDATED_MADRE)
            .padre(UPDATED_PADRE)
            .contacto(UPDATED_CONTACTO)
            .contacto2(UPDATED_CONTACTO_2)
            .email(UPDATED_EMAIL)
            .activo(UPDATED_ACTIVO)
            .inscrito(UPDATED_INSCRITO)
            .sucursalId(UPDATED_SUCURSAL_ID);

        restAlumnoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlumno.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAlumno))
            )
            .andExpect(status().isOk());

        // Validate the Alumno in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlumnoUpdatableFieldsEquals(partialUpdatedAlumno, getPersistedAlumno(partialUpdatedAlumno));
    }

    @Test
    @Transactional
    void patchNonExistingAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, alumno.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(alumno))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(alumno))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAlumno() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        alumno.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlumnoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(alumno)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alumno in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAlumno() throws Exception {
        // Initialize the database
        insertedAlumno = alumnoRepository.saveAndFlush(alumno);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the alumno
        restAlumnoMockMvc
            .perform(delete(ENTITY_API_URL_ID, alumno.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return alumnoRepository.count();
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

    protected Alumno getPersistedAlumno(Alumno alumno) {
        return alumnoRepository.findById(alumno.getId()).orElseThrow();
    }

    protected void assertPersistedAlumnoToMatchAllProperties(Alumno expectedAlumno) {
        assertAlumnoAllPropertiesEquals(expectedAlumno, getPersistedAlumno(expectedAlumno));
    }

    protected void assertPersistedAlumnoToMatchUpdatableProperties(Alumno expectedAlumno) {
        assertAlumnoAllUpdatablePropertiesEquals(expectedAlumno, getPersistedAlumno(expectedAlumno));
    }
}
