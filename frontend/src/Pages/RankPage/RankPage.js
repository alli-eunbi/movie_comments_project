import React, { useState, useEffect } from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import NavBar from '../../Components/NavBar/NavBar';


export default function RankPage() {

  const [searchTerm, setSearchTerm] = useState("")
  const [reviewData, setReviewData] = useState([])
  const [tempData, setTempData] = useState([])


  useEffect(() => {
    const fetchData = async() => {
        const result = await axios.get(`http://localhost:5000/user-ranking`);
        console.log(result)
        setReviewData(result.data.reviewNum_rank)
        setTempData(result.data.temperature_rank)
        console.log(reviewData, tempData) 
    }
    fetchData();
  },[])

  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }

  console.log(reviewData)
  console.log(tempData)

  return (
      <>
        <NavBar
            refreshFunction={updateSearchTerm}
        />
          <Inner>
            <Box>
              <h4>영광의 TOP 10</h4>
              <Container>
                <div>
                  <div>리뷰가 많은 이용자수 TOP5</div>
                  <List
                    itemLayout="horizontal"
                    dataSource={reviewData}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                          title={item.name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
                <div>
                  <div>온도가 높은 이용자수 TOP5</div>
                  <List
                    itemLayout="horizontal"
                    dataSource={tempData}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                          title={item.name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Container>
              <div>
                이용자님의 순위는 몇위 입니다.
              </div>
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
padding-bottom: 25px;
grid-template-columns: repeat(2, 1fr);
gap: 10px;
font-size: 25px;
`;
