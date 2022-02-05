import React, { useEffect } from 'react';
import { Link  } from 'react-router-dom';
import axios from 'axios';

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
import { loginState, logoutState } from "../../Pages/Recoil/Atoms";
import { useRecoilState } from "recoil";



const settings = ['마이페이지'];

const NavBar = () => {

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [logoutValue, setLogoutValue] = useRecoilState(logoutState);
    const [loginValue, setLoginValue] = useRecoilState(loginState);


    const logOutHandler = () => {
        axios.get('/user/logout')
        .then(response => {
            let success = Object.values(response);
            let result = Object.values(success[0]);
            if (result[0] === true) {
                setLogoutValue(result[0]);
                setLoginValue(!result[0]);
                return (
                    <div>
                      <Link to= '/login'>
                        <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                            로그인
                        </Button>
                      </Link>
                    </div>
                  )
            } else {
                alert('로그아웃에 실패');
            }
            
        })
    }

    const LogInChecker = (loginValue, logoutValue) => {
      useEffect(() => {
        console.log(loginValue, logoutValue)
        if (loginValue === true && logoutValue === false) {
            return(
                <div>
                    <Button onClick={logOutHandler}>
                        로그아웃
                    </Button>
                </div>
              )
        } else if (logoutValue === true && loginValue === false) {
            return (
                <div>
                  <Link to= '/login'>
                    <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                        로그인
                    </Button>
                  </Link>
                </div>
              )
        } else {
          return(
            <div>
              <Link to= '/login'>
                <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                    로그인
                </Button>
              </Link>
            </div>
          )
        }
      })
    }
    

    return (
        <AppBar position="fixed">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Link to= '/'>
                    <Button sx={{ my: 2, color: 'white', display: 'block', fontSize: 20}}>
                        홈
                    </Button>
                </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Link to= '/rank'>
                    <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                        랭크
                    </Button>
                </Link>
                <Button sx={{ my: 2, color: 'white', display: 'block'}} onClick={LogInChecker}>
                    로그인
                </Button>
                <Link to= '/register'>
                    <Button sx={{ my: 2, color: 'white', display: 'block'}}>
                        회원가입
                    </Button>
                </Link>
            </Box>

            <Box sx={{ flexGrow: 100, display: { xs: 'none', md: 'flex' } }}>
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="영화검색"
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                </Tooltip>
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
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