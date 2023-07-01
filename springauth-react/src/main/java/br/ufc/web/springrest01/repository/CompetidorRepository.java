package br.ufc.web.springrest01.repository;

import org.springframework.data.repository.CrudRepository;

import br.ufc.web.springrest01.model.Competidor;
import br.ufc.web.springrest01.model.Time;

import java.util.List;
import java.util.Optional;


public interface CompetidorRepository extends CrudRepository<Competidor, Integer > {
    List<Competidor> findByCompetidorDoTime(Optional<Time> competidorDoTime);
}
