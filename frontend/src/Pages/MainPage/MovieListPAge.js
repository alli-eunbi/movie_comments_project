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
        Movie List
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

// const Inner = styled.div`
//   height: 100vh;
//   display: flex;
//   background-color: #1c2126;
//   justify-content: center;
//   align-items: center;
//   font-size: 100px;
//   font-family: "Noto Sans KR", sans-serif;
// `;

// const Box = styled.div`
//     width: 90%;
//     height: 80%;
//     padding-top: 100px;
//     border-radius: 12px;
//     background-color: #EEEEEE;
//     box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
//     text-align: center;
//     font-size: 50px;
//     flex-wrap: wrap;
//     flex-direction: column;
//     padding: 25px;
// `;

