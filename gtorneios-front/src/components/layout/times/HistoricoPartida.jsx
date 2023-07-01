
import React, { useEffect, useState } from "react";
import MenuLogado from "../MenuLogado";
import axios from "axios";
import "./HistoricoPartida.css"

const HistoricoPartida = (props) => {
    const torneioId = props.match.params.id;
    const [partidas, setPartidas] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get(`http://localhost:8080/api/partida/${torneioId}/historico`, config).then(res => {
            setPartidas(res.data);
        })


    }, [torneioId]);
    console.log(partidas);
    return (
        <div>
            <div>
                <MenuLogado />
            </div>
            {partidas.map((partida, i) => (
                <React.Fragment key={i}>
                    <div className='colunaHistorico'>
                        {partida.time1?.imagemDoEscudo && <img src={partida.time1.imagemDoEscudo} />}
                        {partida.placar}
                        {partida.time2?.imagemDoEscudo && <img src={partida.time2.imagemDoEscudo} />}
                    </div>
                </React.Fragment>
            ))}

        </div>
    )
}

export default HistoricoPartida;