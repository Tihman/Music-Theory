import { Routes, Route } from 'react-router-dom';
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from 'react-redux';
import { Header, Header2 } from "./components";
import { Home, FullPost, Registration, AddPost, Login, CutAudio, Piano, /*Cut*/ Bpm, Effects, Spectrogram, Something} from "./pages";
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      {/* <Header /> */}
      <Header2 />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          {/* <Route path="/cut" element={<Cut />} /> */}
          {/* <Route path="/cut-example" element={<CutExample />} /> */}
          <Route path="/cut-audio" element={<CutAudio />} />
          <Route path="/bpm" element={<Bpm />} />
          <Route path="/effects" element={<Effects />} />
          <Route path="/spectrogram" element={<Spectrogram />} />
          <Route path="/piano" element={<Piano />} />
          <Route path="/something" element={<Something />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
