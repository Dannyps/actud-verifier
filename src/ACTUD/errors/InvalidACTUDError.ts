import { ACTUD } from "../ACTUD";

class InvalidACTUDError extends Error {

    constructor() {
        super(`The input argument is not a valid ACTUD.`);
        this.name = "error.invalidACTUD";
    }
}

export { InvalidACTUDError };