import React, { useState, useEffect } from 'react';
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

    const [tPar, setPar] = useState([]);
    const [tImpar, setImpar] = useState([]);

    //botões DELETE E GERAR PARTIDA
    const [mostrarBotao, setMostrarBotao] = useState(false);
    const [mostrarBotaoDelete, setMostrarBotaoDelete] = useState(false);


    //Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);


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
            setFilteredData(res.data);
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
        setMostrarBotao(false);
        setMostrarBotaoDelete(false);
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



    //DELETAR TIME
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
                setFilteredData(prevTimes => prevTimes.filter(time => time.codTime !== codTime));

            })
            .catch(err => {
                console.log(err);
            });
        setQtd(qtd - 1);
    };

    const [inputValue, setInputValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    //BUSCAR TIMES
    const filterTeams = (event) => {
        if (event.target.value === '') {
            setTimeSalvo(filteredData);
            return;
        }

        const value = event.target.value.toLowerCase();
        setInputValue(value);

        const filtered = timeSalvo.filter((item) => {
            const itemName = unidecode(item.nome.toLowerCase());
            return itemName.includes(value);
        });

        setTimeSalvo(filtered);
    }
    //ABRIR e FECHAR MODAL
    const openModal = (time) => {
        setSelectedTime(time);
        console.log(selectedTime);
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
            return {
              ...timeObj,
              ...time
            };
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
                                    <button onClick={() => openModal(time)}>Edit</button>
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
