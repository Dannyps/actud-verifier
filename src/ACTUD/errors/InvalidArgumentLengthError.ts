import { ACTUDBody } from "../ACTUDBody";
import { InvalidArgumentError } from "./InvalidArgumentError";

class InvalidArgumentLengthError extends InvalidArgumentError {

    constructor(badParameter: keyof ACTUDBody, maxLength: number, minLength: number = 0) {
        if (maxLength < minLength) {
            throw new Error("maxLength cannot be less than minLength");
        }

        if (minLength < 0) {
            throw new Error("minLength cannot be less than 0");
        }

        if (maxLength < 0) {
            throw new Error("maxLength cannot be less than 0");
        }

        if (minLength === maxLength) {
            super(badParameter, `can only accept arguments of length ${maxLength}.`);
        } else {
            super(badParameter, `can only accept arguments between ${minLength} and ${maxLength} of length.`);
        }

        this.name = "error.invalidArgumentLength";
    }
}

export { InvalidArgumentLengthError };