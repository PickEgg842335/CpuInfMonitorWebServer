const express = require('express');
const app = express();
const osutils = require('os-utils');
const fs = require('fs');
const cors = require('cors');
const upgradeCpuInfTaskTimems = 1000;

let jsonstring = '';
let JsonMake = [];
let ObjCpuInf = {
    "CPU Usage(%)" : "0",
    "CPU Free(%)" : "0",
    "Total Memory" : "0",
    "Free Memory" : "0",
    "Free Memory Percent" : "0",
};

app.listen(8181);
app.use(express.static("public"));
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/Cpuinf.html");
});

app.get('/read', (req, res) => {
    res.send(jsonstring);
    res.end();
});

const upgradeCpuInfTask = setInterval(() => {
    osutils.cpuUsage(function(v){
        ObjCpuInf['CPU Usage(%)'] = String(Math.floor(v * 1000) / 10) + ' %';
        osutils.cpuFree(function(v){
            ObjCpuInf['CPU Free(%)'] = String(Math.floor(v * 1000) / 10) + ' %';
            ObjCpuInf['Total Memory'] = String(Math.floor(osutils.totalmem() / 1000)) + ' GB';
            ObjCpuInf['Free Memory'] = String(Math.floor(osutils.freemem() / 100) / 10) + ' GB';
            ObjCpuInf['Free Memory Percent'] = String(Math.floor(osutils.freememPercentage() * 1000) / 10) + ' %';
            JsonMake[0] = ObjCpuInf;
            jsonstring = JSON.stringify(JsonMake);
            fs.writeFile('./public/json/cpurealtimeinf.json', jsonstring, (err) => {
                if(err) throw err;
            });
        });
    });
}, upgradeCpuInfTaskTimems);
