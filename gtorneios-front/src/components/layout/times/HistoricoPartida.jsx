import React, { useEffect, useState } from "react";
import MenuLogado from "../MenuLogado";
import axios from "axios";
import "./HistoricoPartida.css";

const HistoricoPartida = (props) => {
    const torneioId = props.match.params.id;
    const [partidas, setPartidas] = useState([]);
    const [mostrarGols, setMostrarGols] = useState(false);
    const [golsVisiveis, setGolsVisiveis] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("usuario");
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };

        axios
            .get(`http://localhost:8080/api/partida/${torneioId}/historico`, config)
            .then((res) => {
                setPartidas(res.data);
            });
    }, [torneioId]);

    const formatarGols = (gols, index) => {
        if (gols && golsVisiveis.includes(index)) {
            const golsArray = gols.split(".");
            const golsFormatados = golsArray
                .filter((gol) => gol.trim() !== "") // Filtrar gols não vazios
                .map((gol, index) => <li key={index}>{`${gol}`}</li>);

            return golsFormatados;
        }

        return null;
    };


    const toggleMostrarGols = (index) => {
        if (golsVisiveis.includes(index)) {
            setGolsVisiveis(golsVisiveis.filter((item) => item !== index));
        } else {
            setGolsVisiveis([...golsVisiveis, index]);
        }
    };
    console.log(partidas)
    return (
        <div>
            <div>
                <MenuLogado />
            </div>
            <div className="containerHistorico">
                {partidas.map((partida, i) => (
                    <React.Fragment key={i}>
                        <div className={`colunaHistorico${i === partidas.length - 1 ? " centralizado" : ""}`}>
                            <br></br>
                            {partida.dataHora}<br></br>
                            {partida.time1?.imagemDoEscudo && (
                                <img src={partida.time1.imagemDoEscudo} alt="Escudo Time 1" />
                            )}
                            {partida.placar}
                            {partida.time2?.imagemDoEscudo && (
                                <img src={partida.time2.imagemDoEscudo} alt="Escudo Time 2" />
                            )}
                            <div className="Gols">
                                <ul>{formatarGols(partida.momentoDaPontuacao, i)}</ul>
                                {i !== partidas.length - 1 && (
                                    <button className="MostrarGolsButton" onClick={() => toggleMostrarGols(i)}>Mostrar Gols</button>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default HistoricoPartida;
