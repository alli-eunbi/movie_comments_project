import React, { useState , useEffect } from 'react';
import { API_URL } from '../../Api/Config';
import NavBar from '../../Components/NavBar/NavBar';
import styled from 'styled-components';
import MovieDetail from '../../Components/MovieDetail/MovieDetail'
import axios from 'axios';
import { useParams } from 'react-router';


function MovieInfoPage(props) {
    
    const [ fetchMovieInfo, setFetchMovieInfo ] = useState([])
    const movieId = useParams().movie_id;
    
    useEffect(()=> {
        const fetchData = async() => {
          const result = await axios.get(`http://localhost:5000/movies/${movieId}`)
          setFetchMovieInfo(result.data.data.movie_info);
        };
        fetchData();
      }, []);
      console.log(fetchMovieInfo)
    return (   
        <div>
            <NavBar/>
            <Inner>
                <Box>
                    <MovieDetail
                        movie={fetchMovieInfo}/>
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 12px;
    background-color: #EEEEEE;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
    text-align: center;
    font-size: 50px;
    flex-wrap: wrap;
    flex-direction: column;
`;