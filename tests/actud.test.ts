import { ACTUD } from "../src/ACTUD/ACTUD";
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

describe('testing ACTUD class with too long A field', () => {
    const t = () => new ACTUD("A:9999999904857*B:100000061*C:PT*D:FT*E:N*F:20201123*G:FAC 1/19*H:0*I1:PT*I7:17.90*I8:4.12*N:4.12*O:22.02*Q:LJT/*R:2648");

    test('fields are parsed correctly', () => {
        expect(t).toThrow(new InvalidArgumentLengthError("SellerVatNumber", 9));
    });
});