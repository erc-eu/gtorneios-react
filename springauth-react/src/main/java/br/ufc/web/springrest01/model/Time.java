package br.ufc.web.springrest01.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codTime;
    private String nome;
    private String imagemDoEscudo;
    private String abreviacao;
    @OneToMany (mappedBy = "time")
    private List<Competidor> competidores;
    @ManyToOne
    private Torneio torneioCod;
    private boolean vencedor ;
   

    
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
    public List<Competidor> getCompetidores() {
        return competidores;
    }
    public void setCompetidores(List<Competidor> competidores) {
        this.competidores = competidores;
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