import { Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToApp from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/icons/Menu';
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface TopbarProps extends ApplicationState {
  onOpenMenu: (event: any) => void;
  onCloseMenu: (event: any) => void;
  theme: Theme;
  left: number;
}

type Props = TopbarProps & RouteComponentProps;

class TopbarComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <AppBar position="fixed" color="transparent" style={
        {
          marginLeft: this.props.left,
          width: `calc(100% - ${this.props.left}px)`,
          transition: this.props.theme.transitions.create(['width', 'margin'], {
            easing: this.props.theme.transitions.easing.sharp,
            duration: this.props.theme.transitions.duration.enteringScreen,
          })
        }
      }>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onMouseEnter={this.props.onOpenMenu}>
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>TV</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export const Topbar = withRouter(
  connect(
    (state: ApplicationState) => state,
    null
    // dispatch => {
    //   return { AuthActions: bindActionCreators({ ...AuthActions }, dispatch) };
    // }
  )(TopbarComponent)
) as any;
