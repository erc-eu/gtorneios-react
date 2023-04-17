package br.ufc.web.springrest01.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Torneio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codTorneio;
    private String nome;
    private String descricao;
    private int quantidadeDeTimes;
    private double premiacao;
    private String esporte;
    private String tipoDeCompeticao;
    @ManyToOne
    private User organizador;
    @OneToMany (mappedBy = "torneio")
    private List<Partida> partidas;

    public int getCodTorneio() {
        return codTorneio;
    }

    public void setCodTorneio(int codTorneio) {
        this.codTorneio = codTorneio;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getQuantidadeDeTimes() {
        return quantidadeDeTimes;
    }

    public void setQuantidadeDeTimes(int quantidadeDeTimes) {
        this.quantidadeDeTimes = quantidadeDeTimes;
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

    public String getTipoDeCompeticao() {
        return tipoDeCompeticao;
    }

    public void setTipoDeCompeticao(String tipoDeCompeticao) {
        this.tipoDeCompeticao = tipoDeCompeticao;
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
