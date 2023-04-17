package br.ufc.web.springrest01.model;


import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codPartida;
    @ManyToOne
    private Torneio torneio;
    private LocalDateTime dataHora;
    private String local;
    @ManyToOne
    private Time time1;
    @ManyToOne
    private Time time2;
    private String placar;
    private String momentoDaPontuacao;
    private String estatisticas;

    public Long getId() {
        return codPartida;
    }

    public void setId(Long id) {
        this.codPartida = id;
    }

    public Torneio getTorneio() {
        return torneio;
    }

    public void setTorneio(Torneio torneio) {
        this.torneio = torneio;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public Time getTime1() {
        return time1;
    }

    public void setTime1(Time time1) {
        this.time1 = time1;
    }

    public Time getTime2() {
        return time2;
    }

    public void setTime2(Time time2) {
        this.time2 = time2;
    }

    public String getPlacar() {
        return placar;
    }

    public void setPlacar(String placar) {
        this.placar = placar;
    }

    public String getMomentoDaPontuacao() {
        return momentoDaPontuacao;
    }

    public void setMomentoDaPontuacao(String momentoDaPontuacao) {
        this.momentoDaPontuacao = momentoDaPontuacao;
    }

    public String getEstatisticas() {
        return estatisticas;
    }

    public void setEstatisticas(String estatisticas) {
        this.estatisticas = estatisticas;
    }

}
