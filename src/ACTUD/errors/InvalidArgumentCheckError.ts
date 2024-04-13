import { ACTUDBody } from "../ACTUDBody";
import { InvalidArgumentError } from "./InvalidArgumentError";

class InvalidArgumentCheckError extends InvalidArgumentError {

    constructor(badParameter: keyof ACTUDBody) {
        super(badParameter, `does not respect the required format.`);
        this.name = "error.invalidArgumentCheck";
    }
}

export { InvalidArgumentCheckError };