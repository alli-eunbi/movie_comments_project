import React, {useState, useRef} from 'react'
import "./RegisterPage.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Avatar } from "antd";

const RegisterPage = () => {
  
  //url 이동을 위한 useHistory
  const navigate = useNavigate();

  //input에서 입력한 아이디와 비밀번호 정보를 담기위한 state
  const [account, setAccount] = useState({
    profile_img:"",
    name: "",
    id: "",
    password: "",
    confirmpassword: ""
  });
  
  //input에 입력하면 자동적으로 account state값 변경
  const onChangeAccount = (e) => {

    if (e.target.name === 'name') { setName(e.currentTarget.value) }
    else if (e.target.name === 'id') { setId(e.currentTarget.value) }
    else if (e.target.name === 'password') { setPassword(e.currentTarget.value) }
    else if (e.target.name === 'confirmpassword') { setConfirmpassword(e.currentTarget.value) }

    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
    console.log(account);

  };

  const [profile_img, setProfile_img] = useState("");
  const [name, setName] = useState("")
  const [id, setId] = useState("");
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmpassword] = useState("")

const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
const fileInput = useRef(null)
const [file, setFile] = useState(null)

const onChange = (e) => {
if(e.target.files[0]){
        setFile(e.target.files[0])
        setAccount({
            ...account,
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'profile_img') { setProfile_img(e.target.files[0])}
        console.log(account)
    }else{ //업로드 취소할 시
        setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
        return
    }
//화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
        if(reader.readyState === 2){
            setImage(reader.result)
        }
    }
    reader.readAsDataURL(e.target.files[0])
}

  const onSubmit = (e) => {

    e.preventDefault();
    console.log(account)

    if (password !== confirmpassword) {
        window.alert('비밀번호와 비밀번호 확인은 같아야 합니다!')
    }
    
    axios.post("http://localhost:5000/user/register", account, {withCredentials: true})
    .then((response)=> {
        console.log(response)
        let success = Object.values(response);
        let result = Object.values(success[0]);
        if (result[0] === true) {
          console.log(result[0]);
          alert('회원가입이 완료되었습니다!');
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
        <div><h2>회원가입</h2></div>
        <div>
            <Avatar
                src={Image}
                style={{margin:'20px'}}
                size={200}
                onClick={()=>{fileInput.current.click()}}/>
             <input 
                type='file' 
                style={{display:'none'}}
                accept='image/jpg,impge/png,image/jpeg'
                name='profile_img'
                onChange={onChange}
                ref={fileInput}/>
        </div>
        <div><input name="name" type="text" placeholder="이름" value={name} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="id" type="id" placeholder="아이디" value={id} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="password" type="password" placeholder="비밀번호" value={password} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="confirmpassword" type="password" placeholder="비밀번호 확인" value={confirmpassword} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><button type="submit" onClick={onSubmit} className="loginregister__button">계정 생성하기</button></div>
      </form>
    </div>
  );
}
export default RegisterPage;