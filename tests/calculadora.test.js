const calculadora = require('../models/calculadora');

test("Teste de soma", () => {
  var resultado = calculadora.somar(2, 2);
  expect(resultado).toBe(4);
});