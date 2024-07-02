package com.salabs.amanager.domain;

import static com.salabs.amanager.domain.AlumnoTestSamples.*;
import static com.salabs.amanager.domain.SucursalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.salabs.amanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AlumnoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Alumno.class);
        Alumno alumno1 = getAlumnoSample1();
        Alumno alumno2 = new Alumno();
        assertThat(alumno1).isNotEqualTo(alumno2);

        alumno2.setId(alumno1.getId());
        assertThat(alumno1).isEqualTo(alumno2);

        alumno2 = getAlumnoSample2();
        assertThat(alumno1).isNotEqualTo(alumno2);
    }

    @Test
    void sucursalTest() {
        Alumno alumno = getAlumnoRandomSampleGenerator();
        Sucursal sucursalBack = getSucursalRandomSampleGenerator();

        alumno.setSucursal(sucursalBack);
        assertThat(alumno.getSucursal()).isEqualTo(sucursalBack);

        alumno.sucursal(null);
        assertThat(alumno.getSucursal()).isNull();
    }
}
