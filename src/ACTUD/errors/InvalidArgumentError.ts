import { ACTUDBody } from "../ACTUDBody";

class InvalidArgumentError extends Error {

    constructor(badParameter: keyof ACTUDBody, message: string) {
        super(`${badParameter} is not valid: ${message}`);
        this.name = "error.invalidArgument";
    }
}

export { InvalidArgumentError };