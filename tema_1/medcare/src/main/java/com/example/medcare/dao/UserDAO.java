package com.example.medcare.dao;

import com.example.medcare.entity.User;

import java.util.List;

public interface UserDAO {
    void save(User user);
    void delete(int id);
    void update(User user);
    List<User> findAll();
    User findById(int id);
}
