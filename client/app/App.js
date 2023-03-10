import React, { useState } from "react";
import { Form, Container, Row, Col, Button, Badge } from "react-bootstrap";

const App = () => {
  const [projName, setProjName] = useState("");
  const [src, setSrc] = useState(false);
  const [features, setFeatures] = useState(false);
  const [component, setComponent] = useState("");
  const [componentList, setComponentList] = useState([]);
  const [componentForm, setComponentForm] = useState(false);
  const [successCompBadge, setSuccessCompBadge] = useState(false);
  const [successApiBadge, setSuccessApiBadge] = useState(false);
  const [api, setApi] = useState(false);
  const [apiFile, setApiFile] = useState("");
  const [apiFileList, setApiFileList] = useState([]);
  const [apiForm, setAPIForm] = useState(false);
  const [db, setDb] = useState(false);
  const [models, setModels] = useState(false);
  console.log("ProjName:", projName);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group
                className="mt-5 mb-3 border"
                controlId="formBasicProjName"
              >
                <Form.Label>Project Name :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Project Name"
                  onChange={(e) => setProjName(e.target.value)}
                  value={projName}
                />
                <Button>Add Project</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="border mx-3 ">
            <header>Client :</header>
            <ul style={{ listStyle: "none" }}>
              <li>
                <i
                  className="bi bi-caret-down-fill"
                  onClick={() => setSrc(!src)}
                ></i>
                <span>Client</span>
                <ul style={{ listStyle: "none" }}>
                  {src && (
                    <li>
                      <i
                        className="bi bi-caret-down-fill"
                        onClick={() => setFeatures(!features)}
                      ></i>
                      <span>src</span>
                      <ul style={{ listStyle: "none" }}>
                        {features && (
                          <li>
                            <i className="bi bi-caret-down-fill"></i>
                            <span>features</span>
                            <ul style={{ listStyle: "none" }}>
                              <li>
                                {successCompBadge &&
                                  componentList?.map((component) => {
                                    return (
                                      <div key={component}>
                                        <Badge bg="success">{component}</Badge>
                                      </div>
                                    );
                                  })}
                              </li>
                              <Button
                                className="d-block btn btn-primary"
                                onClick={() => setComponentForm(true)}
                              >
                                Add Component
                              </Button>
                            </ul>
                          </li>
                        )}
                      </ul>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
            {componentForm && (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setComponentList([...componentList, component]);
                  successCompBadge(true);
                  setComponentForm(false);
                }}
              >
                <Form.Group
                  className="mb-3 border"
                  controlId="formBasicComponent"
                >
                  <Form.Label>Enter component Name :</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Component"
                    onChange={(e) => setComponent(e.target.value)}
                  />
                  <Button type="submit">Save</Button>
                  <Button type="button" onClick={() => setComponentForm(false)}>
                    Cancel
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Col>
          <Col className="border mx-3">
            <header>Server :</header>
            <ul style={{ listStyle: "none" }}>
              <li>
                <i
                  className="bi bi-caret-down-fill"
                  onClick={() => setApi(!api)}
                ></i>
                <span>Server</span>
                <ul style={{ listStyle: "none" }}>
                  {api && (
                    <li>
                      <i className="bi bi-caret-down-fill"></i>
                      <span>Api</span>
                      <ul style={{ listStyle: "none" }}>
                        <li>
                          {successApiBadge &&
                            apiFileList?.map((api) => {
                              return (
                                <div>
                                  <Badge bg="success">{api}</Badge>
                                </div>
                              );
                            })}
                          <Button
                            className="d-block btn btn-primary"
                            onClick={() => setAPIForm(true)}
                          >
                            Add API
                          </Button>
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
            {apiForm && (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setApiFileList([...apiFileList, apiFile]);
                  setSuccessApiBadge(true);
                  setAPIForm(false);
                }}
              >
                <Form.Group className="mb-3 border" controlId="formBasicApi">
                  <Form.Label>Enter API Name :</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter API"
                    onChange={(e) => setApiFile(e.target.value)}
                  />
                  <Button type="submit">Save</Button>
                  <Button type="button" onClick={() => setAPIForm(false)}>
                    Cancel
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
