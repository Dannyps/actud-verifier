import { ACTUD } from "../ACTUD";

class InvalidArgumentLengthError extends Error {

    constructor(badParameter: keyof ACTUD, maxLength: number, minLength: number = 0) {
        super(`${badParameter} can only accept arguments between ${minLength} and ${maxLength} of length.`);
        this.name = "error.invalidArgumentLength";
    }
}

export { InvalidArgumentLengthError };