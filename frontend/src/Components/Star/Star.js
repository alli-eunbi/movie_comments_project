import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Rating } from 'react-simple-star-rating';
import { useRecoilValue } from 'recoil';
import { loginState } from '../../Pages/Recoil/Atoms';
import axios from 'axios';
import Modal from '../Modal/Modal'

function Star(props) {

    const LogInChecker = useRecoilValue(loginState);
    const movieId = useParams().movie_id
    const [rating, setRating] = useState(0) 
    const [postResult, setPostResult] = useState()
    
    const handleRating = (rate) => {
        setRating(rate / 10)
    }
    
    const postRating = async(rating) => {
        if(LogInChecker === true && rating > 0) {
            const response = await axios.post(`http://localhost:5000/movies/${movieId}/rating`, {
                rating: `${rating}` / 10
            }, { withCredentials : true})
            setPostResult(response)
        } else {
            alert('로그인 후 이용해주세요!')
        }
    }

    
    return (
        <div>
            <Rating 
                onClick={handleRating, postRating}
                retingValue={rating}
                size={50}
                transition
                allowHalfIcon
            />
            {postResult ? 
                <Modal visible={true}/> : null}
        </div>
    )
}

export default Star;
