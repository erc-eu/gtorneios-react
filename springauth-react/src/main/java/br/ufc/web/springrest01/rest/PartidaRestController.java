package br.ufc.web.springrest01.rest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

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
                }else{
                    return null;
                }

            }
            return timesDaPartida;
        } else {
            return null;
        }
    }

    @PostMapping
    Partida addPartida(@RequestBody Map<String, List<Time>> timesMap) {
        List<Time> timesPares = timesMap.get("time2");
        List<Time> timesImpares = timesMap.get("time1");

        if (timesPares.size() == timesImpares.size()) {
            for (int i = 0; i < timesPares.size(); i++) {
                Partida partida = new Partida();
                Time timePar = timesPares.get(i);
                Time timeImpar = timesImpares.get(i);

                partida.setTime1(timePar);
                partida.setTime2(timeImpar);
                partida.setDataHora(LocalDateTime.now());
                partida.setEstatisticas("null");
                partida.setMomentoDaPontuacao("null");
                partida.setPlacar("asd");
                partida.setLocal("null");
                partidaRepository.save(partida);
            }

        }
        return null;
    }
}
