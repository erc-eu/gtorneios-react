package br.ufc.web.springrest01.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.web.springrest01.model.Partida;
import br.ufc.web.springrest01.model.Time;
import br.ufc.web.springrest01.model.Torneio;
import br.ufc.web.springrest01.repository.PartidaRepository;
import br.ufc.web.springrest01.repository.TimeRepository;
import br.ufc.web.springrest01.repository.TorneioRepository;

@RestController
@RequestMapping("/api/partida")
public class PartidaRestController {

    @Autowired
    PartidaRepository partidaRepository;

    @Autowired
    TorneioRepository torneioRepository;

    @Autowired
    TimeRepository timeRepository;

    @GetMapping
    Iterable<Partida> getPartidas() {
        Iterable<Partida> getPartida = partidaRepository.findAll();
        return getPartida;
    }

    @GetMapping(path = { "/p/{id}" })
    List<Partida> partidasPeloTorneio(@PathVariable Integer id) {
        List<Partida> partidas = partidaRepository.findPartidasByTorneioAndVencedorTrue(id);
        return partidas;
    }

    @GetMapping(path = { "/{id}/historico" })
    List<Partida> getHistoricoPartidas(@PathVariable Integer id) {
        List<Partida> p = partidaRepository.findPartidasByTorneio(id);
        return p;
    }

    @GetMapping(path = { "/{id}" })
    List<Time> pegarTimesPartida(@PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);
        if (torn.isPresent()) { // Verifica se o torneio existe
            List<Time> times = timeRepository.findByTorneioCodAndVencedor(torn, true);
            List<Time> timesDaPartida = new ArrayList<>();

            for (Time time : times) {

                List<Partida> partidasTime1 = partidaRepository.findByTime1(time);
                if (partidasTime1 != null) {
                    for (Partida partida : partidasTime1) {
                        if (partida.getTime1() != null && partida.getTime2() == null) {
                            timesDaPartida.clear();
                            timesDaPartida.add(partida.getTime1());
                            break;
                        }
                        if (partida.getTime1().isVencedor() && partida.getTime2().isVencedor()) {
                            timesDaPartida.add(partida.getTime1());
                            timesDaPartida.add(partida.getTime2());
                        }
                    }
                }

            }
            return timesDaPartida;
        }
        return null;
    }

    @GetMapping(path = { "/{id}/finalizados" })
    List<Partida> getTorneiosFinalizados(@PathVariable Integer id) {
        List<Partida> numPartidas = partidaRepository.numTorneiosFinalizados(id);
        return numPartidas;
    }

    @GetMapping(path = { "/{id}/primeira-data-torneio" })
    public List<Object[]> getPrimeiraDataPorTorneio(@PathVariable Integer id) {
        return partidaRepository.findPrimeiraDataPorTorneio(id);
    }

    @GetMapping(path = { "/{id}/ultima-data-torneio" })
    public List<Object[]> getUltimaDataPorTorneio(@PathVariable Integer id) {
        return partidaRepository.findUltimaDataPorTorneio(id);
    }

    @PostMapping
    public List<Time> addPartida(@RequestBody List<Partida> partidas) {
        List<Time> timesDaPartida = new ArrayList<>();

        for (Partida partida : partidas) {
            Time time1 = partida.getTime1();
            Time time2 = partida.getTime2();

            partidaRepository.save(partida);

            timesDaPartida.add(time1);
            timesDaPartida.add(time2);
        }

        return timesDaPartida;
    }

    @DeleteMapping(path = { "/{id}" })
    String delete(@PathVariable Integer id) {
        Optional<Time> t = timeRepository.findById(id);
        List<Partida> p1 = partidaRepository.findByTime1(t.get());
        List<Partida> p2 = partidaRepository.findByTime2(t.get());
        if (p1 != null) {
            for (Partida p : p1) {
                partidaRepository.delete(p);
            }
        }
        if (p2 != null) {
            for (Partida p : p2) {
                partidaRepository.delete(p);
            }
        }

        timeRepository.deleteById(id);
        return "Deleted";
    }
}
