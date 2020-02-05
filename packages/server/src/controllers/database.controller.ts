import * as mysql from 'mysql';
import { database_config } from '../config';
import { AuthUser } from '../models/auth_user';

var connection = null;

// handle database disconnection
export function handleDisconnect() {
    connection = mysql.createConnection(database_config);

    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

// get authentication user data
export async function getAuthUser(username: string, passwd: string) {
    let promise = new Promise((resolve, reject) => {
        handleDisconnect();
        var query = "SELECT * FROM users WHERE username LIKE '" + username + "' AND passwd LIKE '" + passwd + "' LIMIT 1";
        connection.query(query, function (err, resultUser) {
            if (err || resultUser.length == 0) {
                reject(err);
            } else {
                resolve(resultUser[0]);
            }
        });
        connection.end();
    });
    return promise;
}

// generate authentication user identity name
export async function generateAuthUserIdentityName(identityOrg: string) {
    let promise = new Promise((resolve, reject) => {
        handleDisconnect();
        var query = "SELECT identityName FROM users WHERE identityOrg LIKE '" + identityOrg + "' ORDER BY identityName DESC LIMIT 1";
        connection.query(query, function (err, resultUser) {
            if (err || resultUser.length == 0) {
                reject(err);
            } else {
                let userIdentityName: string = resultUser[0].identityName;
                userIdentityName = "user" + (parseInt(userIdentityName.substr(4)) + 1);
                resolve(userIdentityName);
            }
        });
        connection.end();
    });
    return promise;
}

// save authentication user data
export async function setAuthUser(authUser: AuthUser) {
    let promise = new Promise((resolve, reject) => {
        handleDisconnect();
        var query = "INSERT INTO users(username,passwd,identityName,identityOrg) values (" +
            "'" + authUser.username + "'," +
            "'" + authUser.passwd + "'," +
            "'" + authUser.identityName + "'," +
            "'" + authUser.identityOrg + "')";

        connection.beginTransaction(function (err) {
            if (err) { reject(err); }
            insertSql(query).then((result) => {
                connection.commit(function (err) {
                    if (err) {
                        connection.rollback();
                        reject(err);
                    }
                    console.log('Transaction Complete.');
                    resolve(result);
                });
                connection.end();
            }).catch((err) => {
                connection.rollback();
                reject(err);
                connection.end();
            })
        });
    });
    return promise;
}

// delete user record
export async function deleteAuthUser(username: string) {
    let promise = new Promise((resolve, reject) => {
        handleDisconnect();
        var query = "DROP FROM users WHERE username LIKE '" + username + "'";
        connection.query(query, function (err, resultUser) {
            if (err || resultUser.length == 0) {
                reject(err);
            } else {
                resolve(resultUser);
            }
        });
        connection.end();
    });
    return promise;
}

// private function for insertion
function insertSql(query: string) {
    let promise = new Promise((resolve, reject) => {
        connection.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return promise;
}
