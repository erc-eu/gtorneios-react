import React from "react"
import './AvatarMenu.css'
const AvartarMenu = (props) => {
    if (props.imagem == null) {
        return 
    } else {
        return (
            <img className="avatarLogado" src={props.imagem} />

        )
    }

}

export default AvartarMenu;