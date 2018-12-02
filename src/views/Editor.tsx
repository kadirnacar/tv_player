import * as React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Nav, Navbar, NavItem, NavLink, Row } from 'reactstrap';
import CNavbar from '../containers/App/navbar';
import * as EditorState from '../reducers/editor';
import { ApplicationState } from '../store';
import ListItem from './ListItem';

class Editor extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        };
    }
    getData = () => {
        this.props.getJson().then(() => {
            // this.editor.editor.getAction('editor.action.formatDocument').run();
            toastr.success("Data Load", "Success");
        });
    }
    saveData = () => {
        // this.props.saveJson(JSON.parse(this.editor.editor.getValue())).then(() => {
        //     this.editor.editor.getAction('editor.action.formatDocument').run();
        //     toastr.success("Data Saved", "Success");
        // });
        this.props.saveJson(this.props.JsonData).then(() => {
            // this.editor.editor.getAction('editor.action.formatDocument').run();
            toastr.success("Data Saved", "Success");
        });
    }
    componentDidMount() {
        this.getData();
    }
    editorDidMount(monaco) {
        setTimeout(() => {
            this.editor.editor.getAction('editor.action.formatDocument').run();
            this.editor.editor.focus();
        }, 300);
    }

    getUrl() {
        this.props.readJson().then(() => {
            toastr.success("Url Load", "Success");
            // this.editor.editor.getAction('editor.action.formatDocument').run();
        });
    }
    onDeleteItem(item, index) {
        this.props.JsonData.Channels.splice(index, 1);
        this.setState({});
    }
    onCopyItem(item, index) {
        this.props.JsonData.Channels.push(JSON.parse(JSON.stringify(item)));
        this.setState({});
        console.log(item, index);
    }
    editor: any;
    render() {
        const options = {
        };
        return <Container fluid tabIndex={0}>
            <CNavbar />
            <div className="clearfix dd" style={{ padding: '.5rem' }}></div>
            <Row>
                <Col xs="12">
                    <Navbar color="light" light expand="md">
                        <Nav navbar>
                            <NavItem>
                                <Button color="success" size="sm"
                                    onClick={() => { this.getData(); }}>
                                    <i className="fa fa-home" /> Yenile</Button>
                            </NavItem>
                            {/* <NavItem>
                                <Button color="warning" size="sm"
                                    onClick={() => { this.editor.editor.getAction('editor.action.formatDocument').run(); }}>
                                    <i className="fa fa-refresh" /> Format</Button>
                            </NavItem> */}
                            <NavItem>
                                <Button color="warning" size="sm"
                                    onClick={() => { this.props.JsonData.Channels.push({ name: "", category: "", url: "", pageUrl: "", iframe: false, urlRegex: "", type: 0 }); this.setState({}); }}>
                                    <i className="fa fa-plus" /> Yeni Ekle</Button>
                            </NavItem>
                            <NavItem>
                                <Button color="primary" size="sm"
                                    onClick={() => { this.saveData(); }}><i className="fa fa-save" /> Kaydet</Button>

                            </NavItem>
                            <NavItem>
                                <Button color="info" size="sm"
                                    onClick={() => { this.getUrl(); }}><i className="fa fa-save" /> Url Al</Button>
                            </NavItem>
                        </Nav>
                    </Navbar>
                </Col>
            </Row>
            <Row>

                <Col xs="12">
                    {
                        this.props.JsonData && this.props.JsonData.Channels ? this.props.JsonData.Channels.map((item, index) => {
                            return <ListItem data={item} key={index} index={index} onDeleteClick={this.onDeleteItem.bind(this)} onCopyClick={this.onCopyItem.bind(this)} />;
                        }) : null
                    }
                </Col>
                {/* <Col xs="12">
                    <MonacoEditor ref={(a) => { this.editor = a; }}
                        language="json" height="600" theme="vs-dark"
                        options={options}
                        value={this.props.JsonData ? JSON.stringify(this.props.JsonData) : ""}
                        editorDidMount={this.editorDidMount.bind(this)}
                    />
                </Col> */}
            </Row>

        </Container >;
    }
}

// export default Channels;
export default connect(
    (state: ApplicationState) => state.Editor,
    EditorState.actionCreators
)(Editor);