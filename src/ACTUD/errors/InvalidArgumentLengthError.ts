import { ACTUDBody } from "../ACTUDBody";
import { InvalidArgumentError } from "./InvalidArgumentError";

class InvalidArgumentLengthError extends InvalidArgumentError {

    constructor(badParameter: keyof ACTUDBody, maxLength: number, minLength: number = 0) {
        super(badParameter, `$ can only accept arguments between ${minLength} and ${maxLength} of length.`);
        this.name = "error.invalidArgumentLength";
    }
}

export { InvalidArgumentLengthError };