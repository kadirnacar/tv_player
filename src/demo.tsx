import * as React from 'react';
import axios from "axios"

export default class Demo extends React.Component<any, any>{
    handleClick() {
        console.log("ok");
        fetch('demo://me', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Jimmy'
            })
        })
    


    }
    render() {
        return <div>
            <button onClick={this.handleClick.bind(this)}>tıkla</button>
        </div>
    }
}