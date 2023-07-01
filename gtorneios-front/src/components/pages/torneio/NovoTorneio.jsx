import React, { useEffect, useState } from "react";
import MenuLogado from "../../layout/MenuLogado";
import '../styles/novoTorneio.css'
import axios from 'axios';

const NovoTorneio = () => {

    //dados do Torneio
    const [nomeTorneio, setNomeTorneio] = useState('');
    const [description, setDescription] = useState('');
    const [numTime, setNum] = useState(1);
    const [premiacao, setPremiacao] = useState(0);
    const [esporte, setEsporte] = useState('');
    const [user, setUser] = useState();

    //outras coisas
    const [msg, setMsg] = useState('')

    const inc = (event) => {
        event.preventDefault();
        if (numTime === 64) {
            setMsg('chegou ao maximo');
            return;
        }
        setNum(numTime * 2);
    }

    const dec = (event) => {
        event.preventDefault();
        if (numTime <= 1) {
            return;
        }
        setMsg('');
        setNum(numTime / 2);
    }


    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get("http://localhost:8080/api/user/me", config).then(result => {
            setUser(result.data.principal.id);
        })
    }, []);

    
    const torneio = {
        nomeT: nomeTorneio,
        descricaoT: description,
        qtdDeTimes: numTime,
        premiacao: premiacao,
        esporte: esporte
    }
    
    const handleSubmit = (event) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.post("http://localhost:8080/api/torneio/" + user + "", torneio, config).then(result => {
            
            console.log(result);
        }).catch(err => { console.error("erro", err) });
        event.preventDefault();
        window.location.href="/";

    }

    return (
        <div>
            <MenuLogado />
            <form className="novoTorneio-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nomeT">Nome do Torneio:</label>
                    <input
                        type="text"
                        placeholder='Digite o nome do seu torneio'
                        id="nomeT"
                        value={nomeTorneio}
                        onChange={(e) => { setNomeTorneio(e.target.value) }}
                        name='nomeT'
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descricaoT">Descrição:</label>
                    <input
                        type="text"
                        placeholder='Descreva o torneio'
                        id="descricaoT"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        name='descricaoT'
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="qtdDeTimes">Quantidade de times:</label>
                    <i>{msg}</i>
                    <input
                        type="number"
                        value={numTime}
                        id="qtdDeTimes"
                        name='qtdDeTimes'
                        disabled
                        required
                    />
                    <button className="buttonIncDec" onClick={inc}>+</button>
                    <button className="buttonIncDec" onClick={dec}>-</button>
                </div>
                <div className="form-group">
                    <label htmlFor="premiacao">Premiação</label>
                    <input
                        type="number"
                        id="premiacao"
                        value={premiacao}
                        onChange={(e) => setPremiacao(e.target.value)}
                        name='premiacao'
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="labelEsporte" htmlFor="esporte">Esporte:</label>
                    <select onChange={(e) => { setEsporte(e.target.value) }} name="esporte" className="select-custom">
                        <option value=""></option>
                        <option value="Futebol">Futebol</option>
                        <option value="Tenis">Tenis</option>
                        <option value="Judo">Judô</option>
                    </select>
                </div>
                <button type="submit">Registrar Torneio</button>
            </form>
        </div>
    )
}


export default NovoTorneio;