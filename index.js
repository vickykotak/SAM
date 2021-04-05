const express = require('express');
const Shell = require('node-powershell');
const netList = require('network-list');

const app = express()
const port = 5000


const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

// manually add ip for time being
const command = `wmic /node:192.168.97.132 product get name,identifyingnumber,installdate,vendor,version /format:htable`;
const c= "ping 192.168.97.243";

app.get('/', (req, res) => {
    ps.addCommand(`cd ~`);
    ps.addCommand(`cd desktop`);
    ps.addCommand(command);
    // ps.addCommand(`$pwd.Path`);
    ps.invoke()
    .then((response) => {
        res.send(response);
    })
    .catch(err => {
        res.json(err)
    });
});

app.get('/sm', (req, res) => {
    netList.scan({
        ip: '192.168.97', // add manually
        timeout: 10000, 
        vendor: true
    }, (err, arr) => {
        res.send(arr); // array with all devices
    });
});
 

var server = app.listen(port,() => console.log(`Server listening on port ${port}!`));
server.timeout = 1000 * 60 * 10;