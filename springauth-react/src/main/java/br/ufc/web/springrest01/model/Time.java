package br.ufc.web.springrest01.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Time {
    // ...

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codTime;
    private String nome;
    private String imagemDoEscudo;
    private String abreviacao;

    @OneToMany(mappedBy = "time1", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Partida> partidasComoTime1;

    @OneToMany(mappedBy = "time2", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Partida> partidasComoTime2;

    @ManyToOne
    private Torneio torneioCod;
    private boolean vencedor;

     
    public int getCodTime() {
        return codTime;
    }
    public void setCodTime(int codTime) {
        this.codTime = codTime;
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

    public Torneio getTorneioCod() {
        return torneioCod;
    }
    public void setTorneioCod(Torneio torneioCod) {
        this.torneioCod = torneioCod;
    }
    public boolean isVencedor() {
        return vencedor;
    }
    public void setVencedor(boolean vencedor) {
        this.vencedor = vencedor;
    }

    
}