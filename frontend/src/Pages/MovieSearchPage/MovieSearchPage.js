import React from 'react';
import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';

function MovieSearchPage() {
  return (
    <>
        <NavBar/>
        <Inner>
            <Box>
                MovieSearchPage
            </Box>
        </Inner>
    </>
    );
}

export default MovieSearchPage;

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
    height: 75%;
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