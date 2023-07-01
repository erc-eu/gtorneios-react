package br.ufc.web.springrest01.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Competidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codCompetidor;
    private String nomeCompetidor;
    @ManyToOne
    private Time competidorDoTime;
    
    public int getCodCompetidor() {
        return codCompetidor;
    }
    public void setCodCompetidor(int codCompetidor) {
        this.codCompetidor = codCompetidor;
    }
    public String getNomeCompetidor() {
        return nomeCompetidor;
    }
    public void setNomeCompetidor(String nomeCompetidor) {
        this.nomeCompetidor = nomeCompetidor;
    }
    public Time getCompetidorDoTime() {
        return competidorDoTime;
    }
    public void setCompetidorDoTime(Time competidorDoTime) {
        this.competidorDoTime = competidorDoTime;
    }

    
}
