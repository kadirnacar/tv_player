import * as React from 'react';
import { Button, Input, ListGroup, ListGroupItem } from 'reactstrap';

class ChannelList extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = { search: "", index: -1 };
    }

    componentDidMount() {
    }
    setActive(index: number) {
        const item = this.props.data[index];
        if (item.eval == true) {
            item.url = eval(item.evalurl);
        }
        this.setState({ active: item, index });
        if (this.props.onChange)
            this.props.onChange.call(this, index);
    }
    render() {
        return <ListGroup>
            <ListGroupItem>
                <Input type="text" value={this.state.search}
                    onChange={(e) => { this.setState({ search: e.target.value }); }} /></ListGroupItem>
            {
                this.props.data ? this.props.data
                    .filter((item) => { return this.state.search ? item.name.toLowerCase().includes(this.state.search.toLowerCase()) : true })
                    .map((item, index) => <ListGroupItem color="info" key={index} active={this.props.index == index}
                        onClick={() => { this.setActive(index); }} tag="h5" action>{item.name}
                        {item.type == 3 ?
                            <Button size="sm" title="Refresh" className="float-right" onClick={(e) => {
                                e.stopPropagation();
                                if (this.props.onRefreshUrl) {
                                    this.props.onRefreshUrl.call(this, index);
                                }
                            }} > <i className="fa fa-refresh" /></Button>
                            : null}
                    </ListGroupItem>) : null
            }
        </ListGroup>
    }
}

// export default Channels;
export default ChannelList;