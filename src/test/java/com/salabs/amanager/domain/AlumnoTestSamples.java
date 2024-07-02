package com.salabs.amanager.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AlumnoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Alumno getAlumnoSample1() {
        return new Alumno()
            .id(1L)
            .nombre("nombre1")
            .apellidos("apellidos1")
            .direccion("direccion1")
            .madre("madre1")
            .padre("padre1")
            .contacto("contacto1")
            .contacto2("contacto21")
            .email("email1")
            .activo(1)
            .inscrito(1)
            .sucursalId(1L);
    }

    public static Alumno getAlumnoSample2() {
        return new Alumno()
            .id(2L)
            .nombre("nombre2")
            .apellidos("apellidos2")
            .direccion("direccion2")
            .madre("madre2")
            .padre("padre2")
            .contacto("contacto2")
            .contacto2("contacto22")
            .email("email2")
            .activo(2)
            .inscrito(2)
            .sucursalId(2L);
    }

    public static Alumno getAlumnoRandomSampleGenerator() {
        return new Alumno()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .apellidos(UUID.randomUUID().toString())
            .direccion(UUID.randomUUID().toString())
            .madre(UUID.randomUUID().toString())
            .padre(UUID.randomUUID().toString())
            .contacto(UUID.randomUUID().toString())
            .contacto2(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .activo(intCount.incrementAndGet())
            .inscrito(intCount.incrementAndGet())
            .sucursalId(longCount.incrementAndGet());
    }
}
