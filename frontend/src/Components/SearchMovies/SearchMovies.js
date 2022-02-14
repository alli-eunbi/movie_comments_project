import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function SearchMovies({image, movieId}) {
    
    let navigate = useNavigate();
    
    function handleClick() {
        navigate(`/movies/${movieId}`);
    }

    return ( 
        <>
        <Box>
            {image ? 
                    <MovieImg
                        src={image} 
                        alt='영화 포스터'
                        onClick={handleClick}
                    />
            : <h5 onClick={handleClick} >포스터가 없습니다 :( </h5>}
        </Box>
        </>
  )
}

export default SearchMovies;

const MovieImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-size: cover;
`

const Box = styled.div`
    width: 25vh;
    height: 200px;
    border-radius: 12px;
    background-color: #EEEEEE;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    justify-items: center;
    align-items: center;
    font-size: 20px;
`;
