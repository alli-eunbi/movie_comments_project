import React, { useState , useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';
import axios from 'axios';
import SearchMovies from '../../Components/SearchMovies/SearchMovies';
import { useLocation } from 'react-router';
import queryString from 'query-string';


function MovieSearchPage() {

    const [SearchTerm, setSearchTerm] = useState("")
    const [SearchMovieResult, setSearchMovieResult] = useState()
    const { search } = useLocation();
    const { keyword } = queryString.parse(search);
    
    useEffect(() => {
        const fetchData = async() => {
            const result = await axios.get(`http://localhost:5000/movies/search`, {
                params: {
                    keyword: `${keyword}`
                }
            });
            setSearchMovieResult(result.data.data)
            console.log(SearchMovieResult) 
        }
        fetchData();
    },[])

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
    }
    return (
        <>
            <NavBar
                refreshFunction={updateSearchTerm}
            />
            <Inner>
                <Box>                    
                    MovieSearchPage
                    <Container>
                        {SearchMovieResult && SearchMovieResult.map(movie =>(
                            <SearchMovies
                            key={movie.index}
                            image={movie.poster_url}
                            movieId={movie.index}

                        />   
                        ))}
                    </Container>
                </Box>
            </Inner>
        </>
        );
}

export default MovieSearchPage;

const Inner = styled.div`
    height: auto;
    min-height: 100vh;
    display: flex;
    background-color: #1C2126;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    font-family: 'Noto Sans KR', sans-serif;
`;

const Box = styled.div`
    width: 90%;
    height: auto%;
    min-height: 75vh;
    margin-top: 100px;
    border-radius: 12px;
    background-color: #EEEEEE;
    box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
    text-align: center;
    font-size: 50px;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 25px;
`;

const Container = styled.div`
    display: grid;
    padding-top: 50px;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
    align-items: center;
    gap: 10px;
`;
