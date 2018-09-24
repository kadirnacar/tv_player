import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Channels from '../../views/Channels';
import Editor from '../../views/Editor';

class App extends React.Component<any, any>{

    render() {
        return <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Channels} />
                <Route exact path="/editor" component={Editor} />
            </Switch>
        </BrowserRouter>;
    }
}

export default App;