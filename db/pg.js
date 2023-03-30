import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: "postgres://fqhvxcso:GKQaKKdTZ6cQBaq5qIG4v-13V_rtrEkq@trumpet.db.elephantsql.com/fqhvxcso"
})

export default pool;