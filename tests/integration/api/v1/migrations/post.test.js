import database from "infra/database.js"

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function getMigrations() {
  return (await database.query("SELECT * FROM pgmigrations ORDER BY name")).rows;
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should returns 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const rows = await getMigrations();

  expect(responseBody.length).toBe(rows.length);

  for (let i = 0; i < responseBody.length; i++) {
    expect(responseBody[i].name).toBe(rows[i].name);
  }

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const responseBody2 = await response2.json();

  expect(Array.isArray(responseBody2)).toBe(true);
  expect(responseBody2.length).toBe(0);
});
