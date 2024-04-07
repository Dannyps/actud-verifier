import { ACTUD } from "../ACTUD";

class InvalidACTUDError extends Error {

    constructor(requiredKeys: string[], receivedKeys: string[]) {
        let missingKeys = requiredKeys.filter(x => !receivedKeys.includes(x));
        super(`The input argument is not a valid ACTUD because the following keys are missing: ${missingKeys.join(", ")}.`);
        this.name = "error.invalidACTUD";
    }
}

export { InvalidACTUDError };