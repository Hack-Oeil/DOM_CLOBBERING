// connexion
const { getDbConnection } = require("./db.js");


exports.add = async (username, email, hash, github, apikey) => {
    const db = await getDbConnection();
    const sql = `INSERT INTO users (username, email, password, githublink, apikey, roles) VALUES (?, ?, ?, ?, ?, ?)`;
    const roles = JSON.stringify(['USER']); 
    return await db.query(sql, [username, email, hash, github, apikey, roles]);
};

exports.getByUsername = async (username) => {
    const db = await getDbConnection();
    const sql = `SELECT * FROM users WHERE username = ?`;

    const users = await db.query(sql, [username]);

    if (users.length > 0) {
        if(users[0] && users[0][0]) {
            return users[0][0];
        }
    }
    throw new Error("NO USER");
};

exports.changeGithubLink = async (username, github) => {
    const db = await getDbConnection();
    const sql = `UPDATE users SET githublink=? WHERE username=?`;
    return await db.query(sql, [github, username]);
};

exports.activeAccount = async (username) => {
    const db = await getDbConnection();
    const sql = `UPDATE users SET activated="1" WHERE username=?`;
    return await db.query(sql, [username]);
};

exports.isAdminByApiKey = async (apikey) => {
    const db = await getDbConnection();
    const sql = `SELECT roles FROM users WHERE apikey = ?`;
    const users = await db.query(sql, [apikey]);
    if (users.length > 0) {
        if(users[0] && users[0][0]) {
            return users[0][0].roles.includes('ADMIN');
        }
    }
    return false;
};