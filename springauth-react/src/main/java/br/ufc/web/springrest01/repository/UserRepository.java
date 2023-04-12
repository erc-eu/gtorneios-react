package br.ufc.web.springrest01.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import br.ufc.web.springrest01.model.User;

public interface UserRepository extends CrudRepository<User, Integer>{

    Optional<User> findUserByUsername(String username);

}
