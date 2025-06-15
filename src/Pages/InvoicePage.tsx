import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Plus, Search, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, LoaderIcon, Eye } from "lucide-react"
import { format } from "date-fns"
import { InvoiceForm } from "../Components/InvoiceForm"
import type { IInvoice, InvoiceFormData } from "@/utils/types/invoice.types"
import { useGetAllInvoicesQuery } from "@/redux/api/AdminApi"
import useCreateInvoice from "@/hooks/useCreateInvoice"
import useUpdateInvoice from "@/hooks/useUpdateInvoice"
import useDeleteInvoice from "@/hooks/useDeleteInvoice"
import { InvoiceDetailsModal } from "../Components/InvoiceDetailsModal"

export function InvoicePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<"invoiceDate" | "invoiceAmount">("invoiceDate")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingInvoice, setEditingInvoice] = useState<IInvoice | undefined>()
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null)
    const { handleCreateInvoice, isInvoiceCreating } = useCreateInvoice(setIsFormOpen)
    const { handleUpdateInvoice, isInvoiceUpdating } = useUpdateInvoice(setIsFormOpen)
    const { handleDeleteInvoice, isInvoiceDeleting } = useDeleteInvoice()
    const { data } = useGetAllInvoicesQuery({
        page: currentPage,
        search: searchTerm,
        createdByRole: roleFilter !== "all" ? roleFilter : undefined,
        limit: 10,
        sortBy: sortField,
        sortOrder,
    })

    const invoices = data?.response?.data || []

    const formatDate = (dateString: string) => format(new Date(dateString), "dd-MM-yyyy")

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)

    const handleAddInvoice = () => {
        setEditingInvoice(undefined)
        setIsFormOpen(true)
    }

    const handleEditInvoice = (invoice: IInvoice) => {
        setEditingInvoice(invoice)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (data: InvoiceFormData) => {
        if (editingInvoice) {
            await handleUpdateInvoice({ _id: editingInvoice._id, ...data })
        } else {
            await handleCreateInvoice(data)
        }
    }

    const handleViewDetails = (invoice: IInvoice) => {
        setSelectedInvoice(invoice)
        setDetailsModalOpen(true)
    }

    const toggleSort = (field: "invoiceDate" | "invoiceAmount") => {
        if (sortField === field) {
            setSortOrder(sortOrder === "desc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

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
        <div className="container mx-auto py-6 px-5 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Invoice Page</h1>
                <Button onClick={handleAddInvoice} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Invoice
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by invoice number or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent className="font-satoshi">
                                <SelectItem value="ALL">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="UNIT_MANAGER">Unit Manager</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleSort("invoiceDate")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Invoice Date
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleSort("invoiceAmount")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Amount
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Financial Year</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice: IInvoice) => (
                                    <TableRow key={invoice._id}>
                                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                                        <TableCell>{formatCurrency(invoice.invoiceAmount)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getTypeBadgeVariant(invoice.type)}>{invoice.type}</Badge>
                                        </TableCell>
                                        <TableCell>{invoice.financialYear}</TableCell>
                                        <TableCell>{invoice.createdBy}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(invoice.createdByRole)}>{invoice.createdByRole}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{invoice.description || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(invoice)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEditInvoice(invoice)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the invoice "
                                                                {invoice.invoiceNumber}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteInvoice(invoice._id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                {isInvoiceDeleting ? <LoaderIcon className="animate-spin" /> : "Delete"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {invoices.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">No invoices found matching your criteria.</div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {data?.response?.totalPages || 1} ({data?.response?.total} total invoices)
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {data?.response?.totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(data?.response?.totalPages || 1, currentPage + 1))}
                        disabled={currentPage === (data?.response?.totalPages || 1)}
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <InvoiceForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                invoice={editingInvoice}
                onSubmit={handleFormSubmit}
                isLoading={editingInvoice ? isInvoiceCreating : isInvoiceUpdating}
            />
            <InvoiceDetailsModal open={detailsModalOpen} onOpenChange={setDetailsModalOpen} invoice={selectedInvoice} />
        </div>
    )
}
