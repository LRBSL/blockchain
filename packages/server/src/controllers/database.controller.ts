import * as mysql from 'mysql';
import { database_config } from '../config';

var connection = null;

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

// getting authentication user data
export async function getAuthUser(userName: string, passwd: string) {
    let promise = new Promise((resolve, reject) => {
        handleDisconnect();
        var query = "SELECT * FROM users WHERE username LIKE '" + userName + "' AND passwd LIKE '" + passwd + "' LIMIT 1";
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
