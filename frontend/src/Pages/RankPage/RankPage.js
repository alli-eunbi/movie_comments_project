import React, { useState, useEffect } from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';

import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';


export default function RankPage() {

  const [SearchTerm, setSearchTerm] = useState("")
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const fetchData = async() => {
        const result = await axios.get(`http://localhost:5000/user-ranking`);
        setUserData(result.data.reviewNum_rank)
        console.log(userData) 
    }
    fetchData();
  },[])

  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }

  // const data = () => {

  //   axios.get("http://localhost:5000/user-ranking")
  //   .then((response)=> {
  //     console.log(response)
  //     console.log(response.data.reviewNum_rank)

  //     const userData = response.data.reviewNum_rank;

  //       if (response.data.success === true) {
  //         return userData;
  //       }
  //     }
  //   )
  //   .catch((error)=> {
  //       console.log(error)
  //   })

  // }

  console.log(userData)

  return (
      <>
        <NavBar
            refreshFunction={updateSearchTerm}
        />
          <Inner>
            <Box>
              <h4>영광의 TOP 10</h4>
              <Container>
                <List
                  itemLayout="horizontal"
                  dataSource={userData}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={item.name}
                      />
                    </List.Item>
                  )}
                />
              </Container>
            </Box>
          </Inner>
      </>
  )
};


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

const Container = styled.div`
display: grid;
padding-top: 50px;
grid-template-columns: repeat(2, 1fr);
gap: 10px;
`;