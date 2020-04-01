import * as React from "react";
import videojs from 'video.js';
import { ApplicationState } from "@store";
import { connect } from "react-redux";
import { ChannelActions } from "@reducers";
import { bindActionCreators } from "redux";

type Props = ApplicationState & { ChannelActions: typeof ChannelActions }
class Home extends React.Component<Props, any> {
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
        this.player.on("error", async (err) => {
          var error = this.player.error();
          console.log(error, err);
          if (error.code == 4) {
            this.player.reset();
            // this.setState({ current: null })
            await this.props.ChannelActions.refreshUrl(this.props.Channel.CurrentItem.name);
            if (this.state.current) {
              const current = this.props.Channel.List.find(i => i.name == this.state.current.name);
              if (current) {
                await this.props.ChannelActions.setCurrent(current);
              }
            }
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
      if (!this.state.current)
        this.player.src(item.url + "lmlm");
      else
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
            className="video-js vjs-16-9 vjs-big-play-centered"
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
