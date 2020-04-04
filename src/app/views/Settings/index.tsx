import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { ChannelActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { TextField, RadioField, CheckField } from '@components';
import { IChannel } from '@models';

type Props = ApplicationState & { ChannelActions: typeof ChannelActions } & RouteComponentProps
class Settings extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Kanal Düzenleme"
            action={
              <React.Fragment>
                <Button
                  variant="contained"
                  onClick={async () => {
                    this.props.history.goBack();
                  }}>İptal</Button>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={async () => {
                    await this.props.ChannelActions.save(this.props.Channel.List)
                  }}>Kaydet</Button>
              </React.Fragment>
            } />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <MaterialTable
                style={{ width: "100%" }}
                options={{ search: false, showTitle: false, paging: false }}
                editable={{
                  onRowDelete: oldData => new Promise(resolve => {
                    this.props.Channel.List.splice(oldData["tableData"].id, 1);
                    this.setState({})
                    resolve();
                  }),
                }}
                columns={[
                  { title: "Adı", field: "name" }
                ]}
                data={this.props.Channel.List}
                actions={[
                  {
                    icon: 'add',
                    tooltip: 'Ekle',
                    isFreeAction: true,
                    onClick: (event) => {
                      this.props.Channel.List.push({
                        name: "",
                        type: 0,
                        category: "",
                        url: "",
                        pageUrl: "",
                        urlRegex: ""
                      });
                      this.setState({})
                    }
                  }, {
                    icon: 'file_copy',
                    tooltip: 'Kopyala',
                    isFreeAction: false,
                    onClick: (event, row: any) => {
                      const newRow: IChannel = { ...row };
                      newRow.name = newRow.name + " - clone";
                      this.props.Channel.List.push(newRow);
                      this.setState({})
                    }
                  }]}

                detailPanel={[{
                  render: rowData => {
                    return (
                      <Grid container style={{ padding: 30, width: "100%", backgroundColor: "#303030", margin: 0 }} spacing={3}>
                        <TextField
                          value={rowData.name}
                          label='İsim'
                          onChange={(event) => {
                            rowData.name = event.target.value;
                            this.setState({});
                          }}
                        />
                        <RadioField
                          value={rowData.type}
                          label="Türü"
                          onChange={(event) => {
                            rowData.type = event.target.value;
                            this.setState({});
                          }}
                          options={[
                            { value: 0, label: "Url" },
                            { value: 3, label: "Regex" }
                          ]} />
                        <TextField
                          value={rowData.url}
                          xs={12}
                          md={12}
                          disabled={rowData.type == 3}
                          label='Url'
                          onChange={(event) => {
                            rowData.url = event.target.value;
                            this.setState({});
                          }}
                        />
                        {
                          rowData.type == 3 ?
                            <React.Fragment>
                              <TextField
                                value={rowData.pageUrl}
                                label='Sayfa Url'
                                onChange={(event) => {
                                  rowData.pageUrl = event.target.value;
                                  this.setState({});
                                }}
                              />
                              <TextField
                                value={rowData.urlRegex}
                                label='Regex'
                                onChange={(event) => {
                                  rowData.urlRegex = event.target.value;
                                  this.setState({});
                                }}
                              />
                              <CheckField
                                checked={rowData.iframe}
                                label='Regex'
                                onChange={(event) => {
                                  rowData.iframe = event.target.checked;
                                  this.setState({});
                                }}
                              />
                            </React.Fragment> : null
                        }
                      </Grid>
                    );
                  }
                }]}
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
// export default Settings;

export const component = withRouter(connect(
  (state: ApplicationState) => state,
  dispatch => {
    return { ChannelActions: bindActionCreators({ ...ChannelActions }, dispatch) };
  }
)(Settings)) as any;
