import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Editor from '../../views/Editor';
import ReduxToastr from 'react-redux-toastr';
import Home from '../../views/Home';

class App extends React.Component<any, any>{

    render() {
        return <div>
            <ReduxToastr/><BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/editor" component={Editor} />
                </Switch>
            </BrowserRouter>
        </div>;
    }
}

export default App;