import { InvalidACTUDError } from "./errors/InvalidACTUDError";
import { ACTUDBody } from "./ACTUDBody";

/**
 * Find docs at {@link https://www.softseguro.pt/Files/ETCODEQR.pdf#page=7}
 */
class ACTUD {

	private _body: ACTUDBody;

	public get body(): ACTUDBody {
		return this._body;
	}

	private readonly _rawInput: string;
	public get rawInput(): string {
		return this._rawInput;
	}
	private set rawInput(_: string) { }

	private _isValid: boolean;
	public get isValid(): boolean {
		return this._isValid;
	}

	constructor(input: string, options: (ACTUDOptions | null) = null) {
		this._body = new ACTUDBody(options);

		this._rawInput = input;
		let dict: Record<string, string> = {};
		let isMissingARequiredValue = false;

		(input.split("*")).forEach(p => {
			let [key, val] = p.split(":", 2);
			dict[key] = val;
		});

		const requiredKeys: Record<string, keyof ACTUDBody> = {};
		requiredKeys["A"] = "SellerVatNumber";
		requiredKeys["B"] = "BuyerVatNumber";
		requiredKeys["C"] = "BuyerCountry";
		requiredKeys["D"] = "InvoiceType";
		requiredKeys["E"] = "InvoiceStatus";
		requiredKeys["F"] = "InvoiceDate";
		requiredKeys["G"] = "InvoiceNo";
		requiredKeys["H"] = "ACTUD";
		requiredKeys["I1"] = "TaxCountryRegion";
		requiredKeys["N"] = "TaxPayable";
		requiredKeys["O"] = "GrossTotal";


		const optionalKeys: Record<string, keyof ACTUDBody> = {};
		optionalKeys["I2"] = "VatExtemptTaxableBase";
		optionalKeys["I3"] = "Vat1Base";
		optionalKeys["I4"] = "Vat1";
		optionalKeys["I5"] = "Vat2Base";
		optionalKeys["I6"] = "Vat2";
		optionalKeys["I7"] = "Vat3Base";
		optionalKeys["I8"] = "Vat3";
		optionalKeys["L"] = "NotTaxable";
		optionalKeys["M"] = "StampTax";
		optionalKeys["P"] = "WithholdingTaxAmount";
		optionalKeys["Q"] = "Hash";
		optionalKeys["R"] = "CertificateNumber";
		optionalKeys["S"] = "Comment";

		Object.keys(requiredKeys).forEach(key => {
			if (Object.keys(dict).includes(key)) {
				this._body[requiredKeys[key]] = dict[key];
			} else isMissingARequiredValue = true;
		});

		Object.keys(optionalKeys).forEach(key => {
			if (Object.keys(dict).includes(key)) {
				this.body[optionalKeys[key]] = dict[key];
			}
		});

		if (isMissingARequiredValue) {
			this._isValid = false;
			if (!options?.ignoreErrors)
				throw new InvalidACTUDError(Object.keys(requiredKeys), Object.keys(dict));
		}
		else {
			this._isValid = true;
		}
	}



}
interface ACTUDOptions {
	/**
	 * Will parse the received input and create an object, although it may be invalid. Use with caution.
	 */
	ignoreErrors: boolean;
}

export { ACTUD, ACTUDOptions };