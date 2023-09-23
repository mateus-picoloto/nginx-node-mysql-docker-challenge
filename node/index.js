const Chance = require('chance');
const chance = new Chance();

const express = require('express');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

const createTableSql = 'CREATE TABLE IF NOT EXISTS people(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY(id))';
connection.query(createTableSql);

const createNewPerson = (connection, chance) => {
    const insertSql = `INSERT INTO people(name) VALUES('${chance.name()}')`;
    connection.query(insertSql);
}

const buildHtmlResponse = (error, result) => {
    if (error) throw error;

    let htmlResponse = '<h1>Full Cycle Rocks!</h1>';
    htmlResponse += '<ul>';

    result.forEach((person) =>  {
        htmlResponse += `<li>${person.name}</li>`;
    })

    htmlResponse += '</ul>';
    return htmlResponse;
}

const sendResponse = (connection, res) => {
    const selectSql = 'SELECT name FROM people';
    connection.query(selectSql, (error, req) => {
        const response = buildHtmlResponse(error, req);
        res.send(response);
    });
}

app.get('/', async (req, res) => {
    createNewPerson(connection, chance);
    sendResponse(connection, res);
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});