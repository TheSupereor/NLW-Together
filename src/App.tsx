import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {NewRoom} from "./pages/NewRoom";
import {Home} from "./pages/Home";
import { Room } from './pages/Room';

import { AuthContextProvider } from './contexts/AuthContext'

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/:id" exact component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
