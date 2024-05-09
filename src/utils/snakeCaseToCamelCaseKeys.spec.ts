import snakeCaseToCamelCaseKeys from "./snakeCaseToCamelCaseKeys.ts";

describe("snakeCaseToCamelCaseKeys", () => {
  it("should convert snake_case keys to camelCase keys", () => {
    const obj = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john.doe@gmail.com",
    };

    const result = snakeCaseToCamelCaseKeys(obj);

    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john.doe@gmail.com",
    });
  });
});
