const {
    DATABASE_NAME,
    TABLE_NAME,
    APPROVED_TABLE_NAME,
    ADMINS_TABLE_NAME,
    DATABASE_HOST,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
} = require("../utils/constants");
const mysql = require("mysql");

const connection = mysql.createPool({
    user: "b3365554da4771",
    database_url:
        "mysql://b3365554da4771:39e70696@eu-cdbr-west-02.cleardb.net/heroku_c37f37357b31eb0?reconnect=true",
    host: "eu-cdbr-west-02.cleardb.net",
    password: "39e70696",
    port: 3306,
    database: "heroku_c37f37357b31eb0",
});

function DATABASE() {
    return {
        SELECTALL: async () => {
            const query = `SELECT * from ${TABLE_NAME}`;
            try {
                const data = await new Promise((resolve, reject) => {
                    connection.query(query, null, (err, data) => {
                        resolve(data);
                        if (err) {
                            reject(err);
                        }
                    });
                });
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        SELECTALL_APPROVED: async () => {
            const query = `SELECT * from ${APPROVED_TABLE_NAME}`;
            try {
                const data = await new Promise((resolve, reject) => {
                    connection.query(query, null, (err, data) => {
                        resolve(data);
                        if (err) {
                            reject(err);
                        }
                    });
                });
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        INSERT: async function (name, comment) {
            const query = `INSERT INTO ${TABLE_NAME} (name, comment, date) VALUES(?, ?, ?)`;
            try {
                const data = await new Promise((resolve, reject) => {
                    connection.query(query, [name, comment, Date.now()], async (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(await this.SELECTALL_APPROVED());
                        }
                    });
                });
                return data;
            } catch (error) {
                console.log();
            }
        },
        DELETE: async function (id) {
            const delete_from_comments_query = `DELETE FROM ${TABLE_NAME} WHERE id=?`;
            const delete_from_approved_comments_query = `DELETE FROM ${APPROVED_TABLE_NAME} WHERE id=?`;
            try {
                const delete_from_comments_operation = new Promise((res, rej) => {
                    connection.query(delete_from_comments_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });
                const delete_from_approved_comments_operation = new Promise((res, rej) => {
                    connection.query(delete_from_approved_comments_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });

                const result = await Promise.all([
                    delete_from_comments_operation,
                    delete_from_approved_comments_operation,
                ]);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        APPROVE: async function (id) {
            const move_query = `INSERT INTO ${APPROVED_TABLE_NAME} SELECT * FROM ${TABLE_NAME} WHERE id=?`;
            const delete_query = `DELETE FROM ${TABLE_NAME} WHERE id=?`;
            try {
                const move_operation = await new Promise((res, rej) => {
                    connection.query(move_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });

                const delete_operation = await new Promise((res, rej) => {
                    connection.query(delete_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        UNAPPROVE: async function (id) {
            const move_query = `INSERT INTO ${TABLE_NAME} SELECT * FROM ${APPROVED_TABLE_NAME} WHERE id=?`;
            const delete_query = `DELETE FROM ${APPROVED_TABLE_NAME} WHERE id=?`;
            try {
                const move_operation = await new Promise((res, rej) => {
                    connection.query(move_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });

                const delete_operation = await new Promise((res, rej) => {
                    connection.query(delete_query, id, (err, data) => {
                        if (err) rej(err);
                        else res(data);
                    });
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        AUTHENTICATE: async (username, password) => {
            const query = `SELECT * FROM ${ADMINS_TABLE_NAME} WHERE username=?`;

            try {
                const response = await new Promise((res, rej) => {
                    connection.query(query, [username], (err, data) => {
                        if (err) {
                            rej(err);
                        } else res(data);
                    });
                });
                return response;
            } catch (error) {
                console.log(error);
            }
        },
    };
}

module.exports = {
    connection,
    DATABASE,
};
