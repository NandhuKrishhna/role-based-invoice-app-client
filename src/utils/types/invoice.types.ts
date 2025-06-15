
export interface IInvoice {
    _id: string
    invoiceNumber: string
    invoiceDate: string
    invoiceAmount: number
    type: "STANDARD" | "PROFORMA" | "CREDIT" | "DEBIT" | "RECURRING" | "TIMESHEET" | "FINAL" | "INTERIM" | "COMMERCIAL"
    financialYear: string
    createdBy: string
    createdByRole: "ADMIN" | "UNIT_MANAGER" | "USER"
    description?: string
}

export interface InvoiceResponse {
    success: boolean
    message: string
    response: {
        data: IInvoice[]
        total: number
        page: number
        totalPages: number
    }
}

export interface InvoiceFormData {
    _id?: string
    invoiceNumber: string
    invoiceDate: string
    invoiceAmount: number
    type: IInvoice["type"]
    description?: string
}
export type InvoiceType =
    | "STANDARD"
    | "PROFORMA"
    | "CREDIT"
    | "DEBIT"
    | "RECURRING"
    | "TIMESHEET"
    | "FINAL"
    | "INTERIM"
    | "COMMERCIAL";
export type InvoiceQueryParams = {
    page?: number;
    limit?: number;
    sortBy?: 'invoiceDate' | 'invoiceAmount';
    sortOrder?: 'asc' | 'desc';
    search?: string;
    type?: InvoiceType;
    fromDate?: string;
    toDate?: string;
    createdByRole?: string
};


export type InvoiceInputParams = {
    _id?: string
    invoiceNumber: string;
    invoiceDate: string | Date;
    invoiceAmount: number;
    type?: InvoiceType
    description?: string;
};