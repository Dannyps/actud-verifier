import { InvalidACTUDError } from "./errors/InvalidACTUDError";
import { ACTUDBody } from "./ACTUDBody";

/**
 * Find docs at {@link https://www.softseguro.pt/Files/ETCODEQR.pdf#page=7}
 */
class ACTUD {

	private _body: ACTUDBody;

	private requiredKeys: Record<string, keyof ACTUDBody> = {
		"A": "SellerVatNumber",
		"B": "BuyerVatNumber",
		"C": "BuyerCountry",
		"D": "InvoiceType",
		"E": "InvoiceStatus",
		"F": "InvoiceDate",
		"G": "InvoiceNo",
		"H": "ACTUD",
		"I1": "TaxCountryRegion",
		"N": "TaxPayable",
		"O": "GrossTotal"
	};

	private optionalKeys: Record<string, keyof ACTUDBody> = {
		"I2": "VatExtemptTaxableBase",
		"I3": "Vat1Base",
		"I4": "Vat1",
		"I5": "Vat2Base",
		"I6": "Vat2",
		"I7": "Vat3Base",
		"I8": "Vat3",
		"L": "NotTaxable",
		"M": "StampTax",
		"P": "WithholdingTaxAmount",
		"Q": "Hash",
		"R": "CertificateNumber",
		"S": "Comment"
	};

	public get body(): ACTUDBody {
		return this._body;
	}

	private readonly _rawInput: string;
	private _regeneratedInput: string | undefined = undefined;
	public get rawInput(): string {
		return this._rawInput;
	}

	public get regeneratedInput(): string {
		return this._regeneratedInput ?? this._rawInput;
	}

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

		Object.keys(this.requiredKeys).forEach(key => {
			if (Object.keys(dict).includes(key))
				(this._body as any)[this.requiredKeys[key]] = dict[key];
			else
				isMissingARequiredValue = true;
		});

		Object.keys(this.optionalKeys).forEach(key => {
			if (Object.keys(dict).includes(key))
				(this.body as any)[this.optionalKeys[key]] = dict[key];
		});

		if (isMissingARequiredValue) {
			this._isValid = false;
			if (!options?.ignoreErrors)
				throw new InvalidACTUDError(Object.keys(this.requiredKeys), Object.keys(dict));
		}
		else {
			this._isValid = true;
		}
	}

	public regenerateRaw(): boolean {
		var b = this.body;
		let raw = `A:${b.SellerVatNumber}*`;
		raw += `B:${b.BuyerVatNumber}*`;
		raw += `C:${b.BuyerCountry}*`;
		raw += `D:${b.InvoiceTypeCode}*`;
		raw += `E:${b.InvoiceStatusCode}*`;
		raw += `F:${b.InvoiceDate.toISOString().split("T")[0].replace(/-/g, "")}*`;
		raw += `G:${b.InvoiceNo}*`;
		raw += `H:${b.ACTUD}*`;
		raw += `I1:${b.TaxCountryRegionCode}*`;
		// values formatted with 2 decimal places
		if (b.VatExtemptTaxableBase) raw += `I2:${b.VatExtemptTaxableBase.toFixed(2)}*`;
		if (b.Vat1Base) raw += `I3:${b.Vat1Base.toFixed(2)}*`;
		if (b.Vat1) raw += `I4:${b.Vat1.toFixed(2)}*`;
		if (b.Vat2Base) raw += `I5:${b.Vat2Base.toFixed(2)}*`;
		if (b.Vat2) raw += `I6:${b.Vat2.toFixed(2)}*`;
		if (b.Vat3Base) raw += `I7:${b.Vat3Base.toFixed(2)}*`;
		if (b.Vat3) raw += `I8:${b.Vat3.toFixed(2)}*`;
		if (b.NotTaxable) raw += `L:${b.NotTaxable.toFixed(2)}*`;
		if (b.StampTax) raw += `M:${b.StampTax.toFixed(2)}*`;
		raw += `N:${b.TaxPayable.toFixed(2)}*`;
		raw += `O:${b.GrossTotal.toFixed(2)}*`;
		if (b.WithholdingTaxAmount) raw += `P:${b.WithholdingTaxAmount.toFixed(2)}*`;
		raw += `Q:${b.Hash}*`;
		raw += `R:${b.CertificateNumber}`;
		if (b.Comment) raw += `*S:${b.Comment}`;
		this._regeneratedInput = raw;
		return true;
	}
}
interface ACTUDOptions {
	/**
	 * Will parse the received input and create an object, although it may be invalid. Use with caution.
	 */
	ignoreErrors: boolean;
}

export { ACTUD, ACTUDOptions };