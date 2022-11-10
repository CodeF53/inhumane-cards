import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionCable from "actioncable";
import { BrowserRouter } from "react-router-dom";
import { App } from './components/App';

import './styles/index.scss';
import './styles/cards.scss';
import './styles/game.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/footer.scss';
import './styles/not_a_robot.scss';

const cableApp={}
cableApp.cable=ActionCable.createConsumer("/cable")

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App cable={cableApp.cable} />
    </BrowserRouter>
  </React.StrictMode>
);