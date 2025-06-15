import type React from "react"
import { useEffect, useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

import { Role } from "@/utils/contants"




interface AddAdminModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (adminData: CreateAdminData) => void
    isLoading?: boolean
    addAdminError?: Partial<CreateAdminData>
}

export interface CreateAdminData {
    name: string
    email: string
    password: string
    role: Role
    group?: string
}

export function AddAdminModal({ isOpen, onClose, onSubmit, isLoading = false, addAdminError }: AddAdminModalProps) {

    const [formData, setFormData] = useState<CreateAdminData>({
        name: "",
        email: "",
        password: "",
        role: Role.ADMIN,
        group: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState(addAdminError || {});
    useEffect(() => {
        setErrors(addAdminError || {})
    }, [addAdminError])




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.entries(errors as Record<string, string>).length === 0) {
            const submitData = {
                ...formData,
                group: formData.group?.trim() || undefined,
            }
            onSubmit(submitData)
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: Role.ADMIN,
            group: "",
        })
        setErrors({})
        setShowPassword(false)
        onClose()
    }

    const handleInputChange = (field: keyof CreateAdminData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 font-satoshi" />
                        Add New Admin
                    </DialogTitle>
                    <DialogDescription className="font-satoshi">Create a new admin user with the specified role and permissions.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 font-satoshi">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className={errors?.name ? "border-red-500" : ""}
                            />
                            {errors?.name && <p className="text-sm text-red-500">{errors?.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={errors?.email ? "border-red-500" : ""}
                            />
                            {errors?.email && <p className="text-sm text-red-500">{errors?.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password (min. 8 characters)"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className={errors?.password ? "border-red-500 pr-10" : "pr-10"}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors?.password && <p className="text-sm text-red-500">{errors?.password}</p>}
                        </div>

                        {/* Role Field */}
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.role} onValueChange={(value: Role) => handleInputChange("role", value)}>
                                <SelectTrigger className={errors?.role ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="UNIT_MANAGER">Unit Manager</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="USER">USER</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.role && <p className="text-sm text-red-500">{errors?.role}</p>}
                        </div>

                        {/* Group Field */}
                        <div className="space-y-2">
                            <Label htmlFor="group">Group <span className="text-red-500">*</span></Label>
                            <Input
                                id="group"
                                type="text"
                                placeholder="Enter group name"
                                value={formData.group}
                                onChange={(e) => handleInputChange("group", e.target.value)}
                            />
                            {errors?.group && <p className="text-sm text-red-500">{errors?.group}</p>}
                            <p className="text-sm text-gray-500">Leave empty if no specific group assignment is needed.</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Admin
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
