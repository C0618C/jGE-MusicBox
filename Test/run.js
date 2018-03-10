let url = require("url"),
    fs = require("fs"),
    http = require("http"),
    path = require("path"),
    open = require('opn');
let [v_port, local, fpath] = process.argv.splice(2);

function loadFile(pathname, res) {
    switch (path.extname(pathname)) {
        case "":
            res.writeHead(200, { "Content-Type": "text/plain" });
            break;
        case ".html":
            res.writeHead(200, { "Content-Type": "text/html" });
            break;
        case ".js":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            break;
        case ".css":
            res.writeHead(200, { "Content-Type": "text/css" });
            break;
        case ".gif":
            res.writeHead(200, { "Content-Type": "image/gif" });
            break;
        case ".jpg":
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            break;
        case ".png":
            res.writeHead(200, { "Content-Type": "image/png" });
            break;
        case ".pdf":
            res.writeHead(200, { "Content-Type": "application/pdf" });
            break;
        default:
            res.writeHead(200, { "Content-Type": "application/octet-stream" });
    }

    fs.readFile(pathname, function (err, data) {
        res.end(data);
    });
}


let pathDir = "";
if(fpath){
    fpath.replace(local + "\\", "").replace("\\", "/");
    pathDir = pathDir.substr(0, pathDir.lastIndexOf("/"));
}
let localDir = __dirname.replace(/\/|\\test/i, "");
http.createServer(function (req, res) {
    let reqPath = decodeURI(url.parse(req.url).pathname);

    let pathnameCurPath = localDir + "\\"+ pathDir  + reqPath;
    let pathname = localDir + reqPath;

    if (path.extname(pathname) == "") {
        pathname += "/";
        pathnameCurPath += "/";
    }
    if (pathname.charAt(pathname.length - 1) == "/") {
        pathname += "index.html";
        pathnameCurPath += "index.html";
    }


    fs.exists(pathnameCurPath, function (exists) {
        if (exists) {
            loadFile(pathnameCurPath, res);
        } else {            
            fs.exists(pathname, function (exists) {
                if (exists) {
                    loadFile(pathname, res);
                } else {
                    console.warn("获取资源失败：" + pathnameCurPath,pathname);
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end("<!DOCTYPE html><html><head><title>404</title></head><body><div style='width:465px;margin:0px auto;'><img src='/test/i404.jpg'/></div></body></html>");
                }
            });
        }
    });
}).listen(v_port);


if (/\.(?:js|css|json|cfg|md|ico)/.test(fpath)) {
    open(`http://127.0.0.1:${v_port}/${pathDir}`, { app: 'chrome' });
} else {
    let tPath = fpath.replace(local, "").replace("\\", "/");
    open(`http://127.0.0.1:${v_port}` + tPath);
}
