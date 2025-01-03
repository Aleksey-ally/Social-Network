import s from './LoginForm.module.scss'

import {TextField} from "components/TextField";
import {Button} from "components/Button";
import {useController, useForm} from "react-hook-form";
import {login} from "redux/authReducer";
import {useAppDispatch} from "redux/reduxStore";
import {Checkbox} from "components/Checkbox";
import {useState} from "react";
import {Typography} from "components/Typography";
import {toast} from "react-toastify";
import {infoOptions} from "utils/ToastifyOptions/ToastifyOptions";
import {PropertiesLogin} from "api/autn/auth.types";
import {useTranslation} from "react-i18next";


type FormValues = {
    email: string,
    password: number
    rememberMe: boolean
    captcha: string
}
export const LoginForm = () => {
    const dispatch = useAppDispatch()
    const {
        control,
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({
        mode: 'onTouched',
    })

    const [generalError, setGeneralError] = useState<string>('')
    const [captchaUrl, setCaptchaUrl] = useState<string>('')

    const {t} = useTranslation();

    const onSubmit = (data: PropertiesLogin) => {
        dispatch(login(data)).then((message) => {
            if (typeof message === "string") {
                setGeneralError(message);
            } else if (typeof message === 'object') {
                setGeneralError(message.message)
                setCaptchaUrl(message.captchaUrl)
            } else {
                toast.info(t("notifications.welcome"), infoOptions);
            }
        })
    }

    const {
        field: {value, onChange}
    } = useController({
        name: 'rememberMe',
        control,
        defaultValue: false,
    })

    const [inputValue, setInputValue] = useState({
        email: 'free@samuraijs.com',
        password: 'free'
    })


    return (
        <div className={s.login}>
            <Typography variant="large" className={s.title}>
                {t("login.signIn")}
            </Typography>
            <form className={s.loginForm} onSubmit={handleSubmit(onSubmit)}>

                <TextField value={inputValue.email} onValueChange={(value)=>setInputValue({...inputValue, email: value})} type={'email'} label={'Email'}
                           {...register('email', {required: 'Email is required'})}
                           errorMessage={errors.email?.message}/>

                <TextField value={inputValue.password} onValueChange={(value)=>setInputValue({...inputValue, password: value})} type={"password"} label={t("login.password")}
                           {...register('password', {
                               required: 'Password is required',
                               minLength: {value: 3, message: 'Min length 3'}
                           })}
                           errorMessage={errors.password?.message}/>

                <Checkbox label={t("login.rememberMe")} {...register('rememberMe')} onValueChange={onChange}
                          checked={value}/>
                <img src={captchaUrl} alt=""/>
                {generalError && <Typography variant='error'>{generalError}</Typography>}
                {captchaUrl && <TextField type={'text'} {...register('captcha', {required: 'Captcha is required'})}
                                          errorMessage={errors.captcha?.message}/>}
                <Button type="submit" fullWidth variant={'tertiary'} className={s.button}>
                    {t("login.signInBtn")}
                </Button>
            </form>
        </div>

    )
}

