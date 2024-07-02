package com.salabs.amanager.domain;

import static com.salabs.amanager.domain.AlumnoTestSamples.*;
import static com.salabs.amanager.domain.MaestroTestSamples.*;
import static com.salabs.amanager.domain.SucursalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.salabs.amanager.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SucursalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sucursal.class);
        Sucursal sucursal1 = getSucursalSample1();
        Sucursal sucursal2 = new Sucursal();
        assertThat(sucursal1).isNotEqualTo(sucursal2);

        sucursal2.setId(sucursal1.getId());
        assertThat(sucursal1).isEqualTo(sucursal2);

        sucursal2 = getSucursalSample2();
        assertThat(sucursal1).isNotEqualTo(sucursal2);
    }

    @Test
    void alumnoTest() {
        Sucursal sucursal = getSucursalRandomSampleGenerator();
        Alumno alumnoBack = getAlumnoRandomSampleGenerator();

        sucursal.addAlumno(alumnoBack);
        assertThat(sucursal.getAlumnos()).containsOnly(alumnoBack);
        assertThat(alumnoBack.getSucursal()).isEqualTo(sucursal);

        sucursal.removeAlumno(alumnoBack);
        assertThat(sucursal.getAlumnos()).doesNotContain(alumnoBack);
        assertThat(alumnoBack.getSucursal()).isNull();

        sucursal.alumnos(new HashSet<>(Set.of(alumnoBack)));
        assertThat(sucursal.getAlumnos()).containsOnly(alumnoBack);
        assertThat(alumnoBack.getSucursal()).isEqualTo(sucursal);

        sucursal.setAlumnos(new HashSet<>());
        assertThat(sucursal.getAlumnos()).doesNotContain(alumnoBack);
        assertThat(alumnoBack.getSucursal()).isNull();
    }

    @Test
    void maestroTest() {
        Sucursal sucursal = getSucursalRandomSampleGenerator();
        Maestro maestroBack = getMaestroRandomSampleGenerator();

        sucursal.addMaestro(maestroBack);
        assertThat(sucursal.getMaestros()).containsOnly(maestroBack);
        assertThat(maestroBack.getSucursal()).isEqualTo(sucursal);

        sucursal.removeMaestro(maestroBack);
        assertThat(sucursal.getMaestros()).doesNotContain(maestroBack);
        assertThat(maestroBack.getSucursal()).isNull();

        sucursal.maestros(new HashSet<>(Set.of(maestroBack)));
        assertThat(sucursal.getMaestros()).containsOnly(maestroBack);
        assertThat(maestroBack.getSucursal()).isEqualTo(sucursal);

        sucursal.setMaestros(new HashSet<>());
        assertThat(sucursal.getMaestros()).doesNotContain(maestroBack);
        assertThat(maestroBack.getSucursal()).isNull();
    }
}
