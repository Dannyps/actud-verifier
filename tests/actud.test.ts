import { ACTUD } from "../src/ACTUD/ACTUD";
import { InvalidArgumentCheckError } from "../src/ACTUD/errors/InvalidArgumentCheckError";
import { InvalidArgumentLengthError } from "../src/ACTUD/errors/InvalidArgumentLengthError";

describe('testing ACTUD class with valid string', () => {
    let actud = new ACTUD("A:999999990*B:100000061*C:PT*D:FT*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648");

    test('fields are parsed correctly', () => {
        expect(parseInt(actud.body.SellerVatNumber)).toBe(999999990);
        expect(parseInt(actud.body.BuyerVatNumber)).toBe(100000061);
        expect(actud.body.BuyerCountry).toBe("PT");
        expect(actud.body.InvoiceType).toBe("Fatura");
        expect(actud.body.InvoiceStatus).toBe("Normal");
        expect(actud.body.InvoiceDate).toEqual(new Date("2020/11/23"));
        expect(actud.body.InvoiceNo).toBe("FAC 1/19");
        expect(actud.body.ACTUD).toBe("0");

    });
});

describe('Invalid A field', () => {
    const t = (aValue: string) => () => new ACTUD(`A:${aValue}*B:100000061*C:PT*D:FT*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648`);

    test('field too long leads to a thrown exception', () => {
        expect(t("9254162350")).toThrow(new InvalidArgumentLengthError("SellerVatNumber", 9, 9));
    });

    test('field too short leads to a thrown exception', () => {
        expect(t("45612378")).toThrow(new InvalidArgumentLengthError("SellerVatNumber", 9, 9));
    });

    test('invalid field leads to a special thrown exception', () => {
        expect(t("592001260")).toThrow(new InvalidArgumentCheckError("SellerVatNumber"));
    });
});

describe('Invalid B field', () => {
    const t = (bValue: string) => () => new ACTUD(`A:999999990*B:${bValue}*C:PT*D:FT*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648`);

    test('field too long leads to a thrown exception', () => {
        expect(t("456875484651234875936521754678546")).toThrow(new InvalidArgumentLengthError("BuyerVatNumber", 30));
    });
});

describe('Invalid C field', () => {
    const t = (cValue: string) => () => new ACTUD(`A:999999990*B:100000061*C:${cValue}*D:FT*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648`);

    test('field too long leads to a thrown exception', () => {
        expect(t("PRT")).toThrow(new InvalidArgumentLengthError("BuyerCountry", 2, 2));
    });

    test('field too short leads to a thrown exception', () => {
        expect(t("P")).toThrow(new InvalidArgumentLengthError("BuyerCountry", 2, 2));
    });

    test('invalid field leads to a special thrown exception', () => {
        expect(t("ZY")).toThrow(new InvalidArgumentCheckError("BuyerCountry"));
    });
});

describe('Invalid D field', () => {
    const t = (dValue: string) => () => new ACTUD(`A:999999990*B:100000061*C:PT*D:${dValue}*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648`);

    test('field too long leads to a thrown exception', () => {
        expect(t("FTR")).toThrow(new InvalidArgumentLengthError("InvoiceType", 2, 2));
    });

    test('field too short leads to a thrown exception', () => {
        expect(t("F")).toThrow(new InvalidArgumentLengthError("InvoiceType", 2, 2));
    });

    test('invalid field leads to a special thrown exception', () => {
        expect(t("ZZ")).toThrow(new InvalidArgumentCheckError("InvoiceType"));
    });
});

describe('Invalid E field', () => {
    const t = (eValue: string) => () => new ACTUD(`A:999999990*B:100000061*C:PT*D:FT*E:${eValue}*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648`);

    test('field too long leads to a thrown exception', () => {
        expect(t("Normal")).toThrow(new InvalidArgumentLengthError("InvoiceStatus", 1, 1));
    });

    test('field too short leads to a thrown exception', () => {
        expect(t("")).toThrow(new InvalidArgumentLengthError("InvoiceStatus", 1, 1));
    });

    test('invalid field leads to a special thrown exception', () => {
        expect(t("X")).toThrow(new InvalidArgumentCheckError("InvoiceStatus"));
    });
});