import React from 'react';
import styled from "styled-components";


const Grid = ({ header, children }) => {
  return (
    <>
      <Wrapper>
      </Wrapper>
    </>
  );
};

export default Grid;


export const Wrapper = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  background-color: black;
  grid-template-columns: 250px 250px 250px 250px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 2rem;
  h1 {
    color: var(--medGrey);
    @media screen and (max-width: 768px) {
      font-size: var(--fontBig);
    }
  }
`;

export const Content = styled.div`

`;