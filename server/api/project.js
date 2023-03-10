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

      const features = req.body.client.features;

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
      //----------------------------------------------------------------------------//
      const publicDir = await mkdir(`${newDir}/public`, { recursive: true });
      const indexPublicHtml = await fs.createReadStream(
        `public/sampleIndex.html`,
        {
          encoding: "utf-8",
        }
      );

      // const indexPublicFile = await writeFile(
      //   path.join(`${publicDir}`, "index.html"),
      //   ""
      // );

      const indexPublicFile = await fs.createWriteStream(
        path.join(`${publicDir}`, "index.html")
      );

      indexPublicHtml.pipe(indexPublicFile);

      const stylePublicFile = await writeFile(
        path.join(`${publicDir}`, "style.css"),
        ""
      );

      //----------------------------------------------------------------------------//
      const serverDir = await mkdir(`${newDir}/server`, { recursive: true });
      const apiDir = await mkdir(`${serverDir}/api`, { recursive: true });

      const apiArray = req.body.server.api;
      for (let api of apiArray) {
        await writeFile(path.join(`${serverDir}`, "api", `${api}`), "");
      }
      const dbDir = await mkdir(`${serverDir}/db`, { recursive: true });
      const modelsDir = await mkdir(`${dbDir}/models`, { recursive: true });
      const modelsArr = req.body.server.db.models;
      for (let model of modelsArr) {
        await writeFile(
          path.join(`${serverDir}`, "db", "models", `${model}`),
          ""
        );
      }
      const appServFile = await writeFile(
        path.join(`${serverDir}`, "app.js"),
        ""
      );
      const indexServFile = await writeFile(
        path.join(`${serverDir}`, "index.js"),
        ""
      );

      //----------------------------------------------------------------------------//
      const packgJson = JSON.parse(
        fs.readFileSync(`public/buildZip/${projName}/package.json`, "utf-8")
      );

      console.log("++++++++++++" + packgJson);
      console.log("name::::::::" + packgJson.version + projName);
      packgJson.name = projName;

      const dependencies = req.body.dependencies;
      dependencies.forEach((dependency) => {
        console.log(dependency.name);
        console.log(dependency.version);
        const name = dependency.name;
        const version = dependency.version;
        packgJson.dependencies[name] = version;
      });

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
    res.send(data);
  } catch (err) {
    next(err);
  }
});

router.get("/package/:pkgName", async (req, res, next) => {
  try {
    const pkgName = req.params.pkgName;
    const { data } = await axios.get(`https://registry.npmjs.org/${pkgName}`);
    console.log(data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
