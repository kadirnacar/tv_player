import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';
import { Button, ButtonGroup, ButtonToolbar, Col, Container, Row } from 'reactstrap';
import CNavbar from '../containers/App/navbar';
import * as EditorState from '../reducers/editor';
import { ApplicationState } from '../store';

class Editor extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        };
    }
    getData = () => {
        this.props.getJson().then(() => {
            this.editor.editor.getAction('editor.action.formatDocument').run();
        });
    }
    saveData = () => {
        this.props.saveJson(JSON.parse(this.editor.editor.getValue())).then(() => {
            this.editor.editor.getAction('editor.action.formatDocument').run();
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

    editor: any;
    render() {
        const options = {
        };
        return <Container fluid tabIndex={0}>
            <CNavbar />
            <div className="clearfix dd" style={{ padding: '.5rem' }}></div>
            <Row>
                <Col xs="12">
                    <ButtonToolbar>
                        <ButtonGroup>
                            <Button color="success" onClick={() => { this.getData(); }}><i className="fa fa-home" /> Yenile</Button>
                            <Button color="warning" onClick={() => {  this.editor.editor.getAction('editor.action.formatDocument').run(); }}><i className="fa fa-refresh" /> Format</Button>
                            <Button color="primary" onClick={() => { this.saveData(); }}><i className="fa fa-save" /> Kaydet</Button>
                        </ButtonGroup>

                    </ButtonToolbar>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <MonacoEditor ref={(a) => { this.editor = a; }}
                        language="json" height="600" theme="vs-dark"
                        options={options}
                        value={this.props.JsonData ? JSON.stringify(this.props.JsonData) : ""}
                        editorDidMount={this.editorDidMount.bind(this)}
                    />
                </Col>
            </Row>

        </Container >;
    }
}

// export default Channels;
export default connect(
    (state: ApplicationState) => state.Editor,
    EditorState.actionCreators
)(Editor);