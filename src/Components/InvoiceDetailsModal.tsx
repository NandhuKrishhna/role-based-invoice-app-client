"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Badge } from "@/Components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Separator } from "@/Components/ui/separator"
import { Calendar, DollarSign, FileText, User, Building, Hash } from "lucide-react"
import { format } from "date-fns"
import type { IInvoice } from "@/utils/types/invoice.types"

interface InvoiceDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: IInvoice | null
}

export function InvoiceDetailsModal({ open, onOpenChange, invoice }: InvoiceDetailsModalProps) {
    if (!invoice) return null

    const formatDate = (dateString: string) => format(new Date(dateString), "dd MMMM yyyy")

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "destructive"
            case "UNIT_MANAGER":
                return "default"
            case "USER":
                return "secondary"
            default:
                return "outline"
        }
    }

    const getTypeBadgeVariant = (type: string) => {
        switch (type) {
            case "CREDIT":
            case "DEBIT":
                return "destructive"
            case "PROFORMA":
                return "secondary"
            default:
                return "default"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-satoshi">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Invoice Details
                    </DialogTitle>
                    <DialogDescription>Complete information for invoice {invoice.invoiceNumber}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Invoice Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                                    <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Financial Year</label>
                                    <p className="text-lg font-semibold">{invoice.financialYear}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Invoice Date
                                    </label>
                                    <p className="text-lg">{formatDate(invoice.invoiceDate)}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Amount
                                    </label>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(invoice.invoiceAmount)}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Invoice Type</label>
                                <div>
                                    <Badge variant={getTypeBadgeVariant(invoice.type)} className="text-sm px-3 py-1">
                                        {invoice.type}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Creator Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Creator Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Created By</label>
                                    <p className="text-lg font-semibold">{invoice.createdBy}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <div>
                                        <Badge variant={getRoleBadgeVariant(invoice.createdByRole)} className="text-sm px-3 py-1">
                                            {invoice.createdByRole.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {invoice.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{invoice.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary */}
                    <Card className="border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Invoice Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Invoice ID:</span>
                                    <span className="font-mono text-sm">{invoice._id}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Active
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total Amount:</span>
                                    <span className="text-green-600">{formatCurrency(invoice.invoiceAmount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
