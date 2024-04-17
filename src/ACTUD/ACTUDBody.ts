import { GetNameFromInvoiceStatus, InvoiceStatus } from "./InvoiceStatusEnum";
import { GetNameFromInvoiceType, InvoiceType } from "./InvoiceTypesEnum";
import { InvalidArgumentLengthError } from "./errors/InvalidArgumentLengthError";
import { InvalidArgumentError } from "./errors/InvalidArgumentError";
import { validatePortugueseVATNumber } from "./validators/nif";
import { InvalidArgumentCheckError } from "./errors/InvalidArgumentCheckError";
import { ACTUDOptions } from "./ACTUD";
import { Country, ISO3166 } from "./validators/iso-3166";

export class ACTUDBody {

	private _options?: ACTUDOptions;
	constructor(options?: ACTUDOptions) {
		this._options = options;

	}

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
		this._SellerVatNumber = this.CheckValue("SellerVatNumber", value, 9, 9);
		if (validatePortugueseVATNumber(this._SellerVatNumber) === false && !this._options?.ignoreErrors) {
			throw new InvalidArgumentCheckError("SellerVatNumber");
		}
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
	 * Should be filled with "Desconhecido" when the invoice is passed to "Consumidor Final". This is coded as null.
	 * 
	 * See the docs for more info {@link https://files.diariodarepublica.pt/1s/2013/08/16000/0502105047.pdf}
	 * 
	 * max length: **12**
	 * 
	 * code: ***C***
	 */
	private _BuyerCountry: Country;
	public get BuyerCountry(): string {
		return this._BuyerCountry.a2;
	}
	public set BuyerCountry(value: string) {
		if (value.toLocaleLowerCase() == 'Desconhecido'.toLocaleLowerCase()) {
			this._BuyerCountry = null;
		} else {
			this.CheckValue("BuyerCountry", value, 2, 2);
			const iso3166 = new ISO3166();
			this._BuyerCountry = iso3166.findCountryByAlpha2Code(value);
		}
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
		if (this.CheckValue("InvoiceType", value, 2, 2) && Object.values(InvoiceType).includes(value)) {
			this._InvoiceType = InvoiceType[value as keyof typeof InvoiceType];
		} else {
			if (this._options.ignoreErrors) {
				this._InvoiceType = null;
			} else {
				throw new InvalidArgumentError("InvoiceType", value);
			}
		}
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

	/**
	 * *Espaço Fiscal*
	 *  
	 * max length: **5**
	 * 
	 * code: ***I1***
	 */
	private _TaxCountryRegion?: Country;
	public get TaxCountryRegion(): string {
		return this._TaxCountryRegion?.country ?? 'Unknown';
	}
	public set TaxCountryRegion(value: string) {
		if (value == '0') {
			// No caso de documento sem indicação da taxa de IVA, que deva constar na tabela 4.2, 4.3 ou 4.4 do SAF-T(PT), preencher com «0» (I1:0).
			// TODO: add check for other I* fields.
			this._TaxCountryRegion = null;
		} else {
			try {
				this._TaxCountryRegion = new ISO3166().findCountryByAlpha2Code(value);
			} catch (error) {
				if (this._options.ignoreErrors) {
					this._TaxCountryRegion = null;
				} else {
					throw new InvalidArgumentError("TaxCountryRegion", "Invalid country code");
				}
			}

		}
	}

	/**
	 * *Base Tributável Isenta de IVA*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I2***
	 */
	private _VatExtemptTaxableBase?: number;
	public get VatExtemptTaxableBase(): number {
		return this._VatExtemptTaxableBase ?? 0;
	}
	public set VatExtemptTaxableBase(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("VatExtemptTaxableBase", "The value must not be negative.");
		} else {
			this._VatExtemptTaxableBase = valueFloat;
		}
	}

	/**
	 * *Base Tributável à Taxa Reduzida*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I3***
	 */
	private _Vat1Base?: number;
	public get Vat1Base(): number {
		return this._Vat1Base ?? 0;
	}
	public set Vat1Base(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat1Base", "The value must not be negative.");
		} else {
			this._Vat1Base = valueFloat;
		}
	}

