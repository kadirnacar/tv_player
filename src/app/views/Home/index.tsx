import * as React from "react";
import videojs from 'video.js';
import { ApplicationState } from "@store";
import { connect } from "react-redux";
import { ChannelActions } from "@reducers";
import { bindActionCreators } from "redux";


class Home extends React.Component<ApplicationState, any> {
  constructor(props) {
    super(props);
    this.videoNode = React.createRef();
    this.state = {
      current: null
    }
  }

  videoNode: React.RefObject<HTMLVideoElement>;
  player: videojs.Player;

  componentDidMount() {
    this.player = videojs(this.videoNode.current,
      {
        fluid: true,
        autoplay: true,
      },
      () => {
        this.player.on("error", (err) => {
          var error = this.player.error();
          if (error.code == 4) {
            // this.refreshAnUrl(this.state.index);
          }
        });
      });
  }

  componentDidUpdate() {
    if (this.props.Channel.CurrentItem && this.props.Channel.CurrentItem != this.state.current) {
      const item = this.props.Channel.CurrentItem;
      if (item.eval == true) {
        item.url = eval(item.evalurl);
      }
      this.player.src(item.url);
      this.setState({ current: item });
    }
  }

  render() {
    return (
      <div style={{ width: "100%", height: 500 }}>
        <div data-vjs-player>
          <video data-setup='{"fluid": true}'
            ref={this.videoNode}
            className="video-js"
            controls></video>
        </div>
      </div>
    );
  }
}
// export default Home;

export const component = connect(
  (state: ApplicationState) => state,
  dispatch => {
    return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
  }
)(Home as any);
