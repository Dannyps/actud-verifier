import { GetNameFromInvoiceStatus, InvoiceStatus } from "./InvoiceStatusEnum";
import { GetNameFromInvoiceType, InvoiceType } from "./InvoiceTypesEnum";
import { InvalidArgumentLengthError } from "./errors/InvalidArgumentLengthError";
import { InvalidACTUDError } from "./errors/InvalidArgumentLengthError copy";

/**
 * Find docs at {@link https://www.softseguro.pt/Files/ETCODEQR.pdf#page=7}
 */
class ACTUD {

	/**
	 * *NIF do Emitente*
	 * 
	 * max length: **9**
	 * 
	 * code: ***A***
	 */
	private _SellerVatNumber: string;
	public get SellerVatNumber(): string {
		return this._SellerVatNumber;
	}
	public set SellerVatNumber(value: string) {
		this._SellerVatNumber = this.CheckValue("SellerVatNumber", value, 9);;
	}

	/**
	 * *NIF do Adquirente*
	 * 
	 * max length: **30**
	 * 
	 * code: ***B***
	 */
	private _BuyerVatNumber: string;
	public get BuyerVatNumber(): string {
		return this._BuyerVatNumber;
	}
	public set BuyerVatNumber(value: string) {
		this._BuyerVatNumber = this.CheckValue("BuyerVatNumber", value, 30);
	}


	/**
	 * *País do Adquirente*
	 * 
	 * To be filled if known, using the *ISO 3166 — 1-alpha-2* standard.
	 * Should be filled with "Desconhecido" when the invoice is passed to "Consumidor Final".
	 * 
	 * See the docs for more info {@link https://files.diariodarepublica.pt/1s/2013/08/16000/0502105047.pdf}
	 * 
	 * max length: **12**
	 * 
	 * code: ***C***
	 */
	private _BuyerCountry: string;
	public get BuyerCountry(): string {
		return this._BuyerCountry;
	}
	public set BuyerCountry(value: string) {
		this._BuyerCountry = this.CheckValue("BuyerCountry", value, 12);
	}

	/**
	 * *Tipo de Documento*
	 *  
	 * max length: **2**
	 * 
	 * code: ***D***
	 */
	private _InvoiceType: InvoiceType;

	public get InvoiceType(): string {
		return GetNameFromInvoiceType(this._InvoiceType);
	}
	public set InvoiceType(value: string) {
		this._InvoiceType = InvoiceType[this.CheckValue("InvoiceType", value, 2, 2) as keyof typeof InvoiceType];
	}

	/**
	 * *Estado do Documento*
	 *  
	 * max length: **1**
	 * 
	 * code: ***E***
	 */
	private _InvoiceStatus: InvoiceStatus;
	public get InvoiceStatus(): string {
		return GetNameFromInvoiceStatus(this._InvoiceStatus);
	}
	public set InvoiceStatus(value: string) {
		this._InvoiceStatus = InvoiceStatus[this.CheckValue("InvoiceStatus", value, 1, 1) as keyof typeof InvoiceStatus];
	}

	/**
	 * *Data do Documento*
	 * 
	 * max length: **8**
	 * 
	 * code: ***F***
	 * 
	 * format: YYYYMMDD
	 */
	private _InvoiceDate: Date;
	public get InvoiceDate(): Date {
		return this._InvoiceDate;
	}
	public set InvoiceDate(value: string) {
		this.CheckValue("InvoiceDate", value, 8, 8);
		this._InvoiceDate = new Date(`${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`);
	}

	/**
	 * *Identificação Única do Documento*
	 *  
	 * max length: **60**
	 * 
	 * code: ***G***
	 */
	private _InvoiceNo: string;
	public get InvoiceNo(): string {
		return this._InvoiceNo;
	}
	public set InvoiceNo(value: string) {
		this._InvoiceNo = this.CheckValue("InvoiceNo", value, 60);
	}

	/**
	 * *ACTUD*
	 *  
	 * max length: **70**
	 * 
	 * code: ***H***
	 */
	private _ACTUD: string;
	public get ACTUD(): string {
		return this._ACTUD;
	}
	public set ACTUD(value: string) {
		this._ACTUD = this.CheckValue("ACTUD", value, 70);
	}

	constructor(input: string) {
		let dict: Record<string, string> = {};
		let isMissingARequiredValue = false;

		(input.split("*")).forEach(p => {
			let [key, val] = p.split(":", 2);
			dict[key] = val;
		});

		const requiredKeys: Record<string, keyof ACTUD> = {};
		requiredKeys["A"] = "SellerVatNumber";
		requiredKeys["B"] = "BuyerVatNumber";
		requiredKeys["C"] = "BuyerCountry";
		requiredKeys["D"] = "InvoiceType";
		requiredKeys["E"] = "InvoiceStatus";
		requiredKeys["F"] = "InvoiceDate";
		requiredKeys["G"] = "InvoiceNo";
		requiredKeys["H"] = "ACTUD";

		Object.keys(requiredKeys).forEach(key => {
			if (Object.keys(dict).includes(key)) {
				this[requiredKeys[key]] = dict[key];
			} else isMissingARequiredValue = true;
		});

		if (isMissingARequiredValue)
			throw new InvalidACTUDError();

		let template: (body: any) => string = require('./templates/main.mustache');
		this.mustacheOutput = template({ actud: this });
		console.log(this.mustacheOutput);
	}

	private CheckValue(parameter: keyof ACTUD, value: string, maxLength: number, minLength: number = 0): string {
		if (value.length > maxLength) {
			throw new InvalidArgumentLengthError(parameter, maxLength, minLength);
		}
		return value;
	}

	private mustacheOutput: string;
}

export { ACTUD };