import MenuHome from "../layout/MenuHome";
import MenuLogado from "../layout/MenuLogado";

const Home = () => {

    // if (!localStorage.getItem('usuario')) {
    //   return <Redirect to="/login" />
    //}
    if (!localStorage.getItem('usuario')) {

        return (
            <div>
                <MenuHome />
            </div>
        )
    } else {
        return (
            <div>
                <MenuLogado />
            </div>
        )
    }
}


export default Home;