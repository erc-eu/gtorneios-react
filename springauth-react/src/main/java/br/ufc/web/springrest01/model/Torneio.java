package br.ufc.web.springrest01.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Torneio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codTorneio;
    private String nomeT;
    private String descricaoT;
    private int qtdDeTimes;
    private double premiacao;
    private String esporte;
    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User organizador;
    @OneToMany(mappedBy = "torneio")
    private List<Partida> partidas;

    public Torneio() {
    }

    

    public Torneio(int codTorneio, String nomeT, String descricaoT, int qtdDeTimes, double premiacao, String esporte,
            User organizador, List<Partida> partidas) {
        this.codTorneio = codTorneio;
        this.nomeT = nomeT;
        this.descricaoT = descricaoT;
        this.qtdDeTimes = qtdDeTimes;
        this.premiacao = premiacao;
        this.esporte = esporte;
        this.organizador = organizador;
        this.partidas = partidas;
    }



    public int getCodTorneio() {
        return codTorneio;
    }

    public void setCodTorneio(int codTorneio) {
        this.codTorneio = codTorneio;
    }

    public String getNomeT() {
        return nomeT;
    }

    public void setNomeT(String nomeT) {
        this.nomeT = nomeT;
    }

    public String getDescricaoT() {
        return descricaoT;
    }

    public void setDescricaoT(String descricaoT) {
        this.descricaoT = descricaoT;
    }

    public int getQtdDeTimes() {
        return qtdDeTimes;
    }

    public void setQtdDeTimes(int qtdDeTimes) {
        this.qtdDeTimes = qtdDeTimes;
    }

    public double getPremiacao() {
        return premiacao;
    }

    public void setPremiacao(double premiacao) {
        this.premiacao = premiacao;
    }

    public String getEsporte() {
        return esporte;
    }

    public void setEsporte(String esporte) {
        this.esporte = esporte;
    }

    public User getOrganizador() {
        return organizador;
    }

    public void setOrganizador(User organizador) {
        this.organizador = organizador;
    }

    public List<Partida> getPartidas() {
        return partidas;
    }

    public void setPartidas(List<Partida> partidas) {
        this.partidas = partidas;
    }

}
