import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { loginState } from "../../Pages/Recoil/Atoms";
import { useRecoilState } from "recoil";
import useSessionStorage from "../../Pages/Recoil/useSessionStorage";


const settings = ['마이페이지'];

const NavBar = (props) => {

    const [SearchTerms, setSearchTerms] = useState("")
    const [MovieKeyword, setMovieKeyword] = useState("")

    const [on, setOn] = useSessionStorage("on", false);
    
    const searchHandler = (event) => {
        setSearchTerms(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value)
    }
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const enterKey = () => {

        if (window.event.keyCode == 13) {
            navigate(`/movies/search?keyword=${SearchTerms}`);
        }
    }


    // const [logoutValue, setLogoutValue] = useRecoilState(logoutState);
    const [loginValue, setLoginValue] = useRecoilState(loginState);

    // const userLogged = useRecoilValue(logSelector);
    const userLogged = (on) => {
        if (on === true) {
            return `로그아웃`
        } else if (on === false) {
            return `로그인`
        } else {
            return `로그인`
        }
    }

    const LogInChecker = () => {
        console.log(loginValue)
        if(loginValue === true) {              // login 상태
            axios.get('http://localhost:5000/user/logout', {withCredentials: true})
            .then(response => {
                
                let result = response.data.success;

                if (result === true) {
                    setLoginValue(!result);
                    setOn(false);
                    navigate('/');
                    alert('로그아웃 되었습니다.');
                } else {
                    alert('로그아웃에 실패');
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        } else if(loginValue === false) {       // logout 상태
            navigate('/login');
        } else {
            navigate('/login');
        }
    }
    

    return (
        <AppBar position="fixed">
        <Container maxWidth="xl">
            <Toolbar disableGutters>

                <Box sx={{ flexGrow: 200 }}>
                    <Link to= '/'>
                        <Button sx={{ my: 2, color: 'white', display: { xs: 'none', md: 'flex' }, fontSize: 20}}>
                            홈
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ flexGrow: 5, display: { xs: 'none', md: 'flex' } }}>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            value={SearchTerms}
                            onChange={searchHandler}
                            onKeyUp={enterKey}
                            placeholder="영화검색"
                        />
                    </Search>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Link to= '/rank'>
                        <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                            랭크
                        </Button>
                    </Link>
                    <Button sx={{ my: 2, color: 'white', display: 'block'}} onClick={LogInChecker}>
                        {userLogged(on)}
                    </Button>
                    <Link to= '/register'>
                        <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                            회원가입
                        </Button>
                    </Link>
                </Box>

            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                    <Link to="/info">
                        <IconButton sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                >
                {settings.map((setting) => (
                    <MenuItem key={setting}>
                    <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
            
            </Toolbar>
        </Container>
        </AppBar>
    );
};

export default NavBar;

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
