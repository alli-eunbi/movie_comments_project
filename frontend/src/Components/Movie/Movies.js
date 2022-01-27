import movie from './Movie.json'
import styled from 'styled-components';

function shuffle(array) {
    array.sort(() => Math.random() - 0.2);
}
 

export default function Movies (){
    return (
        <Container className="movie_list">
            {movie.data.map((movie, index) => {
                console.log(index)
                return <Box key={index}>
                    {movie.poster_url ? <MovieImg src ={movie.poster_url} alt={movie.title}>
                        </MovieImg>
                    : <h5>{movie.title}</h5>}
                </Box>
            })}
        </Container>
        
    )
    
}

const MovieImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 12px;

    background-size: cover;
`
const Container = styled.div`
    display: grid;
    padding-top: 50px;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    gap: 10px;
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

