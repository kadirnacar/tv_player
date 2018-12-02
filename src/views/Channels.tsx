import * as React from 'react';
import ReactHLS from 'react-hls';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Row, Navbar, Nav, Button, NavItem, Input } from 'reactstrap';
import CNavbar from '../containers/App/navbar';
import ChannelList from './ChannelList';
import * as ChannelState from '../reducers/channels';
import * as EditorState from '../reducers/editor';
import { ApplicationState } from '../store';
import { toastr } from 'react-redux-toastr';

class Channels extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: "",
            search: "",
            isrefresh: false
        };
    }
    setActive(item) {
        if (item.eval == true) {
            item.url = eval(item.evalurl);
        }
        this.setState({ active: item });
    }
    componentDidMount() {
        this.props.getChannels();
    }
    refreshUrl() {
        this.setState({ isrefresh: true })
        this.props.readJson().then(() => {
            this.props.getChannels();
            toastr.success("Url Refresh", "Success");
            this.setState({ isrefresh: false })
            // this.editor.editor.getAction('editor.action.formatDocument').run();
        });
    }
    playerError(err) {
        console.log(err);
        toastr.error("Player error", err);
    }
    render() {
        return <Container fluid tabIndex={0}>
            <CNavbar />
            <div className="clearfix dd" style={{ padding: '.5rem' }}></div>

            <Row>
                <Col xs="3">
                    <Navbar color="light" light expand="md">
                        <Nav navbar>
                            <NavItem>
                                <Button color={this.state.isrefresh ? "danger" : "warning"} size="sm"
                                    onClick={() => { this.refreshUrl(); }}>
                                    <i className="fa fa-refresh" /> Url Yenile</Button>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <ChannelList data={this.props.Data} onChange={this.setActive.bind(this)} />
                </Col>
                <Col xs="9">
                    <div>

                        {this.state.active ? this.state.active.type == 0 ? <ReactHLS url={this.state.active.url} autoplay={true} constrols={true} width="100%" height="100%" />
                            : <ReactPlayer onError={this.playerError.bind(this)}
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
    { ...ChannelState.actionCreators, ...EditorState.actionCreators }
)(Channels);