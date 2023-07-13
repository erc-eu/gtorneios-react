package br.ufc.web.springrest01.rest;


import java.time.LocalDateTime;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@RequestMapping("/api/time")
public class TimeRestController {

    @Autowired
    TimeRepository timeRepository;

    @Autowired
    TorneioRepository torneioRepository;

    @Autowired
    PartidaRepository partidaRepository;

    @GetMapping
    Iterable<Time> getTimes() {
        Iterable<Time> getTime = timeRepository.findAll();
        return getTime;
    }

    @GetMapping(path = { "/{id}" })
    Iterable<Time> getTimesPeloCodTorneio(@PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);
        List<Time> team = timeRepository.findByTorneioCod(torn);
        return team;
    }

    @GetMapping(path = { "/{id}/vencedor" })
    Iterable<Time> getTimesPeloCodTorneioAndVencedor(@PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);
        List<Time> team = timeRepository.findByTorneioCodAndVencedor(torn, true);
        return team;
    }

    @GetMapping(path = { "/{id}/qtdTimesParticipantes" })
    List<Time> qtdTimesParticipantes(@PathVariable Integer id) {
        return timeRepository.qntTimesParticipantes(id);
    }

    @PostMapping(path = { "/{id}" })
    Time addTime(@RequestBody Time time, @PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);
        if (torn.isPresent()) {
            time.setTorneioCod(torn.get());
            time.setVencedor(true);
            Time savedTime = timeRepository.save(time);
            return savedTime;
        }
        return null;
    }

    @DeleteMapping(path = { "/{id}" })
    String delTime(@PathVariable Integer id) {
        timeRepository.deleteById(id);
        return "Time Deletado";
    }

    @PutMapping(path = { "/{id}/{codTorneio}" })
    List<Time> eliminarTime(@PathVariable Integer id, @PathVariable Integer codTorneio, @RequestBody Partida str) {
        Optional<Time> timeOptional = timeRepository.findById(id);
        Optional<Torneio> torneioOptional = torneioRepository.findById(codTorneio);
        LocalDateTime dataHoraAtual = LocalDateTime.now();

        if (timeOptional.isPresent()) {
            Time time = timeOptional.get();
            time.setVencedor(false);
            timeRepository.save(time);

            Optional<Partida> partidas = partidaRepository.findByTime1OrTime2(time);
            if (partidas.isPresent() && partidas.get().getPlacar() == null) {
                partidas.get().setPlacar(str.getPlacar());
                partidas.get().setMomentoDaPontuacao(str.getMomentoDaPontuacao());
                partidas.get().setDataHora(dataHoraAtual);
                partidas.get().setEstatisticas(str.getEstatisticas());
                partidaRepository.save(partidas.get());
            }
        }

        if (torneioOptional.isPresent()) {
            return timeRepository.findByTorneioCodAndVencedor(torneioOptional, true);
        } else {
            return new ArrayList<>(); // Retorna uma lista vazia caso torneioOptional não esteja presente
        }
    }

    @PutMapping(path = { "/{id}" })
    Optional<Time> putTime(@PathVariable Integer id, @RequestBody Time info) {
        Optional<Time> t = timeRepository.findById(id);
        if (t.isPresent()) {
            Time tAlt = t.get();
            tAlt.setNome(info.getNome());
            tAlt.setAbreviacao(info.getAbreviacao());
            tAlt.setImagemDoEscudo(info.getImagemDoEscudo());
            timeRepository.save(tAlt);
            return t;
        }
        return null;
    }
}
