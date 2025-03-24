package com.example.medcare.dao;

import com.example.medcare.entity.Doctor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.List;
@Repository
public class DoctorDAOImpl implements DoctorDAO{
    private EntityManager entityManager;

    @Autowired
    public DoctorDAOImpl(EntityManager entityManager){
        this.entityManager=entityManager;
    }

    @Override
    @Transactional
    public void save(Doctor doctor) {
        entityManager.persist(doctor);
    }

    @Override
    @Transactional
    public void delete(int id) {
        Doctor doctor = entityManager.find(Doctor.class, id);
        entityManager.remove(doctor);
    }

    @Override
    @Transactional
    public void update(Doctor doctor) {
        entityManager.merge(doctor);
    }

    @Override
    public List<Doctor> findAll() {
        TypedQuery<Doctor> query = entityManager.createQuery("FROM Doctor", Doctor.class);
        return query.getResultList();
    }

    @Override
    public Doctor findById(int id) {
        return entityManager.find(Doctor.class, id);
    }

    @Override
    public String toString() {
        return "DoctorDAOImpl{" +
                "entityManager=" + entityManager +
                '}';
    }
}
