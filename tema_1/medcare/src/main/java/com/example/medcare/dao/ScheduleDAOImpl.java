package com.example.medcare.dao;

import com.example.medcare.model.entity.Doctor;
import com.example.medcare.model.entity.Schedule;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class ScheduleDAOImpl implements ScheduleDAO {
    private EntityManager entityManager;
    @Autowired
    public ScheduleDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void save(Schedule schedule) {
        entityManager.persist(schedule);
    }

    @Override
    @Transactional
    public void update(Schedule schedule) {
        entityManager.merge(schedule);
    }

    @Override
    @Transactional
    public void delete(int id) {
        Schedule schedule = entityManager.find(Schedule.class, id);
        entityManager.remove(schedule);
    }

    @Override
    public List<Schedule> findByDoctor(Doctor doctor) {
        TypedQuery<Schedule> query=entityManager.createQuery("FROM Schedule where doctor=:doctor", Schedule.class);
        query.setParameter("doctor", doctor);
        return query.getResultList();

    }
}
