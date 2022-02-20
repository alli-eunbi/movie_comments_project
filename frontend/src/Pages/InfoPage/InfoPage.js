import React, { useState , useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';
import axios from 'axios';
import SearchMovies from '../../Components/SearchMovies/SearchMovies';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { API_URL } from '../../Api/Config';
import MovieDetail from '../../Components/MovieDetail/MovieDetail'
import { useParams } from 'react-router';
import MainMovies from '../../Components/MainMovies/MainMovies';


export default function InfoPages() {

    const [ sawMovieInfo, setSawMovieInfo ] = useState([])
    const [ likedMovieInfo, setLikedMovieInfo ] = useState([])

    const userId = useParams().user_id;


    useEffect(()=> {
        const fetchData = async() => {
            const result = await axios.get(`http://localhost:5000/user-info/${userId}`)
            setSawMovieInfo(result.data.comment_movies);
            setLikedMovieInfo(result.data.want_watch_movies);
        };
        fetchData();
    }, []);
    console.log(sawMovieInfo)
    console.log(likedMovieInfo)
    

    return (
        <>
            <NavBar/>
            <Inner>
                <Box>
                    InfoPage
                    <Title>
                        봤어요
                    </Title>
                        {sawMovieInfo && sawMovieInfo.map(movie => (
                            <React.Fragment key={movie.index}>
                                <MainMovies
                                    movieId={movie.index}
                                    image={movie.poster_url}
                                />
                            </React.Fragment>
                        ))}
                    <Title>
                        보고 싶어요
                    </Title>
                        {likedMovieInfo && likedMovieInfo.map(movie => (
                            <React.Fragment key={movie.index}>
                                <MainMovies
                                    movieId={movie.index}
                                    image={movie.poster_url}
                                />
                            </React.Fragment>
                        ))}
                </Box>
            </Inner>
        </>
    )
};

const Inner = styled.div`
    height: 150vh;
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

const Title = styled.div`
    width: 20vh;
    height: 7vh;
    border-radius: 12px;
    color: white;
    background-color: #46A6A6;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
    text-align: center;
    line-height: 50px;
    font-size: 3vh;
`

const MovieList = styled.div`
    width: 90%;
    height: 30vh;
`