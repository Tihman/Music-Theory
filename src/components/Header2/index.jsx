import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AlbumIcon from '@mui/icons-material/Album';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';

export const Header2 = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
            <div>
              <IconButton
                id="demo-positioned-button"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 20, 
                      mt: 0.5}}
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ mt:1.5}}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem divider={true} onClick={handleClose}>
                  <ContentCutIcon sx={{ mr:2}} fontSize="small" />
                  <Link to="/cut-audio">
                    <div>Инструмент для обрезки аудиозаписи</div>
                  </Link>
                </MenuItem>
                <MenuItem divider={true} onClick={handleClose}>
                  <AlbumIcon sx={{ mr:2}} fontSize="small" />
                  {/* <Link to="/bpm"> */}
                    <div>Инструмент для определения BPM (Темпа)</div>
                  {/* </Link> */}
                  </MenuItem>
                <MenuItem onClick={handleClose}>
                  <BlurOnIcon sx={{ mr:2}} fontSize="small" />
                  {/* <Link to="/effects"> */}
                    <div>Инструмент для добавления эффектов</div>
                  {/* </Link> */}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <StackedBarChartIcon sx={{ mr:2}} fontSize="small" />
                  {/* <Link to="/spectrogram"> */}
                    <div>Инструмент для получения спектрограммы</div>
                  {/* </Link> */}
                </MenuItem>
              </Menu>
            </div>
          <Link className={styles.logo} to="/">
            <div>Сайт для исследования и обработки звуковой информации</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button >Написать статью</Button>
                  {/* variant="contained" */}
                </Link>
                <Button onClick={onClickLogout} >
                  {/* variant="contained" */}
                  {/* color="error" */}
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
