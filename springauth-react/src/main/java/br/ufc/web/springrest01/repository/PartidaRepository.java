package br.ufc.web.springrest01.repository;

import org.springframework.data.repository.CrudRepository;

import br.ufc.web.springrest01.model.Partida;
import br.ufc.web.springrest01.model.Time;

import java.util.List;


public interface PartidaRepository extends CrudRepository <Partida, Integer> {
    List<Partida> findByTime1(Time time1);
    List<Partida> findByTime2(Time time2);
}
