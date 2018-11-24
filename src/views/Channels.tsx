import * as React from 'react';
import ReactHLS from 'react-hls';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import CNavbar from '../containers/App/navbar';
import * as ChannelState from '../reducers/channels';
import * as EditorState from '../reducers/editor';
import { ApplicationState } from '../store';

class Channels extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: ""
        };
    }
    setActive(item) {
        if (item.eval == true) {
            item.url = eval(item.evalurl);
        }
        this.setState({ active: item });
    }
    componentDidMount() {
        console.log(this.props)
        this.props.getChannels();
    }
    refreshUrl() {
        this.props.readJson().then(() => {
            this.props.getChannels();

            // this.editor.editor.getAction('editor.action.formatDocument').run();
        });
    }
    render() {
        return <Container fluid tabIndex={0}>
            <CNavbar />
            <div className="clearfix dd" style={{ padding: '.5rem' }}></div>

            <Row>
                <Col xs="3">
                    <ListGroup>
                        <ListGroupItem
                            onClick={() => { this.refreshUrl();}} tag="button" action>Url Yenile</ListGroupItem>
                        {
                            this.props.Data ? this.props.Data.map((item, index) => <ListGroupItem key={index} active={this.state.active == item.url}
                                onClick={() => { this.setActive(item); }} tag="button" action>{item.name}</ListGroupItem>) : null
                        }
                    </ListGroup>
                </Col>
                <Col xs="9">
                    <div>

                        {this.state.active ? this.state.active.type == 0 ? <ReactHLS url={this.state.active.url} autoplay={true} constrols={true} width="100%" height="100%" />
                            : <ReactPlayer
                                url={this.state.active.url} playing controls width="100%" height="100%" />
                            : null}
                    </div>
                </Col>
            </Row>

        </Container >;
    }
}

// export default Channels;
export default connect(
    (state: ApplicationState) => state.Channels,
    {  ...ChannelState.actionCreators, ...EditorState.actionCreators } 
)(Channels);