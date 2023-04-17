package br.ufc.web.springrest01.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codTime;
    private String nome;
    private String imagemDoEscudo;
    private String abreviacao;
    @OneToMany (mappedBy = "time")
    private List<Competidor> competidores;

    public Long getId() {
        return codTime;
    }

    public void setId(Long id) {
        this.codTime = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getImagemDoEscudo() {
        return imagemDoEscudo;
    }

    public void setImagemDoEscudo(String imagemDoEscudo) {
        this.imagemDoEscudo = imagemDoEscudo;
    }

    public String getAbreviacao() {
        return abreviacao;
    }

    public void setAbreviacao(String abreviacao) {
        this.abreviacao = abreviacao;
    }

    public List<Competidor> getJogadores() {
        return competidores;
    }

    public void setJogadores(List<Competidor> jogadores) {
        this.competidores = jogadores;
    }


}
