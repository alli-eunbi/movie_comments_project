import React, { useState } from 'react'
import Axios from 'axios'
import {
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';


function RegisterPage(props) {

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        console.log('Email', Email)
        console.log('Password', Password)

        let body = {
            email: Email,
            password: Password
        }
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default RegisterPage


