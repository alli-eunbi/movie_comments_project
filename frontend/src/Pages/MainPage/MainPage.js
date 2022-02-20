import { useEffect, useRef } from "react";
import styled from 'styled-components';
import Fade from 'react-reveal/Fade' // https://www.react-reveal.com/ 
import NavBar from "../../Components/NavBar/NavBar";
import MovieListPage from "./MovieListPAge";

function MainPage() {
  const DIVIDER_HEIGHT = 5;
  const outerDivRef = useRef();

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();

      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = window.innerHeight;

      // 스크롤 DOWN
      if (deltaY > 0) {
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("1page, down");
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("2page, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 3) {
          console.log("3page, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 3 + DIVIDER_HEIGHT * 3,
            left: 0,
            behavior: "smooth",
          });
        } else {
          console.log("4page, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 3 + DIVIDER_HEIGHT * 3,
            left: 0,
            behavior: "smooth",
          });
        }
        // 스크롤 UP
      } else {
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("1page, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("2page, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 3) {
          console.log("3page, up");
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
        } else {
          console.log("4page, up");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    
    <Outer ref={outerDivRef}>
      <NavBar/>
        <Inner>
          <Box>
            <Fade bottom> 
              <span>
                <br/>
                당신의 추억 속 영화를 <PointText>평가</PointText>해 주세요.
              </span>
              <Sample/>
            </Fade> 
          </Box>
        </Inner>
        <Divder/>
        <Inner>
          <Box>
            <Fade bottom> 
              <span>
                <br/>
                나의 평가와 다른 이용자의 <PointText>평가</PointText>를 비교해 보세요.
              </span>
              <Sample/>
            </Fade> 
          </Box>
        </Inner>
        <Divder/>
        <Inner>
          <Box>
            <Fade bottom> 
                <span>
                  <br/>
                  누구의 평가가 많은 이용자의 공감을 얻는지 <br/>
                  <PointText>온도</PointText>를 통해 확인해 보세요.
                </span>
                <Sample/>
            </Fade> 
          </Box>
        </Inner>
        <Divder/>
        <Inner>          
          <Box>
            <Fade bottom> 
              <MovieListPage/>
            </Fade> 
          </Box>
        </Inner>
    </Outer>
  );
}

export default MainPage;

const Outer = styled.div`
    height: 100vh;
    overflow-y: hidden;
    & ::-webkit-scrollbar {
        display: none;
    }}
`;

const Inner = styled.div`
  height: 100vh;
  display: flex;
  background-color: #1c2126;
  justify-content: center;
  align-items: center;
  font-size: 100px;
  font-family: "Noto Sans KR", sans-serif;
`;

const Box = styled.div`
    width: 90%;
    height: 80%;
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

const Divder = styled.div`
  width: 100%;
  height: 5px;
  background-color: #1c2126;
`;

const PointText = styled.span`
  color: #46a6a6;
  text-shadow: 2px 2px 2px gray;
`;

const Sample = styled.div`
  width: 500px;
  height: 500px;
  display: inline-block;
  border-radius: 20px;
  background-color: #3a3e45;
`;
