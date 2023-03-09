const express = require("express");
const router = express.Router();
const { mkdir, writeFile } = require("node:fs/promises");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const packgJson = require("../../package.json");
const dotenv = require("dotenv").config();
const admz = require("adm-zip");

//api/project

router.get("/:projName", async (req, res, next) => {
  try {
    const proj = req.params.projName;
    const newDir = await mkdir(`./${proj}`, { recursive: true });
    const pkgJson = await fs.createReadStream(
      "/Users/manimala/Documents/Junior_Phase/ProjUI/public/sample.json",
      {
        encoding: "utf-8",
      }
    );
    const projPkg = await fs.createWriteStream(
      //path.join(`./${proj}`, "package.json")
      path.join(`${newDir}`, "package.json")
    );
    pkgJson.pipe(projPkg);

    const readMeFile = await writeFile(
      //path.join(`./${proj}`, "README.md"),
      path.join(`${newDir}`, "README.md"),
      "This is a readme file"
    );
    packgJson.name = `${proj}`;
    if (newDir) {
      const srcDir = await mkdir(`${newDir}/src`, { recursive: true });
      const clientDir = await mkdir(`${srcDir}/client`, { recursive: true });
      const serverDir = await mkdir(`${srcDir}/server`, { recursive: true });
    }
    const down_fileName = newDir.substring(2);
    console.log("DownfileName:", down_fileName);
    const to_zip = fs.readdirSync(down_fileName);
    console.log(to_zip);
    const zip = new admz();

    const rootDir = "/Users/manimala/Documents/Junior_Phase/ProjUI/";
    for (let i = 0; i < to_zip.length; i++) {
      const file = rootDir + down_fileName + "/" + to_zip[i];
      console.log("file:::" + file);
      const isDir = fs.lstatSync(file).isDirectory();
      if (isDir) {
        zip.addLocalFolder(file);
      } else {
        zip.addLocalFile(file);
      }
    }

    const download_File = `${proj}.zip`;
    const data = zip.toBuffer();
    console.log("DATA:", data);
    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename=${download_File}`);
    res.set("Content-Length", data.length);
    res.send(data);
    //const fileName = __dirname + `/${proj}.zip`;
    // zip.folder(`${proj}`).folder("src").folder("client");
    // zip.folder(`${proj}`).folder("src").folder("server");
    // zip.folder(`${proj}`).file("README.md", "readme file");
    // zip
    //   .folder(`${proj}`)
    //   .generateAsync({ type: "nodebuffer" })
    //   .then(function (content) {
    //     require("fs").writeFile(`${proj}.zip`, content, function (err) {});
    //   });
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
