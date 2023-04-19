import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import AvartarMenu from "./AvatarMenu";


const Dropdown = () => {

    const [user, setUser] = useState('');
    const [avatarLogado, setAvatarLogado] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get('http://localhost:8080/api/user/me', config).then(result => {
            console.log(result)
            setUser(result.data.name);
            setAvatarLogado(result.data.principal.avatar);
        })
    }, []);


    const sair = () => {
        localStorage.clear();
        window.location.href = '/'
    }

    return (
        <div className="dropdown">
            <div className="droping">
                <AvartarMenu imagem={avatarLogado ? avatarLogado : null} />
                <button className="dropdown-button">
                    {user}
                </button>
            </div>
            {(
                <div className="dropdown-content">
                    <button className="dropdown-item">Torneios Criados</button>
                    <Link to={'/UserAlterar'}><button className="dropdown-item" >Alterar Dados</button></Link>
                    <button className="dropdown-item" onClick={sair}>Sair</button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
