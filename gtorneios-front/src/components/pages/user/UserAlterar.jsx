import React, { useState } from "react";
import MenuLogado from "../../layout/MenuLogado";
import './UserAlterar.css'
import axios from "axios";
import { useEffect } from "react";
import AvartarAlterar from "./AvatarAlterar";

const UserAlterar = () => {

    //useState
    const [userId, setId] = useState('');
    const [emailUpdate, setEmailUpdate] = useState('');
    const [avatarUpdate, setAvatarUpdate] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get('http://localhost:8080/api/user/me', config).then(result => {
            setEmailUpdate(result.data.principal.email)
            setId(result.data.principal.id);
        })
    }, []);


    const user = {
        email: emailUpdate,
        avatar: avatarUpdate
    }

    const rout = 'http://localhost:8080/api/user/' + userId + '';

    const updateSubmit = (event) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.put(rout, user, config).then(result => {
            //verifica se la dentro do spring as senhas são iguais, se não forem pega uma informação
            //indefinida e da a resposta para o usuario dizendo que a senha está errada
            if (result) {
                //reload na pagina para carregar as informações
                alert("alteração realizada");
                window.location.reload(true);
            }
        }).catch(err => {
            alert("Senha errada");
            console.log(err);
        })
        event.preventDefault();
    }

    return (
        <div>
            <MenuLogado />
            <form onSubmit={updateSubmit} className="alterar-form">
                <AvartarAlterar imagem={avatarUpdate} />
                <div className="form-group">
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="text"
                        id="avatar"
                        value={avatarUpdate}
                        onChange={e => setAvatarUpdate(e.target.value)}
                        placeholder="insira o a url da imagem"
                        name='avatar'
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={emailUpdate}
                        onChange={e => setEmailUpdate(e.target.value)}
                        placeholder="Insira seu e-mail"
                        name='email'
                        required
                    />
                </div>
                <button type="submit">save</button>
            </form>
        </div>
    )
}



export default UserAlterar;