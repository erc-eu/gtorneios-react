import React, { useEffect, useState } from "react";
import MenuLogado from "../../layout/MenuLogado";
import Card from "../../layout/cardTorneios/Card";
import axios from "axios";


const TorneiosCriados = () => {

    const [torneioCriado, setTorneioCriado] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get("http://localhost:8080/api/user/me", config).then(result => {
            axios.get("http://localhost:8080/api/torneio/" + result.data.principal.id + "/user", config).then(res => {
                setTorneioCriado(res.data);
                
            })
        })
    }, []);


    const estilo = {
        display: 'inline-block',
    }

    return (
        <div>
            <MenuLogado />
            <div>
                {torneioCriado.map(torneioCriado => (
                    <div style={estilo} key={torneioCriado.codTorneio}>
                        <Card
                            id={torneioCriado.codTorneio} 
                            nome={torneioCriado.nomeT}
                            descricao={torneioCriado.descricaoT}
                            premio={torneioCriado.premiacao}
                            esporte={torneioCriado.esporte} />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default TorneiosCriados;