import { Theme } from "@material-ui/core";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { ApplicationState } from "@store";
import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import AppMenu from "./menu";
import { ChannelActions } from "@reducers";
import { bindActionCreators } from "redux";

interface SidebarProps {
  isOpen: boolean;
  theme: Theme;
  width: number;
  onOpenMenu: (event: any) => void;
  onCloseMenu: (event: any) => void;
  ChannelActions: typeof ChannelActions;
}

type Props = RouteComponentProps & SidebarProps & ApplicationState;

export class SidebarComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.state = {
      menu: [],
      currentIndex: null
    }
  }

  layoutMenuScroller: any;

  onSidebarClick(event) {

  }
  async componentDidMount() {
    await this.props.ChannelActions.getList();
    let menu = this.props.Channel.List.map((channel, index) => {
      return {
        label: channel.name,
        icon: "fa fa-home",
        data: channel,
        command: (event, item) => {
          this.setState({ currentIndex: index });
          this.props.ChannelActions.setCurrent(channel);
        }
      }
    });
    window.addEventListener('keydown', (e) => {

      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
      // if (!this.props.Data)
      //     return;
      var key = e.which;
      const index = this.state.currentIndex;
      let ind;
      console.log(key, index)
      switch (key) {
        case 37:
          ind = (index <= 0 ? this.props.Channel.List.length : index) - 1;
          this.setState({ currentIndex: ind });
          this.props.ChannelActions.setCurrent(this.props.Channel.List[ind]);
          // this.setActive((index <= 0 ? this.props.Data.length : index) - 1);
          break;
        case 39:
          ind = (index >= this.props.Channel.List.length - 1 ? -1 : index) + 1;
          this.setState({ currentIndex: ind });
          this.props.ChannelActions.setCurrent(this.props.Channel.List[ind]);
          // this.setActive((index >= this.props.Data.length - 1 ? -1 : index) + 1);
          break;
      }
    }, false);
    this.setState({ menu });
  }
  render() {
    return (
      <Drawer
        onMouseLeave={this.props.onCloseMenu}
        onMouseEnter={this.props.onOpenMenu}
        variant="permanent"
        open={this.props.isOpen}
        style={{
          width: this.props.width,
          transition: this.props.theme.transitions.create('width', {
            easing: this.props.theme.transitions.easing.sharp,
            duration: this.props.theme.transitions.duration.leavingScreen,
          })
        }}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(90,90,90,0.7)',
            color: "#fff",
            width: this.props.width,
            transition: this.props.theme.transitions.create('width', {
              easing: this.props.theme.transitions.easing.sharp,
              duration: this.props.theme.transitions.duration.leavingScreen,
            })
          }
        }}
      >
        <Avatar variant="square" style={{ width: "100%", height: 48 }}
          imgProps={{
            style: { height: 40, objectFit: "contain" }
          }} />
        <Divider />

        <Scrollbars>
          <List>
            <div>
              <AppMenu model={this.state.menu} parentIndex={0} />
            </div>
          </List>
        </Scrollbars>
      </Drawer>
    );
  }
}

// export default Sidebar;
export const Sidebar = withRouter(
  connect(
    (state: ApplicationState) => state,
    dispatch => {
      return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
    }
  )(SidebarComponent)
) as any;
