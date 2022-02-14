import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { loginState } from '../../Pages/Recoil/Atoms';

function Favorite() {
  
  const LogInChecker = useRecoilValue(loginState)
  const movieId = useParams().movie_id
  const [likeStatus, setLikeStatus] = useState(`좋아요`)

  const likedChecker = async() => {
    if(LogInChecker === true) {
      await axios.post(`http://localhost:5000/movies/${movieId}/like`, { withCredentials : true})
        .then(response => {
          let result = response.data.message;
          if (result === '좋아요 등록 완료') {
            setLikeStatus(`좋아요 취소`) 
          } else {
            axios.post(`http://localhost:5000/movies/${movieId}/dislike`, { withCredentials : true})
            setLikeStatus(`좋아요`) 
          }
        })
        .catch((error) => {
            console.log(error);
        }) 
    } else {
        alert('로그인 후 이용해주세요!')
    }
  }

    // useEffect(() => {
    //     let variable = {
    //         movie_id
    //     }

    //     const postFavorite = async() => {
    //         Axios.post(`http://localhost:5000/movies/${movie_id}/like`, variable)
    //     }

    // }, [])

    return (
      <div>
          <button onClick={likedChecker}>{likeStatus}</button>
      </div>
    )
}

export default Favorite;
