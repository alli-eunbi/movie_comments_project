import React, { useState , useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import styled from 'styled-components'


function Modal({ className, visible, onClose, maskClosable, closable}) {

    const [ myScore, setMyScore] = useState()
    const [ expertScore, setExpertScore] = useState()
    const [ userScore, setUserScore ] = useState()
    const movieId = useParams().movie_id

    useEffect(() => {
        const fetchData = async() => {
            const result = await axios.get(`http://localhost:5000/movies/${movieId}`);
            setMyScore(result.data.data.review_data.at(-1).score)
            setExpertScore(result.data.data.movie_info.naver_expert_score)
            setUserScore(result.data.data.movie_info.naver_user_score)
        }
        fetchData();
    },[])

    const onMaskClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(e)
        }
      }
    
    const close = (e) => {
        if (onClose) {
            onClose(e)
        }
    }

    return (
        <>
        <ModalOverlay visible={visible} />
        <ModalWrapper 
            className={className} 
            onClick={maskClosable ? onMaskClick : null}
            tabIndex="-1" 
            visible={visible}>
            <ModalInner tabIndex="0" className="modal-inner">
                <span>이용자님의 평점은 {myScore}점 입니다.</span><br/>
                <span>전문가 평점은 {expertScore}점 입니다.</span><br/>
                <span>관람객 평점은 {userScore}점 입니다.</span>
            </ModalInner>
        </ModalWrapper>
        </>
    )
}

export default Modal;

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`
const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`
const ModalInner = styled.div`
  box-sizing: border-box;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  width: 100vh;
  height: 80vh;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 40px 20px;
`