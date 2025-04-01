package com.example.medcare.service;

import com.example.medcare.dao.MedicalServiceDAO;
import com.example.medcare.model.entity.MedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MedicalServiceService {
    private MedicalServiceDAO medicalServiceDAO;

    @Autowired
    public MedicalServiceService(MedicalServiceDAO medicalServiceDAO) {
        this.medicalServiceDAO = medicalServiceDAO;
    }

    public void createService(String name, double price, int duration) {
        List<MedicalService> services = getAllServices();
        for (MedicalService s : services)
            if (s.getName().equalsIgnoreCase(name))
                return;
        MedicalService ms = new MedicalService();
        ms.setName(name.trim());
        ms.setPrice(price);
        ms.setDurationMinutes(duration);
        medicalServiceDAO.save(ms);
    }

    public List<MedicalService> getAllServices() {
        return medicalServiceDAO.findAll();
    }

    public void updateService(Integer serviceId, String serviceName, Double servicePrice, Integer serviceDuracion) {
        MedicalService service = new MedicalService();
        service.setId(serviceId);
        service.setName(serviceName);
        service.setPrice(servicePrice);
        service.setDurationMinutes(serviceDuracion);
        medicalServiceDAO.update(service);
    }
}
