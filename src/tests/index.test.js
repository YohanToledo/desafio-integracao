const requests = require("../controllers/requests");


test("Divide o nome em primeiro nome e ultimo nome", () => {
    const name = requests.splitName("yohan toledo");
    expect(name).toStrictEqual(["yohan", "toledo"]);
});


test("Verificar dominio do email", () => {
    const dominio = requests.isValidEmailDomain("yohan@gmail.com");
    expect(dominio).toBe(false);

    const dominio1 = requests.isValidEmailDomain("yohan@gmail.com.br");
    expect(dominio1).toBe(false);


    const dominio2 = requests.isValidEmailDomain("yohan@outlook.com.br");
    expect(dominio2).toBe(false);

    const dominio3 = requests.isValidEmailDomain("yohan@hubspot.com.br");
    expect(dominio3).toBe(true);
});
