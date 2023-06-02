import React, { useState, useEffect } from 'react';
import MenuLogado from '../MenuLogado';
import './AddTimes.css';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
const AddTimes = (props) => {
    const torneioId = props.match.params.id;
    const [qtdTimes, setQtdTimes] = useState(0);
    const [qtd, setQtd] = useState(0)
    const [timeSalvo, setTimeSalvo] = useState([]);
    const [timePego, setPego] = useState([]);
    const [nome, setNome] = useState('');
    const [abreviacao, setAbreviacao] = useState('');
    const [imagem, setImagem] = useState('');

    const [tPar, setPar] = useState([]);
    const [tImpar, setImpar] = useState([]);


    const [mostrarBotao, setMostrarBotao] = useState(false);
    const [mostrarBotaoDelete, setMostrarBotaoDelete] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get(`http://localhost:8080/api/torneio/${torneioId}`, config).then(res => {
            setQtdTimes(res.data.qtdDeTimes);
        }).catch(error => {
            console.error("Erro ao obter Torneio", error);
        });
        axios.get(`http://localhost:8080/api/time/${torneioId}`, config).then(res => {
            console.log(res);
            setTimeSalvo(res.data);
            setQtd(res.data.length);
        }).catch(error => {
            console.error('Erro ao obter o Time :', error);
        });
        if (tPar && tImpar == '') {
            setMostrarBotao(true);
            setMostrarBotaoDelete(true);
            axios.get(`http://localhost:8080/api/partida/${torneioId}`, config).then(res => {

                if (res.data[0] == null) {

                } else {
                    setMostrarBotao(false);
                    setMostrarBotaoDelete(false);
                    separarNumerosParesImpares(res.data);

                }
            })
        }

    }, [torneioId]);

    const separarNumerosParesImpares = (partidas) => {
        const pares = [];
        const impares = [];

        partidas.forEach((partida, index) => {
            if (index % 2 === 0) {
                pares.push(partida);
            } else {
                impares.push(partida);
            }
        });

        setPar(pares);
        setImpar(impares);
    };
    const salvar = (event) => {

        event.preventDefault();
        if (!nome || !abreviacao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (qtdTimes <= qtd) {
            alert('Limite de times atingido. Não é possível adicionar mais times.');
            return;
        }

        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        const novoTime = {
            nome,
            abreviacao,
            imagemDoEscudo: imagem
        };

        axios.post(`http://localhost:8080/api/time/${torneioId}`, novoTime, config)
            .then(result => {
                setTimeSalvo([...timeSalvo, result.data]);
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });

        setNome('');
        setAbreviacao('');
        setImagem('');
        setQtd(qtd + 1);
    };


    const sortear = (event) => {
        event.preventDefault();
        if (qtdTimes !== qtd) {
            alert("Preencha com todos os times para criar um mata-mata");
            return;
        }
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        axios.get(`http://localhost:8080/api/time/${torneioId}`, config)
            .then(res => {
                const times = res.data;
                const timesSorteados = [...times].sort(() => Math.random() - 0.5);

                const timesPares = [];
                const timesImpares = [];

                timesSorteados.forEach((time, index) => {
                    if (index % 2 === 0) {
                        timesPares.push(time);
                    } else {
                        timesImpares.push(time);
                    }
                });

                const partidas = timesPares.map((time, index) => ({
                    time1: time,
                    time2: timesImpares[index]
                }));
                console.log(partidas);
                axios.post('http://localhost:8080/api/partida', partidas, config)
                    .then(res => {
                        axios.get(`http://localhost:8080/api/partida/${torneioId}`, config).then(res => {

                            if (res.data[0] == null) {

                            } else {
                                setMostrarBotao(false);
                                setMostrarBotaoDelete(false);
                                separarNumerosParesImpares(res.data);

                            }
                        })
                    })
                    .catch(error => {
                        console.error('Erro ao criar as partidas:', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao obter os times:', error);
            });
    };

    const deleteTime = (codTime) => {
        console.log(codTime);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        console.log(codTime);
        axios.delete(`http://localhost:8080/api/time/${codTime}`, config)
            .then(res => {
                console.log(res);
                setTimeSalvo(prevTimes => prevTimes.filter(time => time.codTime !== codTime));
            })
            .catch(err => {
                console.log(err);
            });
        setQtd(qtd - 1);
    };

    const filterTeams = (e) =>{
        
    }
    return (
        <div>
            <MenuLogado />
            <div className='container'>
                <div className='containerColuna'>
                    <form className='opt' onSubmit={salvar}>
                        <div className='opt-input'>
                            <label htmlFor='nome'>Nome:</label>
                            <input
                                type='text'
                                id='nome'
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className='opt-input'>
                            <label htmlFor='abreviacao'>Abreviação:</label>
                            <input
                                type='text'
                                id='abreviacao'
                                value={abreviacao}
                                onChange={(e) => setAbreviacao(e.target.value)}
                                required
                            />
                        </div>
                        <div className='opt-input'>
                            <label htmlFor='imagem'>Imagem do Escudo:</label>
                            <input
                                type='text'
                                id='imagem'
                                value={imagem}
                                onChange={(e) => setImagem(e.target.value)}
                            />
                        </div>
                        <div className='opt-button'>
                            <button type='submit'>Registrar</button>
                        </div>
                    </form>

                    <div className='coluna1'>
                        <div className='input-icons'>
                            <i className="icon"><SearchIcon /></i>
                            <input className='filterTimes' type="text" onChange={filterTeams} />
                        </div>
                        <div className='colunaT'>
                            {timeSalvo.map((time, index) => (
                                <div className='colunaTimes' key={index}>
                                    <img src={time.imagemDoEscudo} />
                                    <li>{time.nome}</li>
                                    {mostrarBotaoDelete && (
                                        <button onClick={() => deleteTime(time.codTime)}>Delete</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='gerarPartidas'>
                        <div className='partidasHead'><h1>Partidas</h1></div>
                        <div className='btnGerar'>
                            {mostrarBotao && (
                                <button className='btn' onClick={sortear}>
                                    Gerar Partidas
                                </button>
                            )}
                        </div>
                        <div className='numerosContainer'>
                            {/* Mapeamento intercalado dos pares e ímpares */}
                            {tPar.map((tPar, i) => (
                                <React.Fragment key={i}>
                                    <div className='colunaGeradaPar'>
                                        <img src={tPar.imagemDoEscudo} alt='Escudo' />
                                        <li>{tPar.nome}</li>
                                    </div>
                                    <h1>-</h1>
                                    {tImpar[i] && (
                                        <div className='colunaGeradaImpar'>
                                            <img src={tImpar[i].imagemDoEscudo} alt='Escudo' />
                                            <li>{tImpar[i].nome}</li>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddTimes;
