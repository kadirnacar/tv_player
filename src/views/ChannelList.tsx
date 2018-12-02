import * as React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardBody, Collapse, CardHeader, Button, ButtonGroup, ListGroup, ListGroupItem } from 'reactstrap';

class ChannelList extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = { search: "" };
    }

    componentDidMount() {
    }
    setActive(item) {
        if (item.eval == true) {
            item.url = eval(item.evalurl);
        }
        this.setState({ active: item });
        if (this.props.onChange)
            this.props.onChange.call(this, item);
    }
    render() {
        return <ListGroup>
            <ListGroupItem>
                <Input type="text" value={this.state.search}
                    onChange={(e) => { this.setState({ search: e.target.value }); }} /></ListGroupItem>
            {
                this.props.data ? this.props.data
                    .filter((item) => { return this.state.search ? item.name.toLowerCase().includes(this.state.search.toLowerCase()) : true })
                    .map((item, index) => <ListGroupItem color="info" key={index} active={this.state.active && this.state.active.url == item.url}
                        onClick={() => { this.setActive(item); }} tag="h5" action>{item.name}</ListGroupItem>) : null
            }
        </ListGroup>
    }
}

// export default Channels;
export default ChannelList;