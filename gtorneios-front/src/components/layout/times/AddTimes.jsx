
import { useState } from 'react';
import MenuLogado from '../MenuLogado';
import './AddTimes.css'
import axios from 'axios';
import { useEffect } from 'react';

const AddTimes = (props) =>{
    const userId = props.match.params.id;
    const [torneio, setTorneio] = useState([]);
    useEffect(()=>{
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get("http://localhost:8080/api/torneio/"+userId+"", config).then(res =>{
            setTorneio(res.data);
            console.log(res.data);
        })
    },[])
    return(
        <div>
            <MenuLogado/>
            <h2>{userId}</h2>
            <h2>{torneio.qtdDeTimes}</h2>
        </div>
    )
}

export default AddTimes;