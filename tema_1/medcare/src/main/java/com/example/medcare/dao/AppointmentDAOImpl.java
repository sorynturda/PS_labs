package com.example.medcare.dao;

import com.example.medcare.model.entity.Appointment;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class AppointmentDAOImpl implements AppointmentDAO{
    private EntityManager entityManager;

    @Autowired
    public AppointmentDAOImpl(EntityManager entityManager){
        this.entityManager=entityManager;
    }

    @Override
    @Transactional
    public void save(Appointment appointment) {
        entityManager.persist(appointment);
    }

    @Override
    @Transactional
    public void delete(int id) {
        Appointment ap = entityManager.find(Appointment.class, id);
        entityManager.remove(ap);
    }

    @Override
    @Transactional
    public void update(Appointment appointment) {
        entityManager.merge(appointment);
    }

    @Override
    public List<Appointment> findAll() {
        return entityManager.createQuery("FROM Appointment", Appointment.class).getResultList();
    }
}
