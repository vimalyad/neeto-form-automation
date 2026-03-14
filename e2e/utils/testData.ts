import { de, faker } from "@faker-js/faker";
import { FormDetails, Name, SubmissionDetails } from "@poms/form";

export function getMockData() {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        validPhone: process.env.FORM_PHONE_NUMBER!,
    }
}

export function getInvalidEmailAndPhoneNumber(name: Name): FormDetails {
    return {
        email: "invalid.com",
        phoneNumber: "123",
        name
    };
}

export function transformToFormDetails(mockUser: ReturnType<typeof getMockData>): FormDetails {
    return {
        email: mockUser.email,
        phoneNumber: mockUser.validPhone,
        name: {
            firstName: mockUser.firstName,
            lastName: mockUser.lastName
        }
    }
}

export function transformToSubmissionDetails(mockUser: ReturnType<typeof getMockData>): SubmissionDetails {
    const details = transformToFormDetails(mockUser);
    return {
        email: details.email,
        phoneNumber: details.phoneNumber,
        name: `${details.name.firstName} ${details.name.lastName}`
    }
}