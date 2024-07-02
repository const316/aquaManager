package com.salabs.amanager.domain;

import static com.salabs.amanager.domain.MaestroTestSamples.*;
import static com.salabs.amanager.domain.SucursalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.salabs.amanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MaestroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Maestro.class);
        Maestro maestro1 = getMaestroSample1();
        Maestro maestro2 = new Maestro();
        assertThat(maestro1).isNotEqualTo(maestro2);

        maestro2.setId(maestro1.getId());
        assertThat(maestro1).isEqualTo(maestro2);

        maestro2 = getMaestroSample2();
        assertThat(maestro1).isNotEqualTo(maestro2);
    }

    @Test
    void sucursalTest() {
        Maestro maestro = getMaestroRandomSampleGenerator();
        Sucursal sucursalBack = getSucursalRandomSampleGenerator();

        maestro.setSucursal(sucursalBack);
        assertThat(maestro.getSucursal()).isEqualTo(sucursalBack);

        maestro.sucursal(null);
        assertThat(maestro.getSucursal()).isNull();
    }
}
