import React, { useState , useEffect } from 'react';
import { API_URL } from '../../Api/Config';
import NavBar from '../../Components/NavBar/NavBar';
import styled from 'styled-components';


function MovieInfoPage(props) {
    
    // let movieId = props.match.params.movieId
    // const [Movie, setMovie] = useState([])

    // useEffect(() => {
    //     let movieInfo = `${API_URL}movie/${movieId}`

    //     fetch(movieInfo)
    //         .then(response => response.json())
    //         .then(response => {
    //             setMovie(response)
    //         })
    // }, [])

    return (
        <div>
            <NavBar/>
            <Inner>
                <Box>
                    <MovieInfo/>
                    MovieInfoPage
                </Box>
            </Inner>
        </div>
    )
}

export default MovieInfoPage;

const Inner = styled.div`
    height: 100vh;
    display: flex;
    background-color: #1C2126;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    font-family: 'Noto Sans KR', sans-serif;
`;

const Box = styled.div`
    width: 90%;
    height: auto;
    padding-top: 100px;
    border-radius: 12px;
    background-color: #EEEEEE;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
    text-align: center;
    font-size: 50px;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 25px;
`;