package br.ufc.web.springrest01.rest;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.web.springrest01.model.Time;
import br.ufc.web.springrest01.model.Torneio;
import br.ufc.web.springrest01.repository.TimeRepository;
import br.ufc.web.springrest01.repository.TorneioRepository;

@RestController
@RequestMapping("/api/time")
public class TimeRestController {
    
    @Autowired
    TimeRepository timeRepository;

    @Autowired
    TorneioRepository torneioRepository;
    
    @GetMapping
    Iterable<Time> getTimes(){
        Iterable<Time> getTime = timeRepository.findAll();
        return getTime;
    }


    @GetMapping(path = {"/{id}"})
    Iterable<Time> getTimesPeloCodTorneio(@PathVariable Integer id){
        Optional<Torneio> torn = torneioRepository.findById(id);
        List<Time> team = timeRepository.findByTorneioCod(torn);
        return team;
    }

    @PostMapping(path = {"/{id}"})
    Time addTime(@RequestBody Time time, @PathVariable Integer id) {
        Optional<Torneio> torn = torneioRepository.findById(id);
        if(torn.isPresent()){    
            time.setTorneioCod(torn.get());
            time.setVencedor(true);
            Time savedTime = timeRepository.save(time);
            return savedTime;
        }
        return null;
    }
}
