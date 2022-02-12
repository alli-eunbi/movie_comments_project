import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';

export default function MovieGradePages() {
    return (
        <>
            <NavBar/>
            <Inner>
                <Box>
                    MovieGradePage
                    <Title>
                      다른 사람이 준 평점 보기
                    </Title>
                        <MovieList/>
                    <Title>
                      관람객 평점과 내 평점 비교하기
                    </Title>
                        <MovieList/>
                    <Title>
                      평론가 평점과 내 평점 비교하기
                    </Title>
                        <MovieList/>
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
    width: 50vh;
    height: 7vh;
    padding-top: 5px;
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