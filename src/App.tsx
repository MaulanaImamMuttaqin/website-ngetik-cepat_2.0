
import './App.css';
import Login from './components/Login';
import { Route, Routes, useLocation } from 'react-router-dom';
import TypingFieldMultiplayer from './components/TypingFieldMultiplayer';
import TypingFieldSinglePlayer from './components/TypingFieldSinglePlayer';
import Wrapper from './components/Wrapper';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AuthContextProvider from './components/AuthContext/AuthContextProvider';
import Register from './components/Register';
import TypingFieldNormal from './components/TypingFieldNormal';
import Settings from './components/Settings';
import User from './components/User';

// const routes = {
//   {path:'/Login', element}
// }

function App() {

  const location = useLocation()
  return (
    <AuthContextProvider>
      <Wrapper>
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} timeout={300} classNames='router'>
            <Routes location={location}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/type-multiplayer' element={<TypingFieldMultiplayer />} />
              <Route path='/type-practice' element={<TypingFieldSinglePlayer />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/user' element={<User />} />
              <Route path='' element={<TypingFieldNormal />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Wrapper>
    </AuthContextProvider>

  );
}

export default App;
