import { ACTUD } from "../ACTUD";

export function ACTUD2HTML(actud: ACTUD): string {
    let template: (body: any) => string = require('./templates/main.mustache');
    return template({ actud });
}
