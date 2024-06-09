const mySql = require('mysql');

const con = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '24525',
    database: 'projectData'
})

con.connect((err) => {
    if(err)
        {
            console.warn(err);
        }
    else
    {
        console.warn("connected with DataBase");
    }
})

module.exports = con;