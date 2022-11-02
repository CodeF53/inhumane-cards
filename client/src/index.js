import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { App } from './components/App';

import './styles/index.scss';
import './styles/cards.scss';
import './styles/game.scss';
import './styles/header.scss';
import './styles/form.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);