import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Calendar } from "@/Components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { IInvoice, InvoiceFormData } from "@/utils/types/invoice.types"


const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    invoiceAmount: z.number().min(0.01, "Invoice amount must be greater than 0"),
    type: z.enum(["STANDARD", "PROFORMA", "CREDIT", "DEBIT", "RECURRING", "TIMESHEET", "FINAL", "INTERIM", "COMMERCIAL"]),
    description: z.string().optional(),
})

interface InvoiceFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice?: IInvoice
    onSubmit: (data: InvoiceFormData) => void
    isLoading?: boolean
}

export function InvoiceForm({ open, onOpenChange, invoice, onSubmit, isLoading }: InvoiceFormProps) {
    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceNumber: invoice?.invoiceNumber || "",
            invoiceDate: invoice?.invoiceDate || "",
            invoiceAmount: invoice?.invoiceAmount || 0,
            type: invoice?.type || "STANDARD",
            description: invoice?.description || "",
        },
    })

    React.useEffect(() => {
        if (invoice) {
            form.reset({
                invoiceNumber: invoice.invoiceNumber,
                invoiceDate: invoice.invoiceDate,
                invoiceAmount: invoice.invoiceAmount,
                type: invoice.type,
                description: invoice.description || "",
            })
        } else {
            form.reset({
                invoiceNumber: "",
                invoiceDate: "",
                invoiceAmount: 0,
                type: "STANDARD",
                description: "",
            })
        }
    }, [invoice, form])

    const handleSubmit = (data: InvoiceFormData) => {
        onSubmit(data)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] font-satoshi">
                <DialogHeader>
                    <DialogTitle>{invoice ? "Update Invoice" : "Add New Invoice"}</DialogTitle>
                    <DialogDescription>
                        {invoice ? "Update the invoice details below." : "Fill in the details to create a new invoice."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="INV-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoiceDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Invoice Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoiceAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select invoice type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="STANDARD">Standard</SelectItem>
                                            <SelectItem value="PROFORMA">Proforma</SelectItem>
                                            <SelectItem value="CREDIT">Credit</SelectItem>
                                            <SelectItem value="DEBIT">Debit</SelectItem>
                                            <SelectItem value="RECURRING">Recurring</SelectItem>
                                            <SelectItem value="TIMESHEET">Timesheet</SelectItem>
                                            <SelectItem value="FINAL">Final</SelectItem>
                                            <SelectItem value="INTERIM">Interim</SelectItem>
                                            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter invoice description..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : invoice ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
