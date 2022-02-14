import React, {useState} from 'react'
import "./LoginPage.css"
import axios from 'axios';
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState, loginState } from "../../Pages/Recoil/Atoms";
import useSessionStorage from "../Recoil/useSessionStorage";


const LoginPage = () => {
  
  //url 이동을 위한 useHistory
  const navigate = useNavigate();
  
  //input에서 입력한 아이디와 비밀번호 정보를 담기위한 state
  const [account, setAccount] = useRecoilState(userState);
  const [loginResult, setLoginResult] = useRecoilState(loginState);

  const [on, setOn] = useSessionStorage("on", false);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  //input에 입력하면 자동적으로 account state값 변경
  const onChangeAccount = (e) => {
    if (e.target.name === 'id') { setId(e.currentTarget.value) }
    else if (e.target.name === 'password') { setPassword(e.currentTarget.value) }

    setAccount(() => ({
      ...account,
      [e.target.name]: e.target.value,
    }));
    
    console.log(account);
  };



  const onSubmit = (e) => {

    e.preventDefault();

    console.log(account)
    
    axios.post("http://localhost:5000/user/login/local", account, {withCredentials: true})
    .then((response)=> {
      console.log(response)

      let result = response.data.success;
      console.log(result);

      if (result === true) {
        setLoginResult(result);
        setOn(true);
        navigate('/');
      }
    })
    .catch((error)=> {
        console.log(error)
    })

  };

  return (
    <div className="loginregister">
      <form>
          <div><h2>로그인</h2></div>
          <div><input name="id" type="id" placeholder="아이디" value={id} onChange={onChangeAccount} className="loginregister__input"/></div>
          <div><input name="password" type="password" placeholder="비밀번호" value={password} onChange={onChangeAccount} className="loginregister__input"/></div>
          <div><button type="submit" onClick={onSubmit} className="loginregister__button">로그인</button></div>
      </form>
    </div>
  );
}
export default LoginPage;