import React, { useState } from 'react';
import styled from 'styled-components';
import Favorite from '../Favorite/Favorite';
import Star from '../Star/Star';

function MovieDetail(props) {
  
  let { movie } = props ;

  return (
    <>
      <MovieImg src={movie.poster_url}/>
      <Box>
        <Title>{movie.title}({movie.publish_year})</Title>
        <Text>{movie.genre}</Text>
        <SubTitle>줄거리</SubTitle>
        <Text>{movie.plot}</Text>
        <Favorite/>
        <Star/>
        
      </Box>
    </>
  )
}

export default MovieDetail;

const MovieImg = styled.img`
  width: 100%;
  height: 70vh;
  border-radius: 12px;
  background-size: cover;
`

const Box = styled.div`
  width: auto;
  height: 70vh;
  border-radius: 12px;
  background-color: #EEEEEE;
  text-align: center;
  font-size: 50px;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 0px;
`;

const Title = styled.div`
  font-size: 4vh;
  margin: 2vh;
`

const Text = styled.div`
  font-size: 2vh;
  margin: 2vh;
`
const SubTitle = styled.div`
  width: 15vh;
  font-size: 3vh;
  text-align: center;
  border-radius: 12px;
  margin: 2vh;
  background-color: #46A6A6;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.8) 0px 5px 15px;
`