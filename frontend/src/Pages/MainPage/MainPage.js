import { useEffect, useRef } from "react";
import styled from 'styled-components';
import ScrollButton from "../../Components/ScrollBtn/ScrollBtn";

function MainPage() {
  
  const DIVIDER_HEIGHT = 5;
  const outerDivRef = useRef();


  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current; 
      const pageHeight = window.innerHeight; 

      if (deltaY > 0) {
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("현재 1페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("현재 2페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
        } else {
          console.log("현재 3페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
        }
      } else {
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("현재 1페이지, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("현재 2페이지, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else {
          console.log("현재 3페이지, up");
          outerDivRef.current.scrollTo({
            top: pageHeight,
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
        <ScrollButton/>
        <Inner>1</Inner>
        <Divder></Divder>
        <Inner>2</Inner>
        <Divder></Divder>
        <Inner>3</Inner>
        <Divder></Divder>
    </Outer>
  );
}


export default MainPage;


const Outer = styled.div`
    height: 100vh;
    overflow-y: auto;
    & ::-webkit-scrollbar {
        display: none;
    }}
`;

const Inner = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-item: center;
    font-size: 100px;
`;

const Divder = styled.div`
    width: 100%;
    height: 5px;
    background-color: gray;
`;
