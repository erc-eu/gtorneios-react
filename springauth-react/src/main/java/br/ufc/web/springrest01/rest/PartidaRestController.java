package br.ufc.web.springrest01.rest;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @GetMapping(path = { "/{id}" })
    List<Time> pegarTimesPartida(@PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);

        if (torn.isPresent()) { // Verifica se o torneio existe
            List<Time> times = timeRepository.findByTorneioCod(torn);
            List<Time> timesDaPartida = new ArrayList<>();

            for (Time time : times) {
                List<Partida> partidasTime1 = partidaRepository.findByTime1(time);
                List<Partida> partidasTime2 = partidaRepository.findByTime2(time);
                if (partidasTime1 != null && partidasTime2 != null) {
                    for (Partida partida : partidasTime1) {
                        timesDaPartida.add(partida.getTime1());
                        timesDaPartida.add(partida.getTime2());
                    }
                } else {
                    return null;
                }
            }
            return timesDaPartida;
        } else {
            return null;
        }
    }

    @PostMapping
    List<Time> addPartida(@RequestBody List<Map<String, Time>> partidasMap) {
        List<Time> timesDaPartida = new ArrayList<>();

        for (Map<String, Time> partidaMap : partidasMap) {
            Time time1 = partidaMap.get("time1");
            Time time2 = partidaMap.get("time2");

            Partida partida = new Partida();
            partida.setTime1(time1);
            partida.setTime2(time2);

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
