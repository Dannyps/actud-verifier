import Mustache from "mustache";
import { ACTUD } from "../ACTUD";

// Format the price the locale, style, and currency.
let eur = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
});


export function ACTUD2HTML(actud: ACTUD | null): string {
    let formatCurrency = function () {
        return function (val: string, render: (template: string) => any) {
            return eur.format(render(val));
        };
    };

    let formatDate = function () {
        return function (val: Date, render: (template: Date) => any) {
            return new Date(render(val)).toDateString();
        };
    };

    let isValid = function () {
        return function (val: string, render: (template: string) => any) {
            if (actud?.isValid) {
                return render(val);
            }
            else {
                return "<p>The parsed string could not be mapped to ACTUD fields.</p>";
            }
        };
    };

    let template: string = require('../templates/main.mustache');
    return Mustache.render(template, { actud, formatCurrency, formatDate, isValid });
}
