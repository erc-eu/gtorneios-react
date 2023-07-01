package br.ufc.web.springrest01.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.ufc.web.springrest01.model.Partida;
import br.ufc.web.springrest01.model.Time;

import java.util.List;
import java.util.Optional;

public interface PartidaRepository extends CrudRepository<Partida, Integer> {
        List<Partida> findByTime1(Time time1);

        List<Partida> findByTime2(Time time2);

        @Query(value = "SELECT p.*\r\n" + //
                        "FROM partida p\r\n" + //
                        "WHERE p.placar IS NOT NULL\r\n" + //
                        "GROUP BY LEAST(p.time1_cod_time, p.time2_cod_time), GREATEST(p.time1_cod_time, p.time2_cod_time);", nativeQuery = true)
        List<Partida> findDistinctByTime(@Param("time") Time time);

        @Query(value = "SELECT p.* " +
                        "FROM partida p " +
                        "WHERE (p.time1_cod_time = :time OR p.time2_cod_time = :time) AND p.placar IS NULL", nativeQuery = true)
        Optional<Partida> findByTime1OrTime2(@Param("time") Time time);

        @Query(value = "SELECT p.* FROM partida p " +
                        "JOIN time t1 ON p.time1_cod_time = t1.cod_time " +
                        "JOIN time t2 ON p.time2_cod_time = t2.cod_time " +
                        "JOIN torneio torn ON t1.torneio_cod_cod_torneio = torn.cod_torneio " +
                        "WHERE torn.cod_torneio = :torneioId " +
                        "AND t1.vencedor = true " +
                        "AND t2.vencedor = true", nativeQuery = true)
        List<Partida> findPartidasByTorneioAndVencedorTrue(@Param("torneioId") Integer torneioId);

        @Query(value = "SELECT p.* " +
                        "FROM partida p JOIN time t ON p.time1_cod_time = t.cod_time  " +
                        "JOIN torneio torn ON :torneioId = t.torneio_cod_cod_torneio GROUP BY (p.cod_partida)", nativeQuery = true)
        List<Partida> findPartidasByTorneio(@Param("torneioId") Integer torneioId);

}
