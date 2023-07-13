import React, { useEffect, useState, useRef } from "react";
import MenuLogado from "../../layout/MenuLogado";
import Card from "../../layout/cardTorneios/Card";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import unidecode from 'unidecode';


const TorneiosCriados = () => {

    const [torneioCriado, setTorneioCriado] = useState([]);
    const [torneios, setTorneio] = useState([]);
    const inputBusca = useRef(null)

    const token = localStorage.getItem('usuario');
    const config = {
        headers: { Authorization: `Basic ${token}` }
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/user/me", config).then(result => {
            axios.get("http://localhost:8080/api/torneio/" + result.data.principal.id + "/user", config).then(res => {
                setTorneioCriado(res.data);
                setTorneio(res.data);
                console.log(res)
            })
        })
    }, []);


    const focusBusca = () => {
        inputBusca.current.focus();
    }

    const filterTorneio = (event) => {
        if (event.target.value === '') {
            setTorneioCriado(torneios);
            return;
        }
        const value = event.target.value.toLowerCase();

        const filtered = torneioCriado.filter((item) => {
            const itemName = unidecode(item.nomeT.toLowerCase())
            return itemName.includes(value);
        })
        setTorneioCriado(filtered);
    }
    const estilo = {
        display: 'inline-block',
    }
    const estiloBusca = {
        width: '50%',
        margin: '10px auto',
    }
    const delTorneio = (codTorneio) =>{
        axios.delete(`http://localhost:8080/api/torneio/${codTorneio}`, config);
        setTorneioCriado(prevTorneio => prevTorneio.filter(torneioCriado => torneioCriado.codTorneio !== codTorneio));
        setTorneio(prevTorneio => prevTorneio.filter(torneioCriado => torneioCriado.codTorneio !== codTorneio))
    }
    return (
        <div>
            <MenuLogado />
            <div style={estiloBusca} className='input-icons'>
                <i className="icon" onClick={focusBusca}><SearchIcon /></i>
                <input className='filterTimes' ref={torneioCriado} type="text" onChange={filterTorneio} />
            </div>
            <div>
                {torneioCriado.map(torneioCriado => (
                    <div style={estilo} key={torneioCriado.codTorneio}>
                        <Card
                            id={torneioCriado.codTorneio}
                            nome={torneioCriado.nomeT}
                            descricao={torneioCriado.descricaoT}
                            premio={torneioCriado.premiacao}
                            esporte={torneioCriado.esporte} />
                        <button onClick={() => delTorneio(torneioCriado.codTorneio)} className="delTorneio"><DeleteIcon/></button>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default TorneiosCriados;