package com.example.medcare.dao;

import com.example.medcare.model.entity.MedicalService;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class MedicalServiceDAOImpl implements MedicalServiceDAO {
    private EntityManager entityManager;

    @Autowired
    public MedicalServiceDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void save(MedicalService medicalService) {
        entityManager.persist(medicalService);
    }

    @Override
    @Transactional
    public void delete(int id) {
        MedicalService ms = entityManager.find(MedicalService.class, id);
        entityManager.remove(ms);
    }

    @Override
    @Transactional
    public void update(MedicalService medicalService) {
        entityManager.merge(medicalService);
    }

    @Override
    public List<MedicalService> findAll() {
        return entityManager.createQuery("FROM MedicalService", MedicalService.class).getResultList();
    }
}
