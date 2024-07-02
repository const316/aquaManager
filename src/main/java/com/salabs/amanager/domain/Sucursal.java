package com.salabs.amanager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sucursal.
 */
@Entity
@Table(name = "sucursal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Sucursal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "telefono")
    private String telefono;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sucursal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sucursal" }, allowSetters = true)
    private Set<Alumno> alumnos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sucursal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sucursal" }, allowSetters = true)
    private Set<Maestro> maestros = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sucursal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Sucursal nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return this.direccion;
    }

    public Sucursal direccion(String direccion) {
        this.setDireccion(direccion);
        return this;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public Sucursal telefono(String telefono) {
        this.setTelefono(telefono);
        return this;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Set<Alumno> getAlumnos() {
        return this.alumnos;
    }

    public void setAlumnos(Set<Alumno> alumnos) {
        if (this.alumnos != null) {
            this.alumnos.forEach(i -> i.setSucursal(null));
        }
        if (alumnos != null) {
            alumnos.forEach(i -> i.setSucursal(this));
        }
        this.alumnos = alumnos;
    }

    public Sucursal alumnos(Set<Alumno> alumnos) {
        this.setAlumnos(alumnos);
        return this;
    }

    public Sucursal addAlumno(Alumno alumno) {
        this.alumnos.add(alumno);
        alumno.setSucursal(this);
        return this;
    }

    public Sucursal removeAlumno(Alumno alumno) {
        this.alumnos.remove(alumno);
        alumno.setSucursal(null);
        return this;
    }

    public Set<Maestro> getMaestros() {
        return this.maestros;
    }

    public void setMaestros(Set<Maestro> maestros) {
        if (this.maestros != null) {
            this.maestros.forEach(i -> i.setSucursal(null));
        }
        if (maestros != null) {
            maestros.forEach(i -> i.setSucursal(this));
        }
        this.maestros = maestros;
    }

    public Sucursal maestros(Set<Maestro> maestros) {
        this.setMaestros(maestros);
        return this;
    }

    public Sucursal addMaestro(Maestro maestro) {
        this.maestros.add(maestro);
        maestro.setSucursal(this);
        return this;
    }

    public Sucursal removeMaestro(Maestro maestro) {
        this.maestros.remove(maestro);
        maestro.setSucursal(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sucursal)) {
            return false;
        }
        return getId() != null && getId().equals(((Sucursal) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sucursal{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", direccion='" + getDireccion() + "'" +
            ", telefono='" + getTelefono() + "'" +
            "}";
    }
}
