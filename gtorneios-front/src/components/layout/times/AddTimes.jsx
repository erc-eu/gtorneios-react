import React, { useState, useEffect, useRef } from 'react';
import MenuLogado from '../MenuLogado';
import './AddTimes.css';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import unidecode from 'unidecode';
import Modal from 'react-modal';
import { Link } from "react-router-dom";

const AddTimes = (props) => {
    const torneioId = props.match.params.id;
    const [qtdTimes, setQtdTimes] = useState(0);
    const [qtd, setQtd] = useState(0)
    const [timeSalvo, setTimeSalvo] = useState([]);
    const [timePego, setPego] = useState([]);
    const [nome, setNome] = useState('');
    const [abreviacao, setAbreviacao] = useState('');
    const [imagem, setImagem] = useState('');

    const [timesDaPartida, setTimesDaPartida] = useState([]);
    const [timesDaPartidaConfronto, setTimesDaPartidaConfronto] = useState([]);
    const [salvarTimesConfronto, setSalvarTimesConfronto] = useState([]);

    const [tPar, setPar] = useState([]);
    const [tImpar, setImpar] = useState([]);

    //botões DELETE E GERAR PARTIDA
    const [mostrarBotao, setMostrarBotao] = useState(false);
    const [mostrarBotaoDelete, setMostrarBotaoDelete] = useState(false);
    const [mostraBotaoRodada, setMostrarBotaoRodada] = useState(false);
    const [mostrarBotaoEdit, setMostrarBotaoEdit] = useState(false);
    const [mostrarBotaoInserirJogador, setBotaoInserirJogador] = useState(false);
    //Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalCompetidor, setModalCompetidorOpen] = useState(false);
    const [modalPartidas, setModalPartidasOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);


    //useRef
    const inputBusca = useRef(null);
    const competidores = useRef(null);
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
            setTimeSalvo(res.data);
            setFilteredData(res.data);
            setQtd(res.data.length);
        }).catch(error => {
            console.error('Erro ao obter o Time :', error);
        });
        if (tPar && tImpar == '') {
            axios.get(`http://localhost:8080/api/partida/${torneioId}`, config).then(res => {
                if (res.data[0] == null) {
                    setMostrarBotao(true);
                    setMostrarBotaoDelete(true);
                    setMostrarBotaoEdit(true);
                    setBotaoInserirJogador(true);
                    setMostrarBotaoRodada(false);
                } else {
                    setMostrarBotao(false);
                    setMostrarBotaoDelete(false);
                    setMostrarBotaoEdit(true);
                    setBotaoInserirJogador(true);
                    if (res.data.length == 1) {
                        setV(true);
                        setMostrarBotaoRodada(false);
                    } else {
                        setMostrarBotaoRodada(true);
                    }
                    setTimesDaPartida(res.data);
                    setTimesDaPartidaConfronto(res.data);
                    separarNumerosParesImpares(res.data);
                    setSalvarTimesConfronto(res.data);
                }
            })
        }

    }, [torneioId]);

    const focusBusca = () => {
        inputBusca.current.focus();
    }
    const focusBusca2 = () => {
        competidores.current.focus();
    }

    const separarNumerosParesImpares = (partidas) => {
        const pares = [];
        const impares = [];
        setTimesDaPartida(partidas);
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
                setTimesDaPartida([...timesDaPartida, result.data]);
                setFilteredData([...filteredData, result.data]);
                console.log()
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


    //SORTEAR PARTIDAS
    const sortear = (event) => {
        event.preventDefault();
        if (qtdTimes !== qtd) {
            alert("Preencha com todos os times para criar um mata-mata");
            return;
        }
        setMostrarBotao(false);
        setMostrarBotaoDelete(false);
        setMostrarBotaoEdit(true);
        setMostrarBotaoRodada(true);
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
                axios.post('http://localhost:8080/api/partida', partidas, config)
                    .then(res => {
                        axios.get(`http://localhost:8080/api/partida/${torneioId}`, config).then(res => {
                            if (res.data[0] == null) {
                            } else {
                                separarNumerosParesImpares(res.data);
                                setTimesDaPartida(res.data);
                                setTimesDaPartidaConfronto(res.data);
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



    //DELETAR TIME
    const deleteTime = (codTime) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.delete(`http://localhost:8080/api/time/${codTime}`, config)
            .then(res => {
                console.log(res);
                setTimeSalvo(prevTimes => prevTimes.filter(time => time.codTime !== codTime));
                setFilteredData(prevTimes => prevTimes.filter(time => time.codTime !== codTime));

            })
            .catch(err => {
                console.log(err);
            });
        setQtd(qtd - 1);
    };

    const [filteredData, setFilteredData] = useState([]);

    //BUSCAR TIMES
    const filterTeams = (event) => {
        if (event.target.value === '') {
            setTimeSalvo(filteredData);
            return;
        }

        const value = event.target.value.toLowerCase();


        const filtered = timeSalvo.filter((item) => {
            const itemName = unidecode(item.nome.toLowerCase());
            return itemName.includes(value);
        });

        setTimeSalvo(filtered);
    }

    const [allPlayers, setAllPlayers] = useState([]);
    //BUSCAR JOGADORES DO TIME
    const filterPlayers = (event) => {
        if (event.target.value === '') {
            setCompetidoresDoTime(allPlayers);
            return;
        }
        const value = event.target.value.toLowerCase();
        const filtered = competidoresDoTime.filter((item) => {
            const itemName = unidecode(item.nomeCompetidor.toLowerCase())
            return itemName.includes(value);
        })
        setCompetidoresDoTime(filtered);
    }

    const [competidoresDoTime, setCompetidoresDoTime] = useState([]);
    //EDITAR JOGADORES DO TIME
    const [nomeJogador, setNomeJogador] = useState("");
    const atualizarPlayers = (codCompetidor) => {
        console.log(nomeJogador);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        const competidor = {
            nomeCompetidor: nomeJogador
        }
        axios.put(`http://localhost:8080/api/competidor/${codCompetidor}`, competidor, config).then(res => {
            console.log(res.data);
            setCompetidoresDoTime([...competidoresDoTime.codCompetidor === res.data.codCompetidor, res.data]);
        })
        setAllPlayers(competidoresDoTime);
    }

    //ABRIR e FECHAR MODAL
    const openModal = (time) => {
        setSelectedTime(time);
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
        setModalCompetidorOpen(false);
        setModalPartidasOpen(false);
    };

    const openCompetidorModal = (time) => {
        setSelectedTime(time);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get(`http://localhost:8080/api/competidor/${time.codTime}`, config).then(res => {
            setCompetidoresDoTime(res.data);
            setAllPlayers(res.data);
            setJogador('');
            console.log(res.data);
        })
        setModalCompetidorOpen(true);
    };

    const [partida, setPartidas] = useState([]);
    const openPartidasModal = (cod) => {
        console.log(cod);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get(`http://localhost:8080/api/partida/p/${cod}`, config)
            .then(res => {
                setPartidas(res.data);
                setModalPartidasOpen(true);
            })
            .catch(error => {
                console.error(error);
                // Lida com possíveis erros na solicitação
            });
    };

    //Editar Time
    const [nomeTime, setNomeTime] = useState('');
    const [abrev, setAbrev] = useState('');
    const [imgShield, setImgShield] = useState('');

    const editarTime = (codTime) => {
        const time = {
            nome: nomeTime,
            abreviacao: abrev,
            imagemDoEscudo: imgShield
        };

        const updatedTimeSalvo = timeSalvo.map((timeObj) => {
            if (timeObj.codTime === codTime) {
                return { ...timeObj, ...time };
            }
            return timeObj;
        });
        const updateTimesDaPartida = timesDaPartida.map((timeObj) => {
            if (timeObj.codTime === codTime) {
                return { ...timeObj, ...time };
            }
            return timeObj;
        });


        setTimeSalvo(updatedTimeSalvo);
        setFilteredData(updatedTimeSalvo);
        separarNumerosParesImpares(updateTimesDaPartida);
        setSelectedTime(time);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        axios.put(`http://localhost:8080/api/time/${codTime}`, time, config)
            .then(res => {
                console.log('Time atualizado:', res.data);
            })
            .catch(err => {
                console.log(err);
            });
        setNomeTime('');
        setAbrev('');
        setImgShield('');
    };


    const [jogador, setJogador] = useState("");
    //Inserir Jogador no Time
    const inserirJogador = (time, nomeJogador) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        const comp = {
            nomeCompetidor: nomeJogador,
            competidorDoTime: time
        }

        axios.post("http://localhost:8080/api/competidor", comp, config).then(res => {
            setCompetidoresDoTime([...competidoresDoTime, res.data]);
            setAllPlayers([...allPlayers, res.data]);
            setJogador('');
        })

    }

    const deletedJogador = (jogador) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };
        console.log(jogador.codCompetidor);
        axios.delete(`http://localhost:8080/api/competidor/${jogador.codCompetidor}`, config).then(res => {
            setCompetidoresDoTime(prevTimes => prevTimes.filter(jogador => jogador.codCompetidor !== res.data.codCompetidor));
            setAllPlayers(prevTimes => prevTimes.filter(jogador => jogador.codCompetidor !== res.data.codCompetidor));
        })
    }


    const golsDosJogadores = async (time1, time2, placarTime1, placarTime2) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };

        try {
            const [resTime1, resTime2] = await Promise.all([
                axios.get(`http://localhost:8080/api/competidor/${time1.codTime}`, config),
                axios.get(`http://localhost:8080/api/competidor/${time2.codTime}`, config)
            ]);

            const jogadoresTime1 = resTime1.data;
            const jogadoresTime2 = resTime2.data;

            let novoArrayTime1 = [];
            let novoArrayTime2 = [];

            for (let i = 0; i < placarTime1; i++) {
                let jogadorSorteado = jogadoresTime1[Math.floor(Math.random() * jogadoresTime1.length)];
                novoArrayTime1.push(jogadorSorteado);
            }

            for (let i = 0; i < placarTime2; i++) {
                let jogadorSorteado = jogadoresTime2[Math.floor(Math.random() * jogadoresTime2.length)];
                novoArrayTime2.push(jogadorSorteado);
            }

            return {
                golsTime1: novoArrayTime1,
                golsTime2: novoArrayTime2
            };
        } catch (error) {
            console.error('Erro ao obter os jogadores:', error);
            return null;
        }
    };

    const gerarPlacar = async (time1, time2) => {
        let placarTime1;
        let placarTime2;

        do {
            placarTime1 = Math.floor(Math.random() * 5);
            placarTime2 = Math.floor(Math.random() * 5);
        } while (placarTime1 === placarTime2);

        if (placarTime1 > placarTime2) {
            setTimesDaPartida(prevTimes => prevTimes.filter(time => time.codTime !== time2.codTime));
            let est = await golsDosJogadores(time1, time2, placarTime1, placarTime2);
            return {
                timePerdedor: time2,
                placar: `${time1.nome}: ${placarTime1} - ${time2.nome}: ${placarTime2}`,
                momentoGols: est.golsTime1.concat(est.golsTime2)
            };
        } else if (placarTime1 < placarTime2) {
            setTimesDaPartida(prevTimes => prevTimes.filter(time => time.codTime !== time1.codTime));
            let est = await golsDosJogadores(time1, time2, placarTime1, placarTime2);
            return {
                timePerdedor: time1,
                placar: `${time1.nome}: ${placarTime1} - ${time2.nome}: ${placarTime2}`,
                momentoGols: est.golsTime1.concat(est.golsTime2)
            };
        }
    };
    const [vencedor, setV] = useState(false);
    const rodada = async () => {
        setMostrarBotaoRodada(false);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };

        let timesPassaramChamado = false;
        const promises = [];

        for (let i = 0; i < timesDaPartida.length - 1; i += 2) {
            if (timesDaPartida.length === 1) {
                break;
            }

            let time1 = timesDaPartida[i];
            let time2 = timesDaPartida[i + 1];

            let p = await gerarPlacar(time1, time2);
            console.log(p);
            let stringMomento = "";
            for (let i = 0; i < p.momentoGols.length; i++) {
                if (p.momentoGols[i] && p.momentoGols[i].nomeCompetidor) {
                    let tempo = Math.floor(Math.random() * 89) + 1;
                    stringMomento += "\n(" + tempo + "')" + "Fez Gol: " + p.momentoGols[i].nomeCompetidor + " " + p.momentoGols[i].competidorDoTime.abreviacao + ".";
                }
            }

            console.log(stringMomento);
            let t = {
                placar: p.placar,
                momentoDaPontuacao: stringMomento
            };

            promises.push(
                axios.put(`http://localhost:8080/api/time/${p.timePerdedor.codTime}/${torneioId}`, t, config)
            );
        }

        try {
            const results = await Promise.all(promises);
            for (let res of results) {
                separarNumerosParesImpares(res.data);
            }

            if (!timesPassaramChamado) {
                await timesPassaram(results[results.length - 1].data);
                setTimeout(() => {
                    if (timesDaPartida.length == 2) {
                        setV(true);
                        setMostrarBotaoRodada(false);
                    } else {
                        setMostrarBotaoRodada(true);
                    }
                }, 1000);
                timesPassaramChamado = true;
            }
        } catch (error) {
            console.log(error);
            setMostrarBotaoRodada(true);
        }
    };

    const timesPassaram = (p) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };
        const timesPares = [];
        const timesImpares = [];

        p.forEach((t, index) => {
            if (index % 2 === 0) {
                timesPares.push(t);
            } else {
                timesImpares.push(t);
            }
        });
        const partidas = timesPares.map((time, index) => ({
            time1: time,
            time2: timesImpares[index],
        }));
        axios.post('http://localhost:8080/api/partida', partidas, config)
            .then(res => {
                // Tratar a resposta, se necessário
            })
            .catch(error => {
                console.error('Erro ao criar as partidas:', error);
            });
    };



    function handleCompetidorChange(newValue, index) {
        setCompetidoresDoTime((competidores) => {
            const novosCompetidores = [...competidores]; // Cria uma cópia do estado competidoresDoTime
            novosCompetidores[index] = { ...novosCompetidores[index], nomeCompetidor: newValue };
            setNomeJogador(newValue);
            return novosCompetidores;
        });
    }

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedPartida, setSelectedPartida] = useState([])


    useEffect(() => {
        if (partida.length > 0) {
            setSelectedOption(partida[0].codPartida);
            setSelectedPartida(partida[0]);
        }
    }, [partida]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selected = partida.find(pt => pt.codPartida == selectedValue);
        setSelectedPartida(selected);
        console.log(selected);
    };

    const [time1, setTime1] = useState();
    const [time2, setTime2] = useState();

    const handleSelectTime1 = (event) => {
        if (time2 == event.target.value) {
            alert("iguais");
        } else {

            const selectedTime = event.target.value;
            setTime1(selectedTime);
        }
    };

    const handleSelectTime2 = (event) => {
        if (time1 == event.target.value) {
            alert("iguais");
        } else {
            const selectedTime = event.target.value;
            setTime2(selectedTime);
        }
    };


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
                            <i className="icon" onClick={focusBusca}><SearchIcon /></i>
                            <input className='filterTimes' ref={inputBusca} type="text" onChange={filterTeams} />
                        </div>
                        <div className='colunaT'>
                            {timeSalvo.map((time, index) => (
                                <div className='colunaTimes' key={index}>
                                    <img src={time.imagemDoEscudo} />
                                    <li>{time.nome}</li>
                                    {mostrarBotaoDelete && (
                                        <button className='addInconDelete' onClick={() => deleteTime(time.codTime)}><DeleteIcon /></button>
                                    )}
                                    {mostrarBotaoEdit && (
                                        <button className='addInconEdit' onClick={() => openModal(time)}><EditIcon /></button>
                                    )}
                                    {mostrarBotaoInserirJogador && (
                                        <button className='addIncon' onClick={() => openCompetidorModal(time)}><AddReactionIcon /></button>
                                    )}

                                    <Modal
                                        //className='modalEditTime'
                                        isOpen={modalIsOpen}
                                        onRequestClose={closeModal}
                                        style={{
                                            content: {
                                                width: '350px',
                                                height: '350px',
                                                margin: 'auto',
                                                textAlign: 'center',
                                                backgroundColor: 'white',
                                                // Add any other custom styles you need
                                            },
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the transparency here
                                            },

                                        }}
                                    >
                                        <button className='fecharEditTimeButton' onClick={closeModal}>Fechar</button>
                                        {selectedTime && (
                                            <>
                                                <div className='divEditTime'>

                                                    <img className='imgEditTime' src={selectedTime.imagemDoEscudo} alt="" />
                                                    <h2 className='h2EditTime'>{selectedTime.nome}</h2>
                                                    <label className='labelEditTime' htmlFor="">Nome Time </label><br></br>
                                                    <input className='inputEditTime' type="text" value={nomeTime} onChange={(e) => setNomeTime(e.target.value)} /><br />
                                                    <label className='labelEditTime' htmlFor="">Abreviacao </label><br></br>
                                                    <input className='inputEditTime' type="text" value={abrev} onChange={(e) => setAbrev(e.target.value)} /><br />
                                                    <label className='labelEditTime' htmlFor="">Imagem do Escudo </label><br />
                                                    <input className='inputEditTime' type="text" value={imgShield} onChange={(e) => setImgShield(e.target.value)} /><br /><br />
                                                </div>
                                            </>
                                        )}
                                        <button className='salvarEditTimeButton' onClick={() => editarTime(selectedTime.codTime)}>Salvar Edição</button>
                                    </Modal>
                                    <Modal
                                        isOpen={modalCompetidor}
                                        onRequestClose={closeModal}
                                        style={{
                                            content: {
                                                width: '350px',
                                                height: '350px',
                                                margin: 'auto',
                                                // Add any other custom styles you need
                                            },
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the transparency here
                                            },
                                        }}
                                    >
                                        <button className='fecharEditTimeButton' onClick={closeModal}>Fechar</button>
                                        <h2>Inserir Jogador</h2>
                                        <input type="text" value={jogador} onChange={(e) => { setJogador(e.target.value) }} />

                                        <button onClick={() => inserirJogador(selectedTime, jogador)}>Inserir</button>

                                        <div className='input-icons'>
                                            <i className="icon" onClick={focusBusca2}><SearchIcon /></i>
                                            <input className='filterTimes' ref={competidores} type="text" onChange={filterPlayers} />
                                        </div>

                                        {competidoresDoTime.map((competidor, i) => (
                                            <div key={i}>
                                                <input
                                                    type="text"
                                                    value={competidor.nomeCompetidor}
                                                    onChange={(e) => handleCompetidorChange(e.target.value, i)}
                                                />
                                                <button onClick={() => atualizarPlayers(competidor.codCompetidor)}>Alterar</button>
                                                <button onClick={() => deletedJogador(competidor)}>Deletar Jogador</button>
                                            </div>

                                        ))}
                                    </Modal>
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
                            {mostraBotaoRodada && (
                                <button className='btn' onClick={rodada}>Rodada</button>
                            )}
                        </div>
                        {!vencedor && (
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
                                <div className='AlterarConfroto'>
                                    <button onClick={() => openPartidasModal(torneioId)}>Alterar Confrontos</button>
                                    <Modal
                                        isOpen={modalPartidas}
                                        onRequestClose={closeModal}
                                        style={{
                                            content: {
                                                width: '400px',
                                                height: '400px',
                                                margin: 'auto',
                                                // Add any other custom styles you need
                                            },
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the transparency here
                                            },
                                        }}
                                    >
                                        <button onClick={closeModal}>Fechar</button>
                                        <h3 className='alterH3EditPartida'>Selecione qual confronto você deseja modificar</h3>
                                        <div className='editPartidas'>
                                            <select className='selectPartida' name="partida" onChange={handleOptionChange} value={selectedOption}>
                                                {partida.map((pt, i) => (
                                                    <option value={pt.codPartida} key={pt.codPartida}>
                                                        ID: {pt.codPartida} - {pt.time1.nome} vs {pt.time2.nome}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className='colunaEditPartida'>
                                                {selectedPartida.time1?.imagemDoEscudo && <img src={selectedPartida.time1.imagemDoEscudo} />}
                                                {selectedPartida.time2?.imagemDoEscudo && <img src={selectedPartida.time2.imagemDoEscudo} />}

                                            </div>
                                            <div className='editConfrontos'>
                                                <h2 className='editConfrontosTitle'>Monte os times que irão se enfrentar</h2>
                                                <select className='editConfrontosSelect' onChange={handleSelectTime1} >
                                                    <option value=''>Selecione um Time</option>
                                                    {timesDaPartidaConfronto.map((timesP, i) => (
                                                        <option value={timesP.codTime}>{timesP.nome}</option>
                                                    ))}
                                                </select>
                                                <h2 className='h2EditConfronto'>versus</h2>
                                                <select className='editConfrontosSelect' onChange={handleSelectTime2} >
                                                    <option value=''>Selecione um Time</option>
                                                    {timesDaPartida.map((timesP, i) => (
                                                        <option value={timesP.codTime}>{timesP.nome}</option>
                                                    ))}
                                                </select>
                                                <button className='salvarEditTimeButton'>Alterar</button>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        )}
                        {vencedor && (
                            <div className='numerosContainer'>
                                {tPar.map((tPar, i) => (
                                    <div className='colunaGeradaPar'>
                                        <h1 className='h1Vencedor'>Vencedor</h1>
                                        <img src={tPar.imagemDoEscudo} alt='Escudo' />
                                        <li>{tPar.nome}</li>
                                    </div>
                                ))}
                                <div className='historico'>
                                    <Link to={'/HistoricoPartida/' + torneioId}>
                                        <button>
                                            Historico de Partidas
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddTimes;
