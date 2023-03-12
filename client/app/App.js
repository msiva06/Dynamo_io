import React, { useState, useEffect } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Navbar,
  ListGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDependencyAsync,
  selectDependency,
} from "../features/dependencySlice";
import { generateProjAsync } from "../features/generateProjSlice";
import axios from "axios";

const App = () => {
  const [projName, setProjName] = useState("");
  const [projBtn, setProjBtn] = useState(false);
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
  const [componentErr, setComponentErr] = useState({});
  const [modelsErr, setModelsErr] = useState({});
  const [apiErr, setApiErr] = useState({});
  const [projNameErr, setProjNameErr] = useState({});

  const dispatch = useDispatch();
  const dependency = useSelector(selectDependency);
  // console.log("Dependency:", dependency.name);
  // console.log("DependencyList:", dependencyList);

  const handleDependency = async (event) => {
    event.preventDefault();
    const error = dependencyValidate();
    if (!error.hasOwnProperty("message")) {
      const promise = new Promise((res, rej) => {
        res(
          dispatch(fetchDependencyAsync(dependencyName.trim().toLowerCase()))
        );
      });
      promise.then((dependency) => {
        //console.log("Dependency in Promise:", dependency.payload?.name);
        // console.log(
        //   "In handle dependancy",
        //   dependency.payload?.name,
        //   dependencyName
        // );
        if (dependency.payload?.name === dependencyName.trim().toLowerCase()) {
          //console.log("Positive cond in handle Dependency");
          const dependencyObj = {
            name: dependency.payload.name,
            version: dependency.payload.version,
          };

          setDependencyList([...dependencyList, dependencyObj]);
          setDependencyName("");
          setSelectAutoData("");
        } else if (dependency.error.name === "Error") {
          const error = {};
          error.message = dependency.error.message;
          setDependencyErr(error);
        }
      });
    }
  };

  const dependencyValidate = () => {
    const error = {};
    // console.log(
    //   "Dependencylist and dependency Name:",
    //   dependencyList,
    //   dependencyName
    // );
    if (!dependencyName) {
      error.message = "Dependency name can't be BLANK";
    }
    const index = dependencyList.findIndex(
      (dependency) => dependency.name === dependencyName.trim().toLowerCase()
    );
    if (index !== -1) {
      error.message = "Dependency name already exists";
    }
    setDependencyErr(error);
    //console.log("error:", error);
    return error;
  };

  const handleComponent = (event) => {
    event.preventDefault();
    const error = componentValidate();
    if (!error.hasOwnProperty("message")) {
      const updatedComponent = componentFiles(component);
      setComponentList([...componentList, updatedComponent]);
      setSuccessCompBadge(true);
      setComponent("");
      setComponentForm(false);
    }
  };

  const componentValidate = () => {
    const error = {};
    if (!component) {
      error.message = "Component cant be BLANK";
    }
    if (componentList.includes(component.trim().toLowerCase())) {
      error.message = "Component already Exists";
    }

    setComponentErr(error);
    return error;
  };

  const handleApi = (event) => {
    event.preventDefault();
    const error = apiValidate();
    if (!error.hasOwnProperty("message")) {
      const updatedApi = apiFiles(apiFile);
      setApiFileList([...apiFileList, updatedApi]);
      setSuccessApiBadge(true);
      setAPIForm(false);
      setApiFile("");
    }
  };

  const apiValidate = () => {
    const error = {};
    if (!apiFile) {
      error.message = "API cant be BLANK";
    }
    const updatedApi = apiFiles(apiFile.trim().toLowerCase());
    if (apiFileList.includes(updatedApi)) {
      error.message = "API already Exists";
    }
    setApiErr(error);
    return error;
  };

  const handleModels = (event) => {
    event.preventDefault();
    const error = modelsValidate();
    if (!error.hasOwnProperty("message")) {
      const updatedModels = modelsFiles(modelsFile);
      setModelsFileList([...modelsFileList, updatedModels]);
      setSuccessModelsBadge(true);
      setModelsForm(false);
      setModelsFile("");
    }
  };
  const modelsValidate = () => {
    const error = {};
    if (!modelsFile) {
      error.message = "Models cant be BLANK";
    }
    const updatedModels = modelsFiles(modelsFile.trim().toLowerCase());
    if (modelsFileList.includes(updatedModels)) {
      error.message = "Models already Exists";
    }
    setModelsErr(error);
    return error;
  };

  const componentFiles = (comp) => {
    comp = comp.trim().toLowerCase();
    let folderName = comp;
    let compFileName, compSliceFileName;
    if (comp.includes("-")) {
      const multiCompFileName = comp.split("-");
      folderName = multiCompFileName.join("");
      const multiComp = multiCompFileName.map(
        (comp) => comp.charAt(0).toUpperCase() + comp.substring(1)
      );
      compFileName = multiComp.join("") + ".js";
      multiCompFileName[multiCompFileName.length - 1] =
        multiCompFileName[multiCompFileName.length - 1]
          .charAt(0)
          .toUpperCase() +
        multiCompFileName[multiCompFileName.length - 1].substring(1) +
        "Slice.js";
      compSliceFileName = multiCompFileName.join("");
    } else {
      compFileName = comp.charAt(0).toUpperCase() + comp.substring(1) + ".js";
      compSliceFileName = folderName + "Slice.js";
    }
    return {
      folder: folderName,
      files: [compFileName, compSliceFileName],
    };
  };

  const apiFiles = (apiFile) => {
    apiFile = apiFile.trim().toLowerCase();
    if (apiFile.includes("-")) {
      const multiApiFileName = apiFile.split("-");
      const multiApi = multiApiFileName.map(
        (api) => api.charAt(0).toUpperCase() + api.substring(1)
      );
      apiFile = multiApi.join("") + "API.js";
    } else {
      apiFile =
        apiFile.charAt(0).toUpperCase() + apiFile.substring(1) + "API.js";
    }
    return apiFile;
  };

  const modelsFiles = (modelsFile) => {
    modelsFile = modelsFile.trim().toLowerCase();
    if (modelsFile.includes("-")) {
      const multiModelsFileName = modelsFile.split("-");
      const multiModels = multiModelsFileName.map(
        (models) => models.charAt(0).toUpperCase() + models.substring(1)
      );
      modelsFile = multiModels.join("") + ".js";
    } else {
      modelsFile =
        modelsFile.charAt(0).toUpperCase() + modelsFile.substring(1) + ".js";
    }
    return modelsFile;
  };

  const projNameValidate = () => {
    const error = {};
    if (!projName) {
      error.message = "Proj Name cant be BLANK";
    }
    setProjNameErr(error);
    return error;
  };

  const generateDir = () => {
    const reqbody = {
      projName,
      features: componentList,
      api: apiFileList,
      models: modelsFileList,
      dependencies: dependencyList,
    };
    //console.log(reqbody);
    const error = projNameValidate(reqbody.projName);
    if (!error.hasOwnProperty("message")) {
      dispatch(generateProjAsync(reqbody));
    }
  };

  const handleDeleteComp = (folderName) => {
    const updatedComponentList = componentList.filter(
      (component) => component.folder !== folderName
    );
    setComponentList(updatedComponentList);
  };

  const handleDeleteApi = (apiName) => {
    const updatedApi = apiFileList.filter((api) => api !== apiName);
    setApiFileList(updatedApi);
  };

  const handleDeleteModel = (modelName) => {
    const updatedModels = modelsFileList.filter((model) => model !== modelName);
    setModelsFileList(updatedModels);
  };

  const handleDeleteDependency = (dependName) => {
    const updatedDependency = dependencyList.filter(
      (dependency) => dependency.name !== dependName
    );
    setDependencyList(updatedDependency);
  };

  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [selectAutoData, setSelectAutoData] = useState("");

  useEffect(() => {
    const autoComplete = async () => {
      if (dependencyName !== selectAutoData) {
        try {
          const { data } = await axios.get(
            `https://registry.npmjs.com/-/v1/search?text=<${dependencyName}>&size=20`
          );
          const packageNamesData = data.objects.map(
            (object) => object.package.name
          );
          //console.log("PkgNamesData:", packageNamesData);
          setSelectAutoData("");
          setAutoCompleteData(packageNamesData);
        } catch (err) {
          //console.log(err);
        }
      } else {
        setSelectAutoData("");
        setAutoCompleteData([]);
      }
    };
    autoComplete();
  }, [dependencyName]);

  return (
    <div style={{ backgroundColor: "	#FFFFF0" }}>
      <Navbar bg="dark">
        <Row>
          <Col xs={2}>
            <Container>
              <Navbar.Brand href="#home">
                <img
                  src="/DynamoIO-logos_white.png"
                  width="100"
                  height="100"
                  className="d-inline-block align-top"
                  alt="DynamoIO logo"
                />
              </Navbar.Brand>
            </Container>
          </Col>
          <Col xs={10} className="my-2">
            <Navbar.Brand
              style={{ color: "white" }}
              className="float-end"
              href="#home"
            >
              <img src="/text-1678637716203.png" alt="Dynamo.IO" />
            </Navbar.Brand>
          </Col>
        </Row>
      </Navbar>
      <h2 className="text text-center my-3">
        Boiler-plate code generator for node/npm projects.
      </h2>
      <Container className="mt-5">
        <Row style={{ backgroundColor: "gray" }}>
          <Col className="border">
            <Form>
              <Form.Group
                className="mt-3 mb-3 border"
                style={{ backgroundColor: "black", color: "white" }}
                controlId="formBasicProjName"
              >
                <Form.Label className="mt-3 mx-3">Project Name :</Form.Label>
                <Form.Control
                  type="text"
                  className="mx-3"
                  style={{ maxWidth: "20rem" }}
                  placeholder="Project Name"
                  onChange={(e) => {
                    setProjName(e.target.value);
                    setProjBtn(false);
                  }}
                />
                <Form.Text className="px-3" style={{ color: "lightgray" }}>
                  Project name should consist only of characters.
                </Form.Text>
                {projNameErr && (
                  <p className="text mx-3 text-danger">{projNameErr.message}</p>
                )}
                <Button
                  className="mt-3 mb-3 mx-3 bg-secondary"
                  style={{ border: "none" }}
                  onClick={() => {
                    setProjBtn(true);
                    projNameValidate();
                  }}
                >
                  Add Project
                </Button>
                {projBtn && projName ? <span>✅ {projName} added</span> : ""}
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row style={{ backgroundColor: "gray" }}>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <Container
              className="border mt-3"
              style={{ minHeight: "18rem", backgroundColor: "lightblue" }}
            >
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
                                        <div key={component.folder}>
                                          <Badge
                                            bg="success"
                                            className="mx-3 py-2"
                                          >
                                            {component.files[0]}
                                          </Badge>
                                          <Badge bg="success" className="py-2">
                                            {component.files[1]}
                                          </Badge>
                                          <Button
                                            type="button"
                                            aria-label="Close"
                                            style={{ border: "none" }}
                                            onClick={() =>
                                              handleDeleteComp(component.folder)
                                            }
                                            className="bg-danger close mx-3"
                                          >
                                            <span aria-hidden="true">
                                              &times;
                                            </span>
                                          </Button>
                                        </div>
                                      );
                                    })}
                                </li>
                                {componentBtn && (
                                  <Button
                                    className="d-block btn bg-secondary mt-3"
                                    style={{ border: "none" }}
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
                  onSubmit={handleComponent}
                  style={{ backgroundColor: "#00308F", color: "white" }}
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
                      style={{ maxWidth: "20rem" }}
                      onChange={(e) => {
                        setComponent(e.target.value);
                        setComponentErr("");
                      }}
                    />
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      Component name should consist only of characters
                    </Form.Text>
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      For multi word names,please provide the input as follows:
                      Eg:for xxxyyy component, give xxx-yyy
                    </Form.Text>
                    {componentErr && (
                      <p className="text mx-3 text-danger">
                        {componentErr.message}
                      </p>
                    )}
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
                      type="submit"
                    >
                      Save
                    </Button>
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
                      type="button"
                      onClick={() => setComponentForm(false)}
                    >
                      Cancel
                    </Button>
                  </Form.Group>
                </Form>
              )}
            </Container>
          </Col>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <Container
              className="border mt-3"
              style={{ backgroundColor: "lightgreen", minHeight: "18rem" }}
            >
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
                                  <div key={api}>
                                    <Badge bg="success" className="py-2 mx-3">
                                      {api}
                                    </Badge>
                                    <Button
                                      type="button"
                                      aria-label="Close"
                                      style={{ border: "none" }}
                                      onClick={() => handleDeleteApi(api)}
                                      className="bg-danger close mx-3"
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </Button>
                                  </div>
                                );
                              })}
                            {apiBtn && (
                              <Button
                                className="d-block btn bg-secondary"
                                onClick={() => setAPIForm(true)}
                                style={{ border: "none" }}
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
                                          <Badge
                                            bg="success"
                                            className="py-2 mx-3"
                                          >
                                            {models}
                                          </Badge>
                                          <Button
                                            type="button"
                                            aria-label="Close"
                                            style={{ border: "none" }}
                                            onClick={() =>
                                              handleDeleteModel(models)
                                            }
                                            className="bg-danger close mx-3"
                                          >
                                            <span aria-hidden="true">
                                              &times;
                                            </span>
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  {modelsBtn && (
                                    <Button
                                      className="d-block btn bg-secondary"
                                      onClick={() => setModelsForm(true)}
                                      style={{ border: "none" }}
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
                  onSubmit={handleApi}
                  style={{ backgroundColor: "#2E8B57", color: "white" }}
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
                      style={{ maxWidth: "20rem" }}
                      placeholder="Enter API"
                      onChange={(e) => {
                        setApiFile(e.target.value);
                        setApiErr("");
                      }}
                    />
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      API name should consist only of characters
                    </Form.Text>
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      For multi word names,please provide the input as follows:
                      Eg:for xxxyyy component, give xxx-yyy
                    </Form.Text>
                    {apiErr && (
                      <p className="text mx-3 text-danger">{apiErr.message}</p>
                    )}
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
                      type="submit"
                    >
                      Save
                    </Button>
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
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
                  onSubmit={handleModels}
                  style={{ backgroundColor: "#2E8B57", color: "white" }}
                >
                  <Form.Group
                    className="mt-3 mb-3 border"
                    controlId="formBasicApi"
                  >
                    <Form.Label className="mt-3 mx-3">
                      Enter Model Name :
                    </Form.Label>
                    <Form.Control
                      className="mx-3"
                      type="text"
                      style={{ maxWidth: "20rem" }}
                      placeholder="Enter Model"
                      onChange={(e) => {
                        setModelsFile(e.target.value);
                        setModelsErr("");
                      }}
                    />
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      Models name should consist only of characters
                    </Form.Text>
                    <Form.Text
                      className="px-3 my-2 d-block"
                      style={{ color: "lightgray" }}
                    >
                      For multi word names,please provide the input as follows:
                      Eg:for xxxyyy component, give xxx-yyy
                    </Form.Text>
                    {modelsErr && (
                      <p className="text mx-3 text-danger">
                        {modelsErr.message}
                      </p>
                    )}
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
                      type="submit"
                    >
                      Save
                    </Button>
                    <Button
                      className="mt-3 mb-3 mx-2 bg-secondary"
                      style={{ border: "none" }}
                      type="button"
                      onClick={() => setModelsForm(false)}
                    >
                      Cancel
                    </Button>
                  </Form.Group>
                </Form>
              )}
            </Container>
          </Col>
        </Row>
        <Row style={{ backgroundColor: "gray" }}>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <Form>
              <Form.Group
                className="mt-3 mb-3 border"
                //controlId="formBasicDependName"
                style={{
                  minHeight: "18rem",
                  color: "white",
                  backgroundColor: "black",
                }}
              >
                <Form.Label className="mt-3 mx-3">Dependencies :</Form.Label>
                <Form.Control
                  className="mx-3"
                  type="text"
                  id="dependName"
                  placeholder="Add Dependency"
                  style={{ maxWidth: "20rem" }}
                  value={dependencyName}
                  onChange={(e) => {
                    setDependencyName(e.target.value);
                    setDependencyErr("");
                  }}
                />
                {autoCompleteData.length != 0 &&
                  autoCompleteData.map((data) => {
                    return (
                      !selectAutoData && (
                        <ListGroup
                          className="mx-3"
                          style={{ maxWidth: "20rem" }}
                          key={data}
                        >
                          <ListGroup.Item
                            action
                            onClick={() => {
                              setDependencyName(data);
                              setSelectAutoData(data);
                              setAutoCompleteData([]);
                            }}
                          >
                            {data}
                          </ListGroup.Item>
                        </ListGroup>
                      )
                    );
                  })}
                {dependancyErr && (
                  <p className="text text-danger mx-3">
                    {dependancyErr.message}
                  </p>
                )}
                <Button
                  className="mt-3 mb-3 mx-3 bg-secondary"
                  style={{ border: "none" }}
                  onClick={handleDependency}
                >
                  Add Dependency
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col className="border" style={{ minHeight: "20rem" }}>
            <Container
              className="mt-3 mb-3"
              style={{ minHeight: "18rem", backgroundColor: "white" }}
            >
              <p className="mx-2 my-3">Dependencies:</p>
              {dependencyList.length > 0 &&
                dependencyList?.map((dependency) => {
                  return (
                    <div key={dependency.name}>
                      <Badge bg="success" className="py-2 mx-3">
                        {dependency.name}
                      </Badge>
                      <Button
                        type="button"
                        style={{ border: "none" }}
                        aria-label="Close"
                        onClick={() => handleDeleteDependency(dependency.name)}
                        className="bg-danger close mx-3"
                      >
                        <span aria-hidden="true">&times;</span>
                      </Button>
                    </div>
                  );
                })}
            </Container>
          </Col>
        </Row>
        <Row style={{ backgroundColor: "gray" }}>
          <Col
            className="border"
            style={{ minHeight: "20rem", backgroundColor: "white" }}
          >
            <h3 className="mx-3 my-3">Notes:</h3>
            <p className="text text-info mx-3">Component:</p>
            <li className="mx-3">
              Component's folder name should be in lowercase letters.
            </li>
            <li className="mx-3">
              Component's file name should start with Uppercase letter.
            </li>
            <li className="mx-3">
              Component's slice name should be in camelCase format appended with
              "Slice" at the end.
            </li>
            <p className="text text-info mx-3 my-3">API:</p>
            <li className="mx-3">
              API's file name should start with Uppercase letter.
            </li>
            <li className="mx-3">
              Multi-word API's name should be in respective UpperCase format
              appended with "API" at the end.
            </li>
            <p className="text text-info mx-3 my-3">Models:</p>
            <li className="mx-3">
              Models's file name should start with Uppercase letter.
            </li>
            <li className="mx-3">
              Multi-word Model's name should be in respective UpperCase format.
            </li>
            <p className="text text-info mx-3 my-3">Dependencies:</p>
            <li className="mx-3">
              Dependencies are added to the package.json file.
            </li>
            <p className="text text-info mx-3 my-3">
              Additional files Provided:
            </p>
            <li className="mx-3">client/index.js</li>
            <li className="mx-3">public/index.html</li>
            <li className="mx-3">public/style.css</li>
            <li className="mx-3">server/index.js</li>
            <li className="mx-3">server/app.js</li>
            <li className="mx-3">client/index.js</li>
            <li className="mx-3">README.md</li>
            <li className="mx-3 mb-3">webpack.config.js</li>
          </Col>
          <Col
            className="border"
            style={{ minHeight: "20rem", backgroundColor: "white" }}
          >
            <h3 className="mx-3 my-3">Sample Project Structure:</h3>
            <img
              className="my-3"
              src="/Projstructure.png"
              alt="project structure"
            />
          </Col>
        </Row>
        <Row>
          <Button
            type="button"
            className="bg-dark"
            style={{ border: "none", backgroundColor: "2C7E65" }}
            onClick={generateDir}
          >
            Generate Directory
          </Button>
        </Row>
      </Container>
    </div>
  );
};

export default App;
