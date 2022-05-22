
import './App.css';
import Login from './components/Login';
import { Route, Routes, useLocation } from 'react-router-dom';
import TypingFieldMultiplayer from './components/TypingFieldMultiplayer';
import TypingFieldSinglePlayer from './components/TypingFieldSinglePlayer';
import Wrapper from './components/Wrapper';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AuthContextProvider from './components/AuthContext/AuthContextProvider';

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
              <Route path='/Login' element={<Login />} />
              <Route path='/type-multiplayer' element={<TypingFieldMultiplayer />} />
              <Route path='' element={<TypingFieldSinglePlayer />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Wrapper>
    </AuthContextProvider>

  );
}

export default App;
