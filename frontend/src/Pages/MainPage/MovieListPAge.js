import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MainMovies from '../../Components/MainMovies/MainMovies';

function MovieListPage() {
    
    const [fetchMovie, setFetchMovie] = useState(); 
    
    useEffect(()=> {
        const fetchData = async() => {
          const result = await axios.get('http://localhost:5000/movies')
          setFetchMovie(result.data.data);
        };
        fetchData();
      }, []);
      
    return(
        <>
        아래 영화를 <PointText>평가</PointText>해 주세요.
        <Container>
            {fetchMovie && fetchMovie.map(movie => (
                <React.Fragment key={movie.index}>
                    <MainMovies
                      movieId={movie.index}
                      image={movie.poster_url}
                    />
                </React.Fragment>
                ))}
        </Container>
        </>
    )
}

export default MovieListPage;

const Container = styled.div`
  display: grid;
  padding-top: 50px;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: center;
  gap: 10px;
`;

const PointText = styled.span`
  color: #46a6a6;
  text-shadow: 2px 2px 2px gray;
`;
