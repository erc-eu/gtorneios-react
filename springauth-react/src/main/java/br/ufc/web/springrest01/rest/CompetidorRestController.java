package br.ufc.web.springrest01.rest;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.web.springrest01.model.Competidor;
import br.ufc.web.springrest01.model.Time;

import br.ufc.web.springrest01.repository.CompetidorRepository;
import br.ufc.web.springrest01.repository.TimeRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/competidor")
public class CompetidorRestController {

    @Autowired
    CompetidorRepository competidorRepository;

    @Autowired
    TimeRepository timeRepository;

    @GetMapping(path = {"/{id}"})
    List<Competidor> getListCompetidor(@PathVariable Integer id){
        Optional<Time> t = timeRepository.findById(id);
        List<Competidor> comp = competidorRepository.findByCompetidorDoTime(t);
        return comp;
    }

    @PostMapping
    Competidor inserirCompetidor(@RequestBody Competidor competidor){
        competidorRepository.save(competidor);
        return competidor;
    }
    
    @PutMapping(path = {"/{id}"})
    Optional<Competidor> atualizarCompetidor(@PathVariable Integer id, @RequestBody Competidor c){
        Optional<Competidor> comp = competidorRepository.findById(id);
        if(comp.isPresent()){
            comp.get().setNomeCompetidor(c.getNomeCompetidor());
            competidorRepository.save(comp.get());
        }
        return comp;
    }

    @DeleteMapping(path = "/{id}")
    Optional<Competidor> deletaCompetidor(@PathVariable Integer id){
        Optional<Competidor> c = competidorRepository.findById(id);
        competidorRepository.delete(c.get());
        return c;
    }
}
