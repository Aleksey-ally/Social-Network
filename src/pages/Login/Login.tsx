import {LoginForm} from "components/LoginForm";
import {useSelector} from "react-redux";
import {ReducersType} from "redux/reduxStore";
import {Navigate} from "react-router-dom";

export const Login = () => {

    const isAuth = useSelector<ReducersType, boolean>(state => state.auth.isAuth)

    if (isAuth) return <Navigate to={'/'}/>

    return <LoginForm/>
}