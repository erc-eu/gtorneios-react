package br.ufc.web.springrest01.repository;


import org.springframework.data.repository.CrudRepository;


import br.ufc.web.springrest01.model.Time;
import br.ufc.web.springrest01.model.Torneio;

import java.util.List;
import java.util.Optional;

public interface TimeRepository extends CrudRepository<Time, Integer> {
    List<Time> findByTorneioCod(Optional<Torneio> torneioCod);

    List<Time> findByVencedor(boolean vencedor);

    List<Time> findByTorneioCodAndVencedor(Optional<Torneio> torneioCod, boolean vencedorBool);

}
