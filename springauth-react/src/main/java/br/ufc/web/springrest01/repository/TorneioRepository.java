package br.ufc.web.springrest01.repository;

import org.springframework.data.repository.CrudRepository;

import br.ufc.web.springrest01.model.Torneio;

public interface TorneioRepository extends CrudRepository<Torneio, Integer> {
    
}
