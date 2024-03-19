/**
 * docs: {@link https://files.dre.pt/1s/2013/08/16000/0502105047.pdf}
 */
enum InvoiceStatus { N, S, A, R, F }

const invoiceStatusNames: Record<InvoiceStatus, string> = {
    [InvoiceStatus.N]: "Normal",
    [InvoiceStatus.S]: "Autofaturação",
    [InvoiceStatus.A]: "Documento anulado",
    [InvoiceStatus.R]: "Documento de resumo doutros documentos criados noutras aplicações e gerado nesta aplicação",
    [InvoiceStatus.F]: "Documento faturado",
};

function GetNameFromInvoiceStatus(invoiceStatus: InvoiceStatus): string {
    return invoiceStatusNames[invoiceStatus] || "Unknown";
}

export { InvoiceStatus, GetNameFromInvoiceStatus };