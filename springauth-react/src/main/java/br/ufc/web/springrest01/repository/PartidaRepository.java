package br.ufc.web.springrest01.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.ufc.web.springrest01.model.Partida;
import br.ufc.web.springrest01.model.Time;

import java.util.List;

public interface PartidaRepository extends CrudRepository<Partida, Integer> {
    List<Partida> findByTime1(Time time1);

    List<Partida> findByTime2(Time time2);

    @Query(value = "SELECT p.*\r\n" + //
            "FROM partida p\r\n" + //
            "WHERE p.placar IS NOT NULL\r\n" + //
            "GROUP BY LEAST(p.time1_cod_time, p.time2_cod_time), GREATEST(p.time1_cod_time, p.time2_cod_time);", nativeQuery = true)
    List<Partida> findDistinctByTime(@Param("time") Time time);
}
