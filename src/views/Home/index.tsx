import * as React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Col, Container, Nav, Navbar, NavItem, Row } from 'reactstrap';
import CNavbar from '../../containers/App/navbar';
import * as ChannelState from '../../reducers/channels';
import * as EditorState from '../../reducers/editor';
import { ApplicationState } from '../../store';
import ChannelList from './ChannelList';
import videojs from 'video.js';

class Home extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.videoNode = React.createRef();
        this.state = {
            search: "",
            hasError: false,
            isrefresh: false,
            index: -1
        };
    }

    videoNode: React.RefObject<HTMLVideoElement>;
    player: videojs.Player;

    setActive(index: number) {
        const item = this.props.Data[index];
        if (item.eval == true) {
            item.url = eval(item.evalurl);
        }
        this.player.src(item.url);
        this.setState({ index });
    }

    componentDidMount() {
        this.props.getChannels();
        this.player = videojs(this.videoNode.current,
            {
                fluid: true,
                autoplay: true,
            },
            () => {
                this.player.on("error", (err) => {
                    var error = this.player.error();
                    if (error.code == 4) {
                        this.refreshAnUrl(this.state.index);
                    }
                });
            });
        window.addEventListener('keydown', (e) => {

            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if (!this.props.Data)
                return;
            var key = e.which;
            const index = this.state.index;

            console.log(key, index)
            switch (key) {
                case 38:
                    this.setActive((index <= 0 ? this.props.Data.length : index) - 1);
                    break;
                case 40:
                    this.setActive((index >= this.props.Data.length - 1 ? -1 : index) + 1);
                    break;
            }
        }, false);
    }

    refreshUrl() {
        this.setState({ isrefresh: true })
        this.props.readJson().then(() => {
            this.props.getChannels();
            toastr.success("Url Refresh", "Success");
            this.setState({ isrefresh: false })
        });
    }

    refreshAnUrl(index) {
        this.setState({ isrefresh: true })
        return new Promise((resolve, reject) => {
            this.props.readUrlJson(this.props.Data[index].name).then(() => {
                this.props.getChannels();
                this.setState({ isrefresh: false })
                resolve();
            });
        });

    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    render() {
        return <Container fluid tabIndex={0} style={{ outline: "0 !important" }}>
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
                    <ChannelList index={this.state.index} onRefreshUrl={this.refreshAnUrl.bind(this)} data={this.props.Data} onChange={this.setActive.bind(this)} />
                </Col>
                <Col xs="9">
                    <div>
                        <div data-vjs-player>
                            <video
                                ref={this.videoNode}
                                className="video-js"
                                controls></video>
                        </div>
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
)(Home);