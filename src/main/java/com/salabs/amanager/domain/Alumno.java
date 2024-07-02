package com.salabs.amanager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Alumno.
 */
@Entity
@Table(name = "alumno")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Alumno implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "unique_id")
    private Long uniqueId;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "madre")
    private String madre;

    @Column(name = "padre")
    private String padre;

    @Column(name = "contacto")
    private String contacto;

    @Column(name = "contacto_2")
    private String contacto2;

    @Column(name = "email")
    private String email;

    @Column(name = "activo")
    private Integer activo;

    @Column(name = "inscrito")
    private Integer inscrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "alumnos", "maestros" }, allowSetters = true)
    private Sucursal sucursal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Alumno id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUniqueId() {
        return this.uniqueId;
    }

    public Alumno uniqueId(Long uniqueId) {
        this.setUniqueId(uniqueId);
        return this;
    }

    public void setUniqueId(Long uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Alumno nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return this.apellidos;
    }

    public Alumno apellidos(String apellidos) {
        this.setApellidos(apellidos);
        return this;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public LocalDate getFechaNacimiento() {
        return this.fechaNacimiento;
    }

    public Alumno fechaNacimiento(LocalDate fechaNacimiento) {
        this.setFechaNacimiento(fechaNacimiento);
        return this;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getDireccion() {
        return this.direccion;
    }

    public Alumno direccion(String direccion) {
        this.setDireccion(direccion);
        return this;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getMadre() {
        return this.madre;
    }

    public Alumno madre(String madre) {
        this.setMadre(madre);
        return this;
    }

    public void setMadre(String madre) {
        this.madre = madre;
    }

    public String getPadre() {
        return this.padre;
    }

    public Alumno padre(String padre) {
        this.setPadre(padre);
        return this;
    }

    public void setPadre(String padre) {
        this.padre = padre;
    }

    public String getContacto() {
        return this.contacto;
    }

    public Alumno contacto(String contacto) {
        this.setContacto(contacto);
        return this;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }

    public String getContacto2() {
        return this.contacto2;
    }

    public Alumno contacto2(String contacto2) {
        this.setContacto2(contacto2);
        return this;
    }

    public void setContacto2(String contacto2) {
        this.contacto2 = contacto2;
    }

    public String getEmail() {
        return this.email;
    }

    public Alumno email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getActivo() {
        return this.activo;
    }

    public Alumno activo(Integer activo) {
        this.setActivo(activo);
        return this;
    }

    public void setActivo(Integer activo) {
        this.activo = activo;
    }

    public Integer getInscrito() {
        return this.inscrito;
    }

    public Alumno inscrito(Integer inscrito) {
        this.setInscrito(inscrito);
        return this;
    }

    public void setInscrito(Integer inscrito) {
        this.inscrito = inscrito;
    }

    public Sucursal getSucursal() {
        return this.sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }

    public Alumno sucursal(Sucursal sucursal) {
        this.setSucursal(sucursal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Alumno)) {
            return false;
        }
        return getId() != null && getId().equals(((Alumno) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Alumno{" +
            "id=" + getId() +
            ", uniqueId=" + getUniqueId() +
            ", nombre='" + getNombre() + "'" +
            ", apellidos='" + getApellidos() + "'" +
            ", fechaNacimiento='" + getFechaNacimiento() + "'" +
            ", direccion='" + getDireccion() + "'" +
            ", madre='" + getMadre() + "'" +
            ", padre='" + getPadre() + "'" +
            ", contacto='" + getContacto() + "'" +
            ", contacto2='" + getContacto2() + "'" +
            ", email='" + getEmail() + "'" +
            ", activo=" + getActivo() +
            ", inscrito=" + getInscrito() +
            "}";
    }
}
