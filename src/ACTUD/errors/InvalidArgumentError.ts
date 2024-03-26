import { ACTUD } from "../ACTUD";

class InvalidArgumentError extends Error {

    constructor(badParameter: keyof ACTUD, message: string) {
        super(`${badParameter} is not valid: ${message}`);
        this.name = "error.invalidArgument";
    }
}

export { InvalidArgumentError };