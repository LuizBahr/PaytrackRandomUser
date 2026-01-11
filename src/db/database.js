import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar no SQLite:", err.message);
    } else {
        console.log("SQLite conectado com Sucesso");
    }
});

function isISODate(value) {
    return (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)
    );
}

function inferSQLiteType(value) {
    if (value === null || value === undefined) return "TEXT";

    if (typeof value === "number") {
        return Number.isInteger(value) ? "INTEGER" : "REAL";
    }

    if (typeof value === "boolean") return "INTEGER";

    if (isISODate(value)) return "DATETIME";

    return "TEXT";
}

export function createTableFromObject(tableName, obj) {
    const columns = Object.entries(obj)
        .map(([key, value]) => {
            const type = inferSQLiteType(value);

            const unique = key === "email" ? " UNIQUE" : "";

            return `"${key}" ${type}${unique}`;
        })
        .join(", ");

    const sql = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ${columns}
        )
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export function upsertFromObject(tableName, obj) {
    const columns = Object.keys(obj);
    const values = Object.values(obj);

    const columnNames = columns.map(c => `"${c}"`).join(", ");
    const placeholders = columns.map(() => "?").join(", ");

    // campos que serão atualizados (exceto email)
    const updateSet = columns
        .filter(c => c !== "email")
        .map(c => `"${c}" = excluded."${c}"`)
        .join(", ");

    const sql = `
        INSERT INTO ${tableName} (${columnNames})
        VALUES (${placeholders})
        ON CONFLICT(email)
        DO UPDATE SET
            ${updateSet}
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, values, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export function existsByEmail(tableName, email) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT 1 FROM ${tableName} WHERE email = ? LIMIT 1`,
            [email],
            (err, row) => {
                if (err) reject(err);
                else resolve(!!row);
            }
        );
    });
}

export default db;