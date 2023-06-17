import React, { useState, useEffect, useRef } from 'react';
import MenuLogado from '../MenuLogado';
import './AddTimes.css';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import unidecode from 'unidecode';
import Modal from 'react-modal';
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

    const [tPar, setPar] = useState([]);
    const [tImpar, setImpar] = useState([]);

    //botões DELETE E GERAR PARTIDA
    const [mostrarBotao, setMostrarBotao] = useState(false);
    const [mostrarBotaoDelete, setMostrarBotaoDelete] = useState(false);
    const [mostraBotaoRodada, setMostrarBotaoRodada] = useState(false);
    const [mostrarBotaoEdit, setMostrarBotaoEdit] = useState(false);

    //Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);


    //useRef
    const inputBusca = useRef(null)
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
                console.log(res.data);
                console.log("AQUI");
                if (res.data[0] == null) {
                    setMostrarBotao(true);
                    setMostrarBotaoDelete(true);
                    setMostrarBotaoEdit(true);
                    setMostrarBotaoRodada(false);
                } else {
                    setMostrarBotao(false);
                    setMostrarBotaoDelete(false);
                    setMostrarBotaoEdit(false);
                    if (res.data.length == 1) {
                        setMostrarBotaoRodada(false);
                    } else {
                        setMostrarBotaoRodada(true);
                    }
                    setTimesDaPartida(res.data);
                    separarNumerosParesImpares(res.data);

                }
            })
        }

    }, [torneioId]);

    const focusBusca = () => {
        inputBusca.current.focus();
    }
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
        setMostrarBotaoEdit(false);
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
                console.log(partidas);
                axios.post('http://localhost:8080/api/partida', partidas, config)
                    .then(res => {
                        axios.get(`http://localhost:8080/api/partida/${torneioId}`, config).then(res => {
                            if (res.data[0] == null) {
                            } else {
                                separarNumerosParesImpares(res.data);
                                setTimesDaPartida(res.data);
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
    //ABRIR e FECHAR MODAL
    const openModal = (time) => {
        setSelectedTime(time);
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
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

        setTimeSalvo(updatedTimeSalvo);
        setFilteredData(updatedTimeSalvo);
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


    const gerarPlacar = (time1, time2) => {
        if (timesDaPartida.length == 1) {
            return null;
        }
        // Código para gerar um placar aleatório entre os times
        let placarTime1;
        let placarTime2;
        do {
            placarTime1 = Math.floor(Math.random() * 5);
            placarTime2 = Math.floor(Math.random() * 5);
        } while (placarTime1 === placarTime2);

        if (placarTime1 > placarTime2) {
            //console.log("Time1:" + placarTime1);
            //console.log("Time2:" + placarTime2);
            setTimesDaPartida(prevTimes => prevTimes.filter(time => time.codTime !== time2.codTime));
            //retorna o time perdedor
            return {
                timePerdedor: time2,
                placar: `${time1.nome}: ${placarTime1} - ${time2.nome}: ${placarTime2}`,
                timeGanhador: time1
            };
        }
        if (placarTime1 < placarTime2) {
            //console.log("Time1:" + placarTime1);
            //console.log("Time2:" + placarTime2);
            setTimesDaPartida(prevTimes => prevTimes.filter(time => time.codTime !== time1.codTime));
            //retorna o time perdedor
            return {
                timePerdedor: time1,
                placar: `${time1.nome}: ${placarTime1} - ${time2.nome}: ${placarTime2}`,
                timeGanhador: time2
            };
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

            })
            .catch(error => {
                console.error('Erro ao criar as partidas:', error);
            });
    }

    const rodada = () => {
        setMostrarBotaoRodada(false);
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };

        let timesPassaramChamado = false; // Flag para verificar se a função timesPassaram já foi chamada

        for (let i = 0; i < timesDaPartida.length - 1; i += 2) {
            if (timesDaPartida.length === 1) {
                break;
            }
            let time1 = timesDaPartida[i];
            let time2 = timesDaPartida[i + 1];
            let p = gerarPlacar(time1, time2);
            let placar = {
                placar: p.placar
            }
            axios.put(`http://localhost:8080/api/time/${p.timePerdedor.codTime}/${torneioId}`, placar, config)
                .then((res) => {
                    separarNumerosParesImpares(res.data);
                    if (!timesPassaramChamado) {
                        timesPassaram(res.data);
                        timesPassaramChamado = true;
                        setTimeout(() => {
                            if (timesDaPartida.length == 2) {
                                setMostrarBotaoRodada(false);
                            } else {
                                setMostrarBotaoRodada(true);
                            }
                        }, 1000); // Define o tempo de espera para reabilitar o botão em milissegundos (2 segundos neste exemplo)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMostrarBotaoRodada(true);
                });
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
                                    {mostrarBotaoEdit && (
                                        <button onClick={() => openModal(time)}>Edit</button>
                                    )}
                                    <Modal
                                        isOpen={modalIsOpen}
                                        onRequestClose={closeModal}
                                        style={{
                                            content: {
                                                width: '300px',
                                                height: '300px',
                                                margin: 'auto',
                                                // Add any other custom styles you need
                                            },
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the transparency here
                                            },
                                        }}
                                    >
                                        <button onClick={closeModal}>Fechar</button>
                                        {selectedTime && (
                                            <>
                                                <h2>Editar Time</h2>
                                                <h2>{selectedTime.nome}</h2>
                                                <label htmlFor="">Nome Time </label><br></br>
                                                <input type="text" value={nomeTime} onChange={(e) => setNomeTime(e.target.value)} /><br />
                                                <label htmlFor="">Abreviacao </label><br></br>
                                                <input type="text" value={abrev} onChange={(e) => setAbrev(e.target.value)} /><br />
                                                <label htmlFor="">Imagem do Escudo </label><br />
                                                <input type="text" value={imgShield} onChange={(e) => setImgShield(e.target.value)} /><br /><br />
                                            </>
                                        )}
                                        <button onClick={() => editarTime(selectedTime.codTime)}>Salvar Edição</button>
                                    </Modal>
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
                            {mostraBotaoRodada && (
                                <button className='btn' onClick={rodada}>Rodada</button>
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
