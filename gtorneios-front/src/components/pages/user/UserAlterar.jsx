import React, { useId, useState } from "react";
import MenuLogado from "../../layout/MenuLogado";
import './UserAlterar.css'
import axios from "axios";
import { useEffect } from "react";
import AvartarAlterar from "./AvatarAlterar";
import { Redirect } from "react-router-dom";

const UserAlterar = () => {

    //useState
    const [userId, setId] = useState('');
    const [userUpdate, setUserUpdate] = useState('');
    const [userAntigo, setUserAntigo] = useState('');
    const [senha, setSenha] = useState('');
    const [emailUpdate, setEmailUpdate] = useState('');
    const [avatarUpdate, setAvatarUpdate] = useState(null);
    const [avatarNull, setAvatarNull] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };
        axios.get('http://localhost:8080/api/user/me', config).then(result => {
            setEmailUpdate(result.data.principal.email);
            setUserUpdate(result.data.principal.username);
            setUserAntigo(result.data.principal.username);
            setAvatarNull(result.data.principal.avatar);
            setId(result.data.principal.id);
        })
    }, []);


    const user = {
        email: emailUpdate,
        username: userUpdate,
        avatar: avatarUpdate
    }

    const rout = 'http://localhost:8080/api/user/' + userId + '';

    const updateSubmit = (event) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        const config2 = {
            headers: {
                Authorization: 'Basic ' + btoa(`${userAntigo}:${senha}`)
            }
        };
        console.log(event.target.value);
        if(config.headers.Authorization == config2.headers.Authorization){
            if(user.avatar == null){
                user.avatar = avatarNull;
            }
            axios.put(rout, user, config).then(result => {
                //verifica se la dentro do spring as senhas são iguais, se não forem pega uma informação
                //indefinida e da a resposta para o usuario dizendo que a senha está errada
                if (result) {
                    //reload na pagina para carregar as informações
                    alert("alteração realizada");
                    localStorage.clear();
                    localStorage.setItem('usuario', btoa(userUpdate + ':' + senha));
                    window.location.reload();
                }
            }).catch(err => {
                alert("Senha errada");
                console.log(err);
            })
        }else{
            alert("Senha errada");
        }
        event.preventDefault();
    }

    if(!localStorage.getItem("usuario")){
        return <Redirect to="/login" />
    }
    const deleteAccount = (e) => {
        const token = localStorage.getItem('usuario');
        const config = {
            headers: { Authorization: `Basic ${token}` }
        };

        axios.delete(`http://localhost:8080/api/user/${e}`, config)
            .then(res => {
                console.log(res);
                // Processar resposta de sucesso aqui, se necessário
            })
            .catch(error => {
                console.error(error);
                // Tratar erros aqui
            });
            localStorage.clear();
            window.location.reload();
    };

    return (
        <div>
            <MenuLogado />
            <form onSubmit={updateSubmit} className="alterar-form">
                <AvartarAlterar imagem={avatarUpdate} />
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={userUpdate}
                        onChange={e => setUserUpdate(e.target.value)}
                        name='username'
                        
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="text"
                        id="avatar"
                        value={avatarUpdate}
                        onChange={e => setAvatarUpdate(e.target.value)}
                        placeholder="insira a url da imagem"
                        name='avatar'
                        
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
                        
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="text"
                        id="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder="Digite sua senha para fazer as alterações"
                        name='senha'
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
            <div className="delDiv">
                <button className="del" onClick={() => deleteAccount(userId)}>Delete Account</button>
            </div>
        </div>
    )
}



export default UserAlterar;