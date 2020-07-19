#!/usr/bin/env node
let fs     = require("fs");
let path   = require("path");
let util   = require("./utility");

function checkWhetherFile(src) {
  return fs.lstatSync(src).isFile();
}

function getContent(src) {
  return fs.readdirSync(src);
}

function sendFile(dest, category, src) {
  console.log(category);
  let categoryPath = path.join(dest, category);
  // checking if directory exists
  if (fs.existsSync(categoryPath) == false) {
    fs.mkdirSync(categoryPath);
  }
  let fileName = path.basename(src);
  let lastPath = path.join(categoryPath, fileName);
  fs.copyFileSync(src, lastPath);
}

function getCategory(ext) {
  let types = util.types;
  for (let category in types) {
    for (let i = 0; i < types[category].length; i++) {
      if (ext == types[category][i]) {
        console.log("Inside: " + category);
        return category;
      }
    }
  }
  return "others";
}
function organiseMe(src, dest) {
  if (checkWhetherFile(src) == true) {
    let ext = path.extname(src);
    let category = getCategory(ext);
    // if (category == null) {
    //   category = "others";
    // }
    console.log("copying a " + category + " file.");
    sendFile(dest, category, src);
  } else {
    let childNames = getContent(src);
    for (let i = 0; i < childNames.length; i++) {
      if (childNames[i] == "organised_files") {
        continue;
      }
      let childPath = path.join(src, childNames[i]);
      organiseMe(childPath, dest);
    }
  }
}

// input
let src = process.argv[2];
let dest = path.join(src, "organised_files");
if (fs.existsSync(dest) == false) {
  fs.mkdirSync(dest);
}


organiseMe(src, dest);
