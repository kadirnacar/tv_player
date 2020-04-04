import { ChannelActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import videojs from 'video.js';

type Props = ApplicationState & { ChannelActions: typeof ChannelActions }
class Home extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.videoNode = React.createRef();
    this.state = {
      current: null,
      currentIndex: -1
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
    window.addEventListener('keydown', this.windowKeyPress, false);
  }
  windowKeyPress = (e) => {

    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
    var key = e.which;
    const index = this.state.currentIndex;
    let ind;
    const volume = this.player.volume();
    switch (key) {
      case 38:
        if (volume < 1) {
          this.player.volume(volume + 0.1);
        }
        break;
      case 40:
        if (volume > 0) {
          this.player.volume(volume - 0.1);
        }
        break;
      case 37:
        ind = (index <= 0 ? this.props.Channel.List.length : index) - 1;
        this.setState({ currentIndex: ind });
        this.props.ChannelActions.setCurrent(this.props.Channel.List[ind]);
        break;
      case 39:
        ind = (index >= this.props.Channel.List.length - 1 ? -1 : index) + 1;
        this.setState({ currentIndex: ind });
        this.props.ChannelActions.setCurrent(this.props.Channel.List[ind]);
        break;
    }
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

  componentWillUnmount() {
    if (this.player)
      this.player.dispose();
    window.removeEventListener("keydown", this.windowKeyPress, false);
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
