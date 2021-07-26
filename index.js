const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: 'password',
   database: 'tracker_DB'
});

connection.connect((err) => {
   if (err) throw err;
   start();
});

function start() {
   inquirer.prompt({
      name:'',
      type:'list',
      message:'',
      choices:[

      ]

   })
}