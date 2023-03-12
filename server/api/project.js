const express = require("express");
const router = express.Router();
const { mkdir, writeFile } = require("node:fs/promises");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const env = require("dotenv").config();
const admz = require("adm-zip");

//api/project

router.post("/", async (req, res, next) => {
  try {
    const proj = req.body;
    console.log("Req:", proj);
    const projName = req.body.projName;
    const root = process.env.PROJNAME;

    const newDir = await mkdir(`public/buildZip/${projName}`, {
      recursive: true,
    });

    const pkgJson = await fs.createReadStream(`public/sample.json`, {
      encoding: "utf-8",
    });

    const projPkg = await fs.createWriteStream(
      path.join(`${newDir}`, "package.json")
    );
    pkgJson.pipe(projPkg);

    const webConfigJs = await fs.createReadStream(`public/sampleConfig.js`, {
      encoding: "utf-8",
    });

    const projWebConfig = await fs.createWriteStream(
      path.join(`${newDir}`, "webpack.config.js")
    );
    webConfigJs.pipe(projWebConfig);

    const readMeFile = await writeFile(path.join(`${newDir}`, "README.md"), "");
    if (newDir) {
      //----------------------------------------------------------------------------//

      const isClientPresent = req.body?.features;
      if (isClientPresent !== undefined && isClientPresent.length > 0) {
        const clientDir = await mkdir(`${newDir}/client`, { recursive: true });
        const featuresDir = await mkdir(`${clientDir}/features`, {
          recursive: true,
        });

        const appDir = await mkdir(`${featuresDir}/app`, {
          recursive: true,
        });

        console.log("AppDir:", appDir);
        const appClientFile = await fs.createReadStream(`public/sampleApp.js`, {
          encoding: "utf-8",
        });

        // const appFile = await writeFile(path.join(`${appDir}`, "App.js"), "");
        const appFile = await fs.createWriteStream(
          path.join(`${appDir}`, "App.js")
        );
        appClientFile.pipe(appFile);

        const indexJsFile = await fs.createReadStream(`public/sampleIndex.js`, {
          encoding: "utf-8",
        });
        // const indexClientFile = await writeFile(
        //   path.join(`${clientDir}`, "index.js"),
        //   ""
        // );
        const indexClientFile = await fs.createWriteStream(
          path.join(`${clientDir}`, "index.js")
        );
        indexJsFile.pipe(indexClientFile);

        const features = req.body?.features;

        for (let feature of features) {
          const files = feature.files;
          await mkdir(`${featuresDir}/${feature.folder}`, { recursive: true });
          for (let file of files) {
            await writeFile(
              path.join(`${featuresDir}`, `${feature.folder}`, `${file}`),
              ""
            );
          }
        }
      }

      //----------------------------------------------------------------------------//
      const publicDir = await mkdir(`${newDir}/public`, { recursive: true });
      const indexPublicHtml = await fs.createReadStream(
        `public/sampleIndex.html`,
        {
          encoding: "utf-8",
        }
      );

      const indexPublicFile = await fs.createWriteStream(
        path.join(`${publicDir}`, "index.html")
      );

      indexPublicHtml.pipe(indexPublicFile);

      const stylePublicFile = await writeFile(
        path.join(`${publicDir}`, "style.css"),
        ""
      );

      //----------------------------------------------------------------------------//
      const api = req.body?.api;
      const models = req.body?.models;
      if (
        (api !== undefined || models !== undefined) &&
        (api.length > 0 || models.length > 0)
      ) {
        const serverDir = await mkdir(`${newDir}/server`, { recursive: true });
        if (api !== undefined && api.length > 0) {
          const apiDir = await mkdir(`${serverDir}/api`, { recursive: true });

          const apiArray = req.body?.api;
          if (apiArray.length > 0) {
            for (let api of apiArray) {
              await writeFile(path.join(`${serverDir}`, "api", `${api}`), "");
            }
          }
        }
        if (models !== undefined && models.length > 0) {
          const dbDir = await mkdir(`${serverDir}/db`, { recursive: true });
          const modelsDir = await mkdir(`${dbDir}/models`, { recursive: true });
          const modelsArr = req.body?.models;
          if (modelsArr.length > 0) {
            for (let model of modelsArr) {
              await writeFile(
                path.join(`${serverDir}`, "db", "models", `${model}`),
                ""
              );
            }
          }
        }
        const appServFile = await writeFile(
          path.join(`${serverDir}`, "app.js"),
          ""
        );
        const indexServFile = await writeFile(
          path.join(`${serverDir}`, "index.js"),
          ""
        );
      }

      //----------------------------------------------------------------------------//
      const packgJson = JSON.parse(
        fs.readFileSync(`public/buildZip/${projName}/package.json`, "utf-8")
      );

      console.log("++++++++++++" + packgJson);
      console.log("name::::::::" + packgJson.version + projName);
      packgJson.name = projName;

      const dependencies = req.body?.dependencies;
      if (dependencies !== undefined && dependencies.length > 0) {
        dependencies.forEach((dependency) => {
          console.log(dependency.name);
          console.log(dependency.version);
          const name = dependency.name;
          const version = dependency.version;
          packgJson.dependencies[name] = version;
        });
      }

      //----------------------------------------------------------------------------//
      fs.writeFileSync(
        `public/buildZip/${projName}/package.json`,
        JSON.stringify(packgJson, null, 4),
        function writeJSON(err) {
          if (err) return console.log(err);
          console.log(JSON.stringify(file));
          console.log("writing to " + fileName);
        }
      );
    }
    const down_fileName = `${newDir}`;
    console.log("DownfileName:", down_fileName);
    const to_zip = fs.readdirSync(down_fileName);
    console.log(to_zip);
    const zip = new admz();

    zip.addLocalFolder("public/buildZip");
    //const rootDir = "${root}";
    // for (let i = 0; i < to_zip.length; i++) {
    //   const file = down_fileName + "/" + to_zip[i];

    //   const isDir = fs.lstatSync(file).isDirectory();
    //   if (isDir) {
    //     console.log("folder:::" + file);
    //     zip.addLocalFolder(file);
    //   } else {
    //     console.log("file:::" + file);
    //     zip.addLocalFile(file);
    //   }
    // }
    //console.log("zip:::" + zip);
    const download_File = `${projName}.zip`;
    const data = zip.toBuffer();
    console.log("DATA:", data);
    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename=${download_File}`);
    res.set("Content-Length", data.length);
    // fs.rmdir(`${newDir}`, (err) => {
    //   if (err) throw err;
    //   console.log("Directory removed");
    // });
    fs.rmSync(`${newDir}`, { recursive: true, force: true });
    res.send(data);
    //res.download(`${projName}.zip`);
  } catch (err) {
    fs.rmSync(`${newDir}`, { recursive: true, force: true });
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const pkgName = req.query.pkgName;
    const { data, status } = await axios.get(
      `https://registry.npmjs.org/${pkgName}/latest`
    );
    res.json(data);
    //__________________________________________Promise portion___________________________
    //let responses;
    //const promises = [];
    // for (let pkg of pkgList) {
    //   try {
    //     const promise = new Promise(async (res, rej) => {
    //       const { data, status } = await axios.get(
    //         `https://registry.npmjs.org/${pkg}/latest`
    //       );
    //       res(data, status);
    //       // Promise.reject(new Error("Requested Package not found in npm")).then(
    //       //   res,
    //       //   rej
    //       // );
    //       rej(new Error("Requested Package not found in npm"));
    //     });
    //     promises.push(promise);
    //   } catch (err) {
    //     res.sendStatus(404).send("Requested Package not found in npm");
    //     return;
    //   }
    // }

    // try {
    //   responses = await Promise.all(promises);
    // } catch (err) {
    //   res.sendStatus(404).send("Requested Package not found in npm");
    //   return;
    // }

    // const { data, status } = await axios.get(
    //   `https://registry.npmjs.org/${pkgName}`
    // );
    // if (status === "404") {
    //   res.sendStatus(404).send("Requested package not found in npm");
    //   return;
    // } else {
    // console.log(responses);
    // res.json(responses);
    //}
    //__________________________________________Promise portion___________________________
  } catch (err) {
    if (err.response.status === 404) {
      const errorUrl = err.response.config.url.split("/");
      res
        .status(404)
        .send(`Requested Package :${errorUrl[3]} not found in npm`);
      return;
    }
    next(err);
  }
});
module.exports = router;
