const { response } = require('express');
const express = require('express');
const Shell = require('node-powershell');

const app = express()
const port = 5000


const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

const command = `wmic product get name,identifyingnumber,installdate,vendor,version /format:htable`;

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
 

var server = app.listen(port,() => console.log(`Server listening on port ${port}!`));
server.timeout = 1000 * 60 * 10;