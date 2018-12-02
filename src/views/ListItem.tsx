import * as React from 'react';
import { Col, Form, FormGroup, Input, Label, Card, CardBody, Collapse, CardHeader, Button, ButtonGroup } from 'reactstrap';

class ListItem extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = { data: this.props.data, collapse: false };
    }

    componentDidMount() {
        this.setState({ data: this.props.data });
    }

    render() {
        return <Card>
            <CardHeader >
                <div className="pull-left" style={{ cursor: "pointer" }} onClick={() => { this.setState({ collapse: !this.state.collapse }) }}>{this.props.data.name}</div>
                <i className={"pull-right fa " + (this.state.collepse ? "fa-arrow-up" : "fa-arrow-down")}></i>
                <div className="pull-right ml-auto">
                    <ButtonGroup size="sm">
                        <Button color="success" onClick={this.props.onCopyClick ? this.props.onCopyClick.bind(this, this.props.data, this.props.index) : null}>Kopyala</Button>
                        <Button color="danger" onClick={this.props.onDeleteClick ? this.props.onDeleteClick.bind(this, this.props.data, this.props.index) : null}>Sil</Button>
                    </ButtonGroup>
                </div>
            </CardHeader>
            <Collapse isOpen={this.state.collapse}>
                <CardBody>
                    <Form>
                        <FormGroup row>
                            <Label sm={2}>Type</Label>
                            <Col sm={10}>
                                <Input type="select" value={this.props.data.type}
                                    onChange={(e) => { this.props.data.type = e.target.value; this.setState({}); }}>
                                    <option value="0">Url</option>
                                    <option value="3">Regex</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Kategori</Label>
                            <Col sm={10}>
                                <Input type="text" value={this.props.data.category}
                                    onChange={(e) => { this.props.data.category = e.target.value; this.setState({}); }} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Adı</Label>
                            <Col sm={10}>
                                <Input type="text" value={this.props.data.name}
                                    onChange={(e) => { this.props.data.name = e.target.value; this.setState({}); }} />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label sm={2}>Url</Label>
                            <Col sm={10}>
                                <Input type="text" value={this.props.data.url} disabled={this.props.data.type == 3}
                                    onChange={(e) => { this.props.data.url = e.target.value; this.setState({}); }} />
                            </Col>
                        </FormGroup>
                        {
                            this.props.data.type == 3 ? [
                                <FormGroup row key="1">
                                    <Label sm={2}>Sayfa Url</Label>
                                    <Col sm={10}>
                                        <Input type="text" value={this.props.data.pageUrl}
                                            onChange={(e) => { this.props.data.pageUrl = e.target.value; this.setState({}); }} />
                                    </Col>
                                </FormGroup>,
                                <FormGroup row key="2">
                                    <Label sm={2}>Regex</Label>
                                    <Col sm={10}>
                                        <Input type="text" value={this.props.data.urlRegex}
                                            onChange={(e) => { this.props.data.urlRegex = e.target.value; this.setState({}); }} />
                                    </Col>
                                </FormGroup>,
                                <FormGroup row key="3">
                                    <Label sm={2}>IFrame</Label>
                                    <Col sm={{ size: 10 }}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" value={this.props.data.iframe}
                                                    onChange={(e) => { this.props.data.iframe = e.target.value; this.setState({}); }} />
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>
                            ] : null
                        }
                    </Form>
                </CardBody>
            </Collapse>
        </Card>
    }
}

// export default Channels;
export default ListItem;