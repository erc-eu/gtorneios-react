package br.ufc.web.springrest01.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.ufc.web.springrest01.model.Competidor;
import br.ufc.web.springrest01.model.Time;

import java.util.List;
import java.util.Optional;


public interface CompetidorRepository extends CrudRepository<Competidor, Integer > {
    List<Competidor> findByCompetidorDoTime(Optional<Time> competidorDoTime);

     @Query(value = "SELECT c.*\r\n" + //
             "FROM competidor c JOIN time t ON t.cod_time = c.competidor_do_time_cod_time JOIN torneio tor ON tor.cod_torneio = t.torneio_cod_cod_torneio JOIN user us ON :userId = tor.organizador_id GROUP BY c.cod_competidor\r\n" + //
             "", nativeQuery = true)
    List<Competidor> findByNumJogadoresDoTorneio(@Param("userId") Integer userId);

}
