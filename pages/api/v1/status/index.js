import database from "infra/database";

async function status(request, response) {

  const databaseVersionResolve = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResolve.rows[0].server_version;

  const databaseMaxConnectionsResolve = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue = parseInt(databaseMaxConnectionsResolve.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenedConnectionsResolve = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
    values: [databaseName]
  });
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResolve.rows[0].count;

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue
      }
    },
  })
}

export default status;