package br.ufc.web.springrest01.rest;

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
        Optional<Time> time = timeRepository.findById(id);
        Optional<Torneio> torn = torneioRepository.findById(codTorneio);
        List<Partida> p1 = partidaRepository.findByTime1(time.get());
        List<Partida> p2 = partidaRepository.findByTime2(time.get());

        if (time.isPresent()) {
            Time t = time.get();
            t.setVencedor(false);
            timeRepository.save(t);
        }
        if (p1 != null && p2 != null) {
            for (Partida partida : p1) {
                partida.setPlacar(str.getPlacar());
                partidaRepository.save(partida);
            }
            for (Partida partida : p2) {
                partida.setPlacar(str.getPlacar());
                partidaRepository.save(partida);
            }
        }
        return timeRepository.findByTorneioCodAndVencedor(torn, true);

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
