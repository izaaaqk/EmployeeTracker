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
      name:'Selection',
      type:'list',
      message:'What would you like to do?',
      choices:[
         "View All Employees",
         "View Department",
         "View role",
         "Add Employee",
         "Add Department",
         "Add Role",
         "Update Role",
      ]
   }).then(switch(answer){
      case 'View All Employees': viewAll();
      break;
      case 'View Department': viewDepartment();
      break;
      case 'View role': viewRole();
      break;
      case 'Add Employee': addEmployee();
      break;
      case 'Add Department': addDepartment();
      break;
      case 'Add Role': addRole();
      break
      case 'Update Role': updateRole();
      break
      default:connection.end();
   });
};
function viewAll() {
   connection.query(
       'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id,  department_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id',
       function (err,res) {
          if (err) throw err;
          cTable(res);
          start();
       }
   );
};
function viewRole(){
   connection.query(
      'SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id',
      function (err,res) {
         if (err) throw err;
         cTable(res);
         start();
      }
   );
};
function viewDepartment() {
   connection.query('SELECT * FROM department'),
       function (err,res) {
          if (err) throw err;
          cTable(res);
          start();
       }
   );
};

const roleChoice = [];
const employeeChoice = [];
const departmentChoice = [];

function searchRole() {
   connection.query('SELECT * FROM role', function(err, data){
      if (err) throw err;
      for (i = 0; i < data.length; i++) {
         roleChoice.push(data[i] + '-' + data[i].title)
      }
   })
};

function searchEmployee() {
   connection.query('SELECT * FROM employee', function (err, data) {
      if (err) throw err;
      for(i = 0; i < data.length; i++) {
         employeeChoice.push(data[i].id + '-' + data[i].first_name+" "+ data[i].last_name)
      }
   })
};

function searchDepartment() {
   connection.query('SELECT * FROM department', function (err, data){
      if(err) throw err;
      for (i = 0; i < data.length; i++) {
         departmentChoice.push(data[i].id + '-' + data[i].name)
      }
   })
};

function addEmployee() {

   searchEmployee();
   searchRole();

   inquirer.prompt([
      {

         name: "firstname",
         type: "input",
         message: "What is the employee's first name?"
      },

      {
         name: "lastname",
         type: "input",
         message: "What is the employee's last name?"
      },

      {
         name: "role",
         type: "list",
         message: "What is the employee's role?",
         choices: roleChoice
      },

      {
         name: "reportingTo",
         type: "list",
         message: "Who is the employee's manager?",
         choices: employeeChoice
      }
   ]).then(function(answer) {
      const getRoleId = answer.split('-');
      const getReportingToId = answer.reportingTo.split('-');
      const query =
          'INSERT INTO employee (first_name, last_name, role_id, manager_id)
           VALUES (`${answer.first_name}`, `${answer.last_name}`, `${getRoleId[0]}`,`${getReportingToId[0]}`)';
          connection.query(query, function (err, res) {
             console.log(`new employee ${answer.first_name} ${answer.last_name} added!`)
          });
      start();
   });
};

function addRole() {
   searchRole();
   searchEmployee();
   searchDepartment();

   inquirer.prompt([
      {
         name: "role",
         type: "input",
         message: "Enter the role you would like to add:"
      },

      {
         name: "dept",
         type: "list",
         message: "In what department would you like to add this role?",
         choices: departmentChoice
      },

      {
         name: "salary",
         type: "number",
         message: "Enter the role's salary:"
      },
   ]).then(function (answer) {
      console.log(`${answer.role}`);
      const getDepartmentId = answer.dept.split('-');
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (`${answer.role}`,`${answer.salary}`,`${getDepartmentId[0]}`)';
      connection.query(query, function (err, res) {
         console.log(`<br>--- new role ${answer.role} added!---`);
      });
      start();
   });
};

function updateRole() {
   connection.query('SELECT * FROM employee', function (err, res) {
      if (err) throw (err);
      inquirer.prompt([
         {
            name: "employeeName",
            type: "list",

            message: "Which employee's role is changing?",
            choices: function () {
               var employeeArray = [];
               result.forEach(result => {
                  employeeArray.push(
                      result.last_name
                  );
               })
               return employeeArray;
            }
         }
      ]).then (function (answer) {
         console.log(answer);
         const name = answer.employeeName;
         connection.query('SELECT * FROM role', function (err,res){
            inquirer.prompt([
               {
                  name: "role",
                  type: "list",
                  message: "What is their new role?",
                  choices: function () {
                     var roleArray = [];
                     res.forEach(res => {
                        roleArray.push(
                            res.title)
                     })
                     return roleArray;
                  }
               }
            ]).then(function (roleAnswer) {
               const role = roleAnswer.role;
               console.log(role);
               connection.query('SELECT * FROM role WHERE title = ?', [role], function (err, res) {
                  if (err) throw (err);
                  let roleId = res[0].id;

                  let query = "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name]

                  connection.query(query, values,
                      function (err, res, fields) {
                         console.log(`You have updated ${name}'s role to ${role}.`)
                      })
                  viewAll();   
            ])
         })
      })
   })
}