import React, {useState, useRef} from 'react'
import "./RegisterPage.css"
import axios from 'axios';
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  
  //url 이동을 위한 useHistory
  //const history = Navigate();
  
  //input에서 입력한 아이디와 비밀번호 정보를 담기위한 state
  const [account, setAccount] = useState({
    name: "",
    id: "",
    password: "",
    confirmpassword: "",
  });
  
  //input에 입력하면 자동적으로 account state값 변경
  const onChangeAccount = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
    console.log(account);
    if (e.target.name === 'name') { setName(e.currentTarget.value) }
    else if (e.target.name === 'id') { setId(e.currentTarget.value) }
    else if (e.target.name === 'password') { setPassword(e.currentTarget.value) }
    else if (e.target.name === 'confirmpassword') { setConfirmpassword(e.currentTarget.value) }
  };


  const [name, setName] = useState("")
  const [id, setId] = useState("");
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmpassword] = useState("")

//   const [imgBase64, setImgBase64] = useState(""); // 파일 base64
//   const [imgFile, setImgFile] = useState(null);	//파일	
  
//   const handleChangeFile = (event) => {
//     let reader = new FileReader();

//     reader.onloadend = () => {
//       // 2. 읽기가 완료되면 아래코드가 실행됩니다.
//       const base64 = reader.result;
//       if (base64) {
//         setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
//       }
//     }
//     if (event.target.files[0]) {
//       reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
//       setImgFile(event.target.files[0]); // 파일 상태 업데이트
//     }
//   }

  const [imageSrc, setImageSrc] = useState('');

  const encodeFileToBase64 = (fileBlob) => { 

      const reader = new FileReader(); 
      
      reader.readAsDataURL(fileBlob); 
      return new Promise((resolve) => { 
          reader.onload = () => { 
              setImageSrc(reader.result); 
              resolve(); 
          }; 
      }); 
  };

  const onSubmit = (e) => {

    e.preventDefault();

    console.log(account)

    if (password !== confirmpassword) {
        window.alert('비밀번호와 비밀번호 확인은 같아야 합니다!')
    }
    
    axios.post("http://localhost:5000/user/register", account)
    .then((response)=> {
        console.log(response)
    })
    .catch((error)=> {
        console.log(error)
    })

  };

  return (
    <div className="loginregister">
      <form>
        <div><h2>회원가입</h2></div>
        <input accept='image/jpg,impge/png,image/jpeg,image/gif' type="file" onChange={(e) => { encodeFileToBase64(e.target.files[0]); }} /> 
        <div className="preview"> {imageSrc && <img src={imageSrc} alt="preview-img" />} </div>
        {/* <div style={{"backgroundColor": "#efefef", "width":"150px", "height" : "150px", "margin": "10px"}}></div>
        <div>
            <label className="input-file-button" for="input-file">
            업로드
            </label>
            <input name="profile_img" type="file" id="input-file" onChange={handleChangeFile} style={{display:"none"}}/>
        </div> */}
        <div><input name="name" type="text" placeholder="이름" value={name} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="id" type="id" placeholder="이메일" value={id} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="password" type="password" placeholder="비밀번호" value={password} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><input name="confirmpassword" type="password" placeholder="비밀번호 확인" value={confirmpassword} onChange={onChangeAccount} className="loginregister__input"/></div>
        <div><button type="submit" onClick={onSubmit} className="loginregister__button">계정 생성하기</button></div>
      </form>
    </div>
  );
}
export default RegisterPage;