import * as React from 'react';
import axios from "axios"

export default class Demo extends React.Component<any, any>{
    handleClick() {
        fetch('electron://command/api/channels/list', {
            method: 'GET',
            // body: JSON.stringify({
            //     name: 'Jimmyıçşğ'
            // })
        })
    


    }
    render() {
        return <div>
            <button onClick={this.handleClick.bind(this)}>tıkhhhla</button>
        </div>
    }
}