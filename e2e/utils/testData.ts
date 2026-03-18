import { faker } from "@faker-js/faker";
import { Name } from "@poms/form";

export function getMockData() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    validPhone: process.env.FORM_PHONE_NUMBER!,
  };
}

export function transformToName(firstName: string, lastName: string): Name {
  return {
    firstName: firstName,
    lastName: lastName,
  };
}

export function transformToFullName(
  firstName: string,
  lastName: string,
): string {
  return `${firstName} ${lastName}`;
}

export function generatePassword() {
  return faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz", 6);
}
