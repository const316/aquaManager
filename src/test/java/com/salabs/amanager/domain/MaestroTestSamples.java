package com.salabs.amanager.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MaestroTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Maestro getMaestroSample1() {
        return new Maestro().id(1L).uniqueId(1L).nombre("nombre1").apellidos("apellidos1").contacto("contacto1").activo(1);
    }

    public static Maestro getMaestroSample2() {
        return new Maestro().id(2L).uniqueId(2L).nombre("nombre2").apellidos("apellidos2").contacto("contacto2").activo(2);
    }

    public static Maestro getMaestroRandomSampleGenerator() {
        return new Maestro()
            .id(longCount.incrementAndGet())
            .uniqueId(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .apellidos(UUID.randomUUID().toString())
            .contacto(UUID.randomUUID().toString())
            .activo(intCount.incrementAndGet());
    }
}
