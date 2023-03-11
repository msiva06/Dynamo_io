import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDependencyAsync,
  selectDependency,
} from "../features/dependencySlice";

const App = () => {
  const [projName, setProjName] = useState("");
  const [src, setSrc] = useState(false);
  const [features, setFeatures] = useState(false);
  const [component, setComponent] = useState("");
  const [componentList, setComponentList] = useState([]);
  const [componentForm, setComponentForm] = useState(false);
  const [successCompBadge, setSuccessCompBadge] = useState(false);
  const [componentBtn, setComponentBtn] = useState(false);
  const [successApiBadge, setSuccessApiBadge] = useState(false);
  const [api, setApi] = useState(false);
  const [apiFile, setApiFile] = useState("");
  const [apiFileList, setApiFileList] = useState([]);
  const [apiForm, setAPIForm] = useState(false);
  const [apiBtn, setApiBtn] = useState(false);
  const [db, setDb] = useState(false);
  const [models, setModels] = useState(false);
  const [modelsBtn, setModelsBtn] = useState(false);
  const [modelsForm, setModelsForm] = useState(false);
  const [modelsFile, setModelsFile] = useState("");
  const [modelsFileList, setModelsFileList] = useState([]);
  const [successModelsBadge, setSuccessModelsBadge] = useState(false);
  const [dependencyName, setDependencyName] = useState("");
  const [dependencyList, setDependencyList] = useState([]);
  const [dependancyErr, setDependencyErr] = useState({});

  const dispatch = useDispatch();
  const dependency = useSelector(selectDependency);
  console.log("Dependency:", dependency.name);
  console.log("DependencyList:", dependencyList);

  const handleDependency = async (event) => {
    event.preventDefault();
    const error = validate();
    if (!error.hasOwnProperty("message")) {
      const promise = new Promise((res, rej) => {
        res(dispatch(fetchDependencyAsync(dependencyName)));
      });
      promise.then((dependency) => {
        console.log("Dependency in Promise:", dependency.payload?.name);
        console.log(
          "In handle dependancy",
          dependency.payload?.name,
          dependencyName
        );
        if (dependency.payload?.name === dependencyName) {
          console.log("Positive cond in handle Dependency");
          const dependencyObj = {
            name: dependency.payload.name,
            version: dependency.payload.version,
          };

          setDependencyList([...dependencyList, dependencyObj]);
          setDependencyName("");
        } else if (dependency.error.name === "Error") {
          const error = {};
          error.message = dependency.error.message;
          setDependencyErr(error);
        }
      });
    }
  };

  // useEffect(() => {
  //   if (npmRegistry !== undefined && npmRegistry.name !== "Error") {
  //     const dependencyObj = {
  //       name: npmRegistry.name,
  //       version: npmRegistry.version,
  //     };
  //     setDependencyList(dependencyList.push(dependencyObj));
  //   }
  // }, [npmRegistry]);

  // const handleDependencyList = () => {
  //   console.log("In handle dependancy", dependency.name, dependencyName);
  //   if (dependency?.name === dependencyName) {
  //     console.log("Positive cond in handle Dependency");
  //     const dependencyObj = {
  //       name: dependency.name,
  //       version: dependency.version,
  //     };

  //     setDependencyList(dependencyList.push(dependencyObj));
  //   } else {
  //     console.log("Dependency is not defined");
  //   }
  // };

  const validate = () => {
    const error = {};
    if (!dependencyName) {
      error.message = "Dependency name can't be BLANK";
    }
    if (dependencyList.includes(dependencyName)) {
      error.message = "Dependency name already exists";
    }
    setDependencyErr(error);
    return error;
  };

  const generateDir = () => {};

  return (
    <div>
      <Container>
        <Row>
          <Col className="border mt-5">
            <Form>
              <Form.Group
                className="mt-3 mb-3 border"
                controlId="formBasicProjName"
              >
                <Form.Label className="mt-3 mx-3">Project Name :</Form.Label>
                <Form.Control
                  type="text"
                  className="mx-3"
                  placeholder="Project Name"
                  onChange={(e) => setProjName(e.target.value)}
                  value={projName}
                />
                <Button className="mt-3 mb-3 mx-2">Add Project</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <header className="mt-3">Client :</header>
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
                            <i
                              className="bi bi-caret-down-fill"
                              onClick={() => setComponentBtn(!componentBtn)}
                            ></i>
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
                              {componentBtn && (
                                <Button
                                  className="d-block btn btn-primary"
                                  onClick={() => setComponentForm(true)}
                                >
                                  Add Component
                                </Button>
                              )}
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
                  setSuccessCompBadge(true);
                  setComponentForm(false);
                }}
              >
                <Form.Group
                  className="mt-3 mb-3 border"
                  controlId="formBasicComponent"
                >
                  <Form.Label className="mt-3 mx-3">
                    Enter component Name :
                  </Form.Label>
                  <Form.Control
                    className="mx-3"
                    type="text"
                    placeholder="Enter Component"
                    onChange={(e) => setComponent(e.target.value)}
                  />
                  <Button className="mt-3 mb-3 mx-2" type="submit">
                    Save
                  </Button>
                  <Button
                    className="mt-3 mb-3 mx-2"
                    type="button"
                    onClick={() => setComponentForm(false)}
                  >
                    Cancel
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Col>
          <Col className="border">
            <header className="mt-3">Server :</header>
            <ul style={{ listStyle: "none" }}>
              <li>
                <i
                  className="bi bi-caret-down-fill"
                  onClick={() => {
                    setApi(!api);
                    setDb(!db);
                  }}
                ></i>
                <span>Server</span>
                <ul style={{ listStyle: "none" }}>
                  {api && (
                    <li>
                      <i
                        className="bi bi-caret-down-fill"
                        onClick={() => setApiBtn(!apiBtn)}
                      ></i>
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
                          {apiBtn && (
                            <Button
                              className="d-block btn btn-primary"
                              onClick={() => setAPIForm(true)}
                            >
                              Add API
                            </Button>
                          )}
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
                <ul style={{ listStyle: "none" }}>
                  {db && (
                    <li>
                      <i
                        className="bi bi-caret-down-fill"
                        onClick={() => setModels(!models)}
                      ></i>
                      <span>DB</span>
                      <ul style={{ listStyle: "none" }}>
                        {models && (
                          <li>
                            <i
                              className="bi bi-caret-down-fill"
                              onClick={() => setModelsBtn(!modelsBtn)}
                            ></i>
                            <span>Models</span>
                            <ul style={{ listStyle: "none" }}>
                              <li>
                                {successModelsBadge &&
                                  modelsFileList?.map((models) => {
                                    return (
                                      <div key={models}>
                                        <Badge bg="success">{models}</Badge>
                                      </div>
                                    );
                                  })}
                                {modelsBtn && (
                                  <Button
                                    className="d-block btn btn-primary"
                                    onClick={() => setModelsForm(true)}
                                  >
                                    Add Models
                                  </Button>
                                )}
                              </li>
                            </ul>
                          </li>
                        )}
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
                <Form.Group
                  className="mt-3 mb-3 border"
                  controlId="formBasicApi"
                >
                  <Form.Label className="mt-3 mx-3">
                    Enter API Name :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mx-3"
                    placeholder="Enter API"
                    onChange={(e) => setApiFile(e.target.value)}
                  />
                  <Button className="mt-3 mb-3 mx-2" type="submit">
                    Save
                  </Button>
                  <Button
                    className="mt-3 mb-3 mx-2"
                    type="button"
                    onClick={() => setAPIForm(false)}
                  >
                    Cancel
                  </Button>
                </Form.Group>
              </Form>
            )}
            {modelsForm && (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setModelsFileList([...modelsFileList, modelsFile]);
                  setSuccessModelsBadge(true);
                  setModelsForm(false);
                }}
              >
                <Form.Group
                  className="mt-3 mb-3 border"
                  controlId="formBasicApi"
                >
                  <Form.Label>Enter Model Name :</Form.Label>
                  <Form.Control
                    className="mx-3"
                    type="text"
                    placeholder="Enter Model"
                    onChange={(e) => setModelsFile(e.target.value)}
                  />
                  <Button className="mt-3 mb-3 mx-2" type="submit">
                    Save
                  </Button>
                  <Button
                    className="mt-3 mb-3 mx-2"
                    type="button"
                    onClick={() => setModelsForm(false)}
                  >
                    Cancel
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <Form>
              <Form.Group
                className="mt-3 mb-3 border"
                controlId="formBasicProjName"
              >
                <Form.Label className="mt-3 mx-3">Dependencies :</Form.Label>
                <Form.Control
                  className="mx-3"
                  type="text"
                  placeholder="Add Dependency"
                  value={dependencyName}
                  onChange={(e) => {
                    setDependencyName(e.target.value);
                    setDependencyErr("");
                  }}
                />
                {dependancyErr && (
                  <p className="text text-danger mx-3">
                    {dependancyErr.message}
                  </p>
                )}
                <Button className="mt-3 mb-3 mx-2" onClick={handleDependency}>
                  Add Dependency
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col className="border" style={{ minHeight: "20rem" }}>
            {dependencyList.length > 0 &&
              dependencyList?.map((dependency) => {
                return (
                  <div key={dependency.name}>
                    <Badge bg="success">{dependency.name}</Badge>
                  </div>
                );
              })}
          </Col>
        </Row>
        <Row>
          <Button type="button" onClick={generateDir}>
            Generate Directory
          </Button>
        </Row>
      </Container>
    </div>
  );
};

export default App;
