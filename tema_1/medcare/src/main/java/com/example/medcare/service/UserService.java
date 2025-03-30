package com.example.medcare.service;

import com.example.medcare.dao.UserDAO;
import com.example.medcare.dao.UserDAOImpl;
import com.example.medcare.model.entity.User;
import com.example.medcare.util.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private UserDAO userDAO;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
    }


    public void createUser(String name, String username, String password) throws Exception {
        List<User> users = userDAO.findAll();
        for (User u : users)
            if (u.getUsername().equals(username))
                throw new Exception("this username already exists");
        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole_(String.valueOf(UserRole.USER));
        userDAO.save(user);
    }

    public Optional<User> authenticate(String username, String password) {
        User user = userDAO.findByUsername(username);
        if(user == null)
            return Optional.empty();
        if(passwordEncoder.matches(password, user.getPasswordHash()))
            return Optional.of(user);
        return Optional.empty();
    }

    public List<User> getAllUsers(){
        return userDAO.findAll();
    }
    public void removeUser(int id){
        userDAO.delete(id);
    }
}
