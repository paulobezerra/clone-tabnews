import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "path";

export default async function migrations(request, response) {

  const dbClient = await database.getNewClient();

  const migrationRunnerConfig = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    dryRun: true,
    verbose: true,
    migrationsTable: "pgmigrations",
    log: console.log
  };


  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationRunnerConfig);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationRunnerConfig,
      dryRun: false
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  response.status(405).end();
}