	/**
	 * *Total de IVA à Taxa Reduzida*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I4***
	 */
	private _Vat1?: number;
	public get Vat1(): number {
		return this._Vat1 ?? 0.00;
	}
	public set Vat1(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat1", "The value must not be negative.");
		} else {
			this._Vat1 = valueFloat;
		}
	}

	/**
	 * *Base Tributável à Taxa Intermédia*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I5***
	 */
	private _Vat2Base: number;
	public get Vat2Base(): number {
		return this._Vat2Base ?? 0.00;
	}
	public set Vat2Base(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat2Base", "The value must not be negative.");
		} else {
			this._Vat2Base = valueFloat;
		}
	}

	/**
	 * *Total de IVA à Taxa Intermédia*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I6***
	 */
	private _Vat2: number;
	public get Vat2(): number {
		return this._Vat2;
	}
	public set Vat2(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat2", "The value must not be negative.");
		} else {
			this._Vat2 = valueFloat;
		}
	}

	/**
	 * *Base Tributável à Taxa Normal*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I7***
	 */
	private _Vat3Base: number;
	public get Vat3Base(): number {
		return this._Vat3Base;
	}
	public set Vat3Base(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat3Base", "The value must not be negative.");
		} else {
			this._Vat3Base = valueFloat;
		}
	}

	/**
	 * *Total de IVA à Taxa Normal*
	 * 
	 * max Length: 16
	 * 
	 * code: ***I8***
	 */
	private _Vat3: number;
	public get Vat3(): number {
		return this._Vat3;
	}
	public set Vat3(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("Vat3", "The value must not be negative.");
		} else {
			this._Vat3 = valueFloat;
		}
	}

	/**
	 * *Não sujeito / não tributável em IVA*
	 * 
	 * max Length: 16
	 * 
	 * code: ***L***
	 */
	private _NotTaxable: number;
	public get NotTaxable(): number {
		return this._NotTaxable;
	}
	public set NotTaxable(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("NotTaxable", "The value must not be negative.");
		} else {
			this._NotTaxable = valueFloat;
		}
	}

	/**
	 * *Imposto do Selo*
	 * 
	 * max Length: 16
	 * 
	 * code: ***M***
	 */
	private _StampTax: number;
	public get StampTax(): number {
		return this._StampTax;
	}
	public set StampTax(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("StampTax", "The value must not be negative.");
		} else {
			this._StampTax = valueFloat;
		}
	}

	/**
	 * *Total de impostos *
	 * 
	 * max Length: 16
	 * 
	 * code: ***N***
	 */
	private _TaxPayable: number;
	public get TaxPayable(): number {
		return this._TaxPayable;
	}
	public set TaxPayable(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("TaxPayable", "The value must not be negative.");
		} else {
			this._TaxPayable = valueFloat;
		}
	}

	/**
	 * *Total do documento com impostos *
	 * 
	 * max Length: 16
	 * 
	 * code: ***O***
	 */
	private _GrossTotal: number;
	public get GrossTotal(): number {
		return this._GrossTotal;
	}
	public set GrossTotal(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("GrossTotal", "The value must not be negative.");
		} else {
			this._GrossTotal = valueFloat;
		}
	}

	/**
	 * *Retenções na fonte *
	 * 
	 * max Length: 16
	 * 
	 * code: ***P***
	 */
	private _WithholdingTaxAmount: number;
	public get WithholdingTaxAmount(): number {
		return this._WithholdingTaxAmount;
	}
	public set WithholdingTaxAmount(value: string) {
		let valueFloat = parseFloat(value);
		if (valueFloat < 0) {
			throw new InvalidArgumentError("WithholdingTaxAmount", "The value must not be negative.");
		} else {
			this._WithholdingTaxAmount = valueFloat;
		}
	}

	/**
	 * *Hash *
	 * 
	 * max Length: 4
	 * 
	 * code: ***Q***
	 */
	private _Hash: string;
	public get Hash(): string {
		return this._Hash;
	}
	public set Hash(value: string) {
		this._Hash = this.CheckValue("Hash", value, 4);
	}

	/**
	 * *Número do Certificado *
	 * 
	 * max Length: 4
	 * 
	 * code: ***R***
	 */
	private _CertificateNumber: string;
	public get CertificateNumber(): string {
		return this._CertificateNumber;
	}
	public set CertificateNumber(value: string) {
		this._CertificateNumber = this.CheckValue("CertificateNumber", value, 4);
	}

	/**
	 * *Outras Informações *
	 * 
	 * max Length: 65
	 * 
	 * code: ***S***
	 */
	private _Comment: string;
	public get Comment(): string {
		return this._Comment;
	}
	public set Comment(value: string) {
		this._Comment = this.CheckValue("Comment", value, 65);
	}

	private CheckValue(parameter: keyof ACTUDBody, value: string, maxLength: number, minLength: number = 0): string {
		if (value.length > maxLength || value.length < minLength) {
			throw new InvalidArgumentLengthError(parameter, maxLength, minLength);
		}
		return value;
	}
}