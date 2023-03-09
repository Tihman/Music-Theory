import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AlbumIcon from '@mui/icons-material/Album';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PianoIcon from '@mui/icons-material/Piano';
import Button from "@mui/material/Button";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export const Header2 = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  const [open, setState] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
            <div>
              <IconButton 
                edge="start" 
                color="inherit" 
                aria-label="open drawer" 
                onClick={toggleDrawer(true)}
                sx={{ 
                  mr: 2,
                }}
              > 
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
              >
                <Box sx={{
                  p: 4,
                  height: 1,
                  backgroundColor: "#dbc8ff",
                }}>

                  <IconButton sx={{mb: 2}}>
                    <CloseIcon onClick={toggleDrawer(false)} sx={{ml: 0.5, mb: 0.5}} />
                  </IconButton>

                  <Divider sx={{mb: 2}} />

                  <Box sx={{mb: 2}}>
                    <Link to="/cut-audio">
                      <ListItemButton>    
                        <ListItemIcon>
                          <ContentCutIcon sx={{ mr:2}} fontSize="small" /> 
                        </ListItemIcon>
                        <ListItemText primary="Инструмент для обрезки аудиозаписи" /> 
                      </ListItemButton>
                    </Link>

                    <Link to="/bpm">
                    <ListItemButton>
                      <ListItemIcon>
                        <AlbumIcon sx={{ mr:2}} fontSize="small" />
                      </ListItemIcon >
                      <ListItemText primary="Инструмент для определения BPM (Темпа)" />
                    </ListItemButton>
                    </Link>

                    <Link to="/effects">
                    <ListItemButton>
                      <ListItemIcon>
                        <BlurOnIcon sx={{ mr:2}} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Инструмент для добавления эффектов" />
                    </ListItemButton>
                    </Link>

                    <Link to="/spectrogram">
                    <ListItemButton>
                      <ListItemIcon>
                        <StackedBarChartIcon sx={{ mr:2}} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Инструмент для получения спектрограммы" />
                    </ListItemButton>
                    </Link>

                    <Link to="/piano">
                    <ListItemButton>
                      <ListItemIcon>
                        <PianoIcon sx={{ mr:2}} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Пианино" />
                    </ListItemButton>
                    </Link>
                  </Box>
                </Box>
            </Drawer>
            </div>
          <Link className={styles.logo} to="/">
            <div>Сайт для исследования и обработки звуковой информации</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button >Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} >
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
