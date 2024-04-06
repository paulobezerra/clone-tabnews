import database from "infra/database.js"

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function getMigrations() {
  return (await database.query("SELECT * FROM pgmigrations ORDER BY name")).rows;
}

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should returns 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const rows = await getMigrations();

  expect(rows.length).toBe(0);
});
