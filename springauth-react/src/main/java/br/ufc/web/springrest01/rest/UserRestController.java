package br.ufc.web.springrest01.rest;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.web.springrest01.model.User;
import br.ufc.web.springrest01.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserRestController {

    @Autowired
    UserRepository userRepository;

 

    @Autowired
    private PasswordEncoder passwordEncoder;
        

    @GetMapping("/me")
    Principal getMet(Principal me) {
        return me;
    }

    @GetMapping
    Iterable<User> getUsers(@RequestParam Map<String, String> query) {
        Iterable<User> findAll = userRepository.findAll();
        return findAll;
    }

    @GetMapping(path = { "/{id}" })
    User getUser(@PathVariable Integer id) {
        Optional<User> result = userRepository.findById(id);
        return !result.isPresent() ? null : result.get();
    }

    @PutMapping(path = { "/{codigo}" })
    Optional<User> alterUser(@RequestBody User userAlt, @PathVariable Integer codigo) {
        Optional<User> user = userRepository.findById(codigo);
        if (user.isPresent()) {
            User usuario = user.get();
            System.out.println("entrou");
            usuario.setEmail(userAlt.getEmail());
            usuario.setAvatar(userAlt.getAvatar());
            userRepository.save(usuario);
            return user;
        }
        return null;
    }

    @PostMapping
    UserDTO addUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getUsername(), savedUser.getEmail());
    }


    
}