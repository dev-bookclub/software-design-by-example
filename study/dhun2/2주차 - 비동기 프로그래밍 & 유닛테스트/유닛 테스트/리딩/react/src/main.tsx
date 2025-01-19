import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Baisc from './basic/Basic.tsx';
import GameContainer from './container-presentation/component/container/GameContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Baisc />
    <GameContainer />
  </StrictMode>
);
