import * as React from 'react';
import ReactHLS from 'react-hls';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Col, Container, Nav, Navbar, NavItem, Row } from 'reactstrap';
import CNavbar from '../containers/App/navbar';
import * as ChannelState from '../reducers/channels';
import * as EditorState from '../reducers/editor';
import { ApplicationState } from '../store';
import ChannelList from './ChannelList';

class Channels extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: "",
            search: "",
            isrefresh: false,
            index: -1
        };
    }
    setActive(item, index) {
        this.setState({ active: {} }, () => {
            if (item.eval == true) {
                item.url = eval(item.evalurl);
            }
            if (this.hls && this.hls.player && this.hls.player.player && this.hls.player.player.hls) {
                this.hls.player.player.hls.destroy();
            }
            this.setState({ active: item, index });
        });

    }
    componentDidMount() {
        this.props.getChannels();
    }
    refreshUrl() {
        this.setState({ isrefresh: true })
        this.props.readJson().then(() => {
            if (this.hls && this.hls.player && this.hls.player.player && this.hls.player.player.hls) {
                this.hls.player.player.hls.destroy();
                console.log("hls");
            }
            this.props.getChannels();
            toastr.success("Url Refresh", "Success");
            this.setState({ isrefresh: false })
            // this.editor.editor.getAction('editor.action.formatDocument').run();
        });
    }
    refreshAnUrl(name) {
        this.setState({ isrefresh: true })
        return new Promise((resolve, reject) => {
            this.props.readUrlJson(name).then(() => {
                if (this.hls && this.hls.player && this.hls.player.player && this.hls.player.player.hls) {
                    this.hls.player.player.hls.destroy();
                }
                this.props.getChannels();
                toastr.success("Url Refresh", "Success");
                this.setState({ isrefresh: false })
                resolve();
                // this.editor.editor.getAction('editor.action.formatDocument').run();
            });
        });

    }
    playerError(err, a) {
        console.log(a, err, this);
        // this.setActive({}, this.state.index)
        if (a.type == "networkError") {
            toastr.error("Player error", err);
            this.refreshAnUrl(this.state.active.name).then(() => {
                // this.setActive(this.props.Data[this.state.index], this.state.index);
            });
        }
    }
    hls: any;
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
                    <ChannelList onRefreshUrl={this.refreshAnUrl.bind(this)} data={this.props.Data} onChange={this.setActive.bind(this)} />
                </Col>
                <Col xs="9">
                    <div>

                        {this.state.active ? this.state.active.type == 0 ?
                            <ReactHLS
                                url={this.state.active.url}
                                autoplay={true}
                                constrols={true} width="100%" height="100%" />
                            : <ReactPlayer onError={this.playerError.bind(this)}
                                ref={(a) => { this.hls = a }}
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