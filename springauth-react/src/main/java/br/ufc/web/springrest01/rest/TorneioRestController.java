package br.ufc.web.springrest01.rest;


import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.web.springrest01.model.Torneio;
import br.ufc.web.springrest01.model.User;
import br.ufc.web.springrest01.repository.TorneioRepository;
import br.ufc.web.springrest01.repository.UserRepository;

@RestController
@RequestMapping("/api/torneio")
public class TorneioRestController {

    @Autowired
    TorneioRepository torneioRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    Iterable<Torneio> getTorneios(@RequestParam Map<String, String> query) {
        Iterable<Torneio> findAll = torneioRepository.findAll();
        return findAll;
    }
    
    @GetMapping(path = { "/{id}" })
    Torneio getTorneio(@PathVariable Integer id) {
        Optional<Torneio> result = torneioRepository.findById(id);
        return !result.isPresent() ? null : result.get();
    }

    @GetMapping(path = { "/{id}/user" })
    Iterable<Torneio> getTorneioUser(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        List<Torneio> result = torneioRepository.findByOrganizador(user);
        return result;
    }

    @PostMapping(path = { "/{id}" })
    Torneio addTorneio(@RequestBody Torneio torneio, @PathVariable Integer id) {
        Optional<User> torn = userRepository.findById(id);
        if (torn.isPresent()) {
            torneio.setOrganizador(torn.get());
            Torneio savedTorneio = torneioRepository.save(torneio);
            return savedTorneio;
        }
        return null;
    }

}
