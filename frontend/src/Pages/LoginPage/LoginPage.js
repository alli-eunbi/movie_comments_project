import React, {useState} from 'react'
import "./LoginPage.css"
import axios from 'axios';
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  
  //url 이동을 위한 useHistory
  //const history = Navigate();
  
  //input에서 입력한 아이디와 비밀번호 정보를 담기위한 state
  const [account, setAccount] = useState({
    id: "",
    password: "",
  });
  
  //input에 입력하면 자동적으로 account state값 변경
  const onChangeAccount = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
    console.log(account);
    if (e.target.name === 'id') { setId(e.currentTarget.value) }
    else if (e.target.name === 'password') { setPassword(e.currentTarget.value) }
  };


  const [id, setId] = useState("");
  const [password, setPassword] = useState("")

//   const onNameHandler = (event) => {
//     setName(event.currentTarget.value)
//   }
//   const onIdHandler = (event) => {
//       setId(event.currentTarget.value)
//   }

//   const onPasswordHandler = (event) => {
//       setPassword(event.currentTarget.value)
//   }

//   const onConfirmpasswordHandler = (event) => {
//       setConfirmpassword(event.currentTarget.value)
//   }

  const onSubmit = (e) => {

    e.preventDefault();

    console.log(account)
    
    axios.post("http://localhost:5000/user/login", account)
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error)
    })

  };

  return (
    <div class="loginregister">
      <form>
          <div><input name="id" type="id" placeholder="이메일" value={id} onChange={onChangeAccount} className="loginregister__input"/></div>
          <div><input name="password" type="password" placeholder="비밀번호" value={password} onChange={onChangeAccount} className="loginregister__input"/></div>
          <div><button type="submit" onClick={onSubmit} className="loginregister__button">로그인</button></div>
      </form>
    </div>
  );
}
export default LoginPage;