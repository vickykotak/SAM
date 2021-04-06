const express = require('express');
const Shell = require('node-powershell');
const netList = require('network-list');
const IPCIDR = require("ip-cidr");
const ip = require("ip");

const app = express()
const port = 5000

const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});


// get list of softwares. 
// It will take few minutes to get response
app.get('/softwares', (req, res) => {
    const command = `wmic /node:${ip.address()} product get name,identifyingnumber,installdate,vendor,version /format:htable`;
    // ps.addCommand(`cd ~`);
    // ps.addCommand(`cd desktop`);
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

// get active devices
app.get('/active', (req, res) => {
    let active = [];

    netList.scan({}, (err, arr) => {
        active = arr.filter(arr => (arr.alive) )
        res.send(active); // array with all active devices
    });
});

// get inactive devices
app.get('/inactive', (req, res) => {
    let active = [];

    netList.scan({}, (err, arr) => {
        active = arr.filter(arr => !(arr.alive))
        res.send(active); // array with all inactive devices
    });
});

// get list of ip over wide range
app.get('/cidr', (req, res) => {
    let ips= [];
    let IP = ip.address();
    // change cidr notaion to get wide range of ip's ( IP/16 => 65563 ip's )
    const cidr = new IPCIDR(IP+'/23');

    if (!cidr.isValid()) {
        throw new Error('CIDR is invalid');
    }

    cidr.loop(ip => { ips.push(ip) });
    console.log(ips.length); // total ips detected
    res.send(ips);
});

app.get('/', (req, res) => {
   
});
 

var server = app.listen(port,() => console.log(`Server listening on port ${port}!`));
server.timeout = 1000 * 60 * 10;