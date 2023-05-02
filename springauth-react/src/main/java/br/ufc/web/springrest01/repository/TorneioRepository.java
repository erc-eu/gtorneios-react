package br.ufc.web.springrest01.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import br.ufc.web.springrest01.model.Torneio;
import br.ufc.web.springrest01.model.User;


public interface TorneioRepository extends CrudRepository<Torneio, Integer> {
    List<Torneio> findByOrganizador(Optional<User> organizador);
}
