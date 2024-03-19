/**
 * Docs: {@link https://micromix.pt/micromix_v3/Documentos/SAFT-PT/SAFT-PT_Evolu%C3%A7%C3%A3o_codigos_Doc_Fatura%C3%A7%C3%A3o.pdf}
 */
enum InvoiceType {
    FT,
    FR,
    FS,
    NC,
    ND,
    /* Transport Documents */
    GR,
    GT,
    GA,
    GC,
    GD,
    /* Checking Documents */
    CM,
    FC,
    CC,
    FO,
    OR,
    PF,
    NE,
    OU,
    /* Receipts delivered to customers */
    RC,
    RG,
    /* Insurance types */
    RP,
    RE,
    CS,
    LD,
    RA
}

const invoiceTypeNames: Record<InvoiceType, string> = {
    [InvoiceType.FT]: "Fatura",
    [InvoiceType.FR]: "Fatura-Recibo",
    [InvoiceType.FS]: "Fatura Simplificada",
    [InvoiceType.NC]: "Nota de Crédito",
    [InvoiceType.ND]: "Nota de Débito",
    [InvoiceType.GR]: "Guia de Remessa",
    [InvoiceType.GT]: "Guia de Transporte",
    [InvoiceType.GA]: "Guia de Movimentação de Ativos Próprios",
    [InvoiceType.GC]: "Guia de Consignação",
    [InvoiceType.GD]: "Guia ou Nota de Devolução Efetuada pelo Cliente",
    [InvoiceType.CM]: "Consulta de Mesa",
    [InvoiceType.FC]: "Fatura de Consignação",
    [InvoiceType.CC]: "Crédito de Correção",
    [InvoiceType.FO]: "Folha de Obra",
    [InvoiceType.OR]: "Orçamento",
    [InvoiceType.PF]: "Pró-forma",
    [InvoiceType.NE]: "Nota de Encomenda",
    [InvoiceType.OU]: "Outros",
    [InvoiceType.RC]: "Recibo - Regime de IVA de Caixa",
    [InvoiceType.RG]: "Recibo Geral",
    [InvoiceType.RP]: "Prémio Ou Recibo de Prémio",
    [InvoiceType.RE]: "Estorno ou Recibo de Estorno",
    [InvoiceType.CS]: "Imputação a Cosseguradoras",
    [InvoiceType.LD]: "Imputação a Cosseguradora Líder",
    [InvoiceType.RA]: "Resseguro Aceite",
};

function GetNameFromInvoiceType(invoiceType: InvoiceType): string {
    return invoiceTypeNames[invoiceType] || "Unknown";

}

export { InvoiceType, GetNameFromInvoiceType };