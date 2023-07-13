package br.ufc.web.springrest01.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.ufc.web.springrest01.model.Time;
import br.ufc.web.springrest01.model.Torneio;

import java.util.List;
import java.util.Optional;

public interface TimeRepository extends CrudRepository<Time, Integer> {
    List<Time> findByTorneioCod(Optional<Torneio> torneioCod);

    List<Time> findByVencedor(boolean vencedor);

    List<Time> findByTorneioCodAndVencedor(Optional<Torneio> torneioCod, boolean vencedorBool);

    @Query(value = "SELECT t.*\r\n" + //
            "FROM time t JOIN torneio torn ON t.torneio_cod_cod_torneio = torn.cod_torneio JOIN user u ON :userId = torn.organizador_id GROUP BY t.cod_time;;\r\n"
            + //
            "\r\n" + //
            "", nativeQuery = true)
    List<Time> qntTimesParticipantes(@Param("userId") Integer userId);
}
