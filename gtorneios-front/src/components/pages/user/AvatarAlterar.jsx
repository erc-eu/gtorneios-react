import React from "react"
const AvartarAlterar = (props) => {
    if (props.imagem == null) {
        return 
    } else {
        return (
            <h2 className="h2img">
                <img className="avatarImagem" src={props.imagem} />
            </h2>
        )
    }

}

export default AvartarAlterar;