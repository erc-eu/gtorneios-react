import MenuLogado from "../../layout/MenuLogado";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import './Estatisticas.css';
const Estatisticas = () => {


    const [numTorneiosFinalizados, setTorneiosFinalizados] = useState();
    const [qtdTimesParticipantes, setQtdTimesParticipantes] = useState();
    const [qtdJogadores, setQtdJogadores] = useState();
    const [mediaJogadoresPorTime, setMedia] = useState();
    const [primeiraData, setPrimeiraData] = useState([]);
    const [ultimaData, setUltimaData] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get('http://localhost:8080/api/user/me', config).then(result => {

            axios.get(`http://localhost:8080/api/partida/${result.data.principal.id}/finalizados`, config).then(res => {
                setTorneiosFinalizados(res.data.length);
            })
            axios.get(`http://localhost:8080/api/time/${result.data.principal.id}/qtdTimesParticipantes`, config).then(res => {
                setQtdTimesParticipantes(res.data.length);
            })
            axios.get(`http://localhost:8080/api/competidor/${result.data.principal.id}/numJogadoresDoTorneio`, config).then(res => {
                axios.get(`http://localhost:8080/api/time/${result.data.principal.id}/qtdTimesParticipantes`, config).then(r => {
                    setQtdJogadores(res.data.length);
                    setMedia(res.data.length / r.data.length);
                })

            })
            axios.get(`http://localhost:8080/api/partida/${result.data.principal.id}/primeira-data-torneio`, config).then(res => {
                setPrimeiraData(res.data)
            })
            axios.get(`http://localhost:8080/api/partida/${result.data.principal.id}/ultima-data-torneio`, config).then(res => {
                setUltimaData(res.data);
            })
        })

    }, []);
    console.log(primeiraData);


    return (
        <div>
            <div>
                <MenuLogado />
            </div>

            <table>
                <tr>
                    <th>Estatística</th>
                    <th>Resultados</th>
                </tr>
                <tr>
                    <td className="label">Torneios Finalizados</td>
                    <td className="value">{numTorneiosFinalizados}</td>
                </tr>
                <tr>
                    <td className="label">Quantidade de Times Participando</td>
                    <td className="value">{qtdTimesParticipantes}</td>
                </tr>
                <tr>
                    <td className="label">Quantidade de Jogadores em cada Time</td>
                    <td className="value">
                        QNTD TOTAL DE JOGADORES: {qtdJogadores}<br></br>
                        MEDIA DE JOGADORES POR TIME: {parseInt(mediaJogadoresPorTime)}
                    </td>
                </tr>
                <tr>
                    <td className="label">Duração das Competições</td>
                    <td className="value">
                        <div>
                            <span>Data da primeira e última partida</span>
                            <br />
                            {primeiraData.length > 0 && ultimaData.length > 0 ? (
                                primeiraData.map((data, i) => (
                                    <React.Fragment key={i}>
                                        {data[1]} - {ultimaData[i][1]}
                                        <br />
                                    </React.Fragment>
                                ))
                            ) : (
                                <span>Carregando...</span>
                            )}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    )
}


export default Estatisticas;