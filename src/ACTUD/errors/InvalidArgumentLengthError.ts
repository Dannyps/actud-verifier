import { ACTUD } from "../ACTUD";

class InvalidArgumentLengthError extends Error {

    constructor(parameter: keyof ACTUD, maxLength: number, minLength: number = 0) {
        super(`${parameter} can only accept arguments between ${minLength} and ${maxLength} of length.`);
        this.name = "error.invalidArgumentLength";
    }
}

export { InvalidArgumentLengthError };