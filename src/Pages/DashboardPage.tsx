import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Trash2, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { DeleteConfirmationModal } from "@/Components/delete-confirmation"
import { useGetAllUsersQuery } from "@/redux/api/AdminApi"
import type { GetAllUserResponse } from "@/utils/types/super-admins.types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import useDeleteUser from "@/hooks/useDeleteUser"
import { AddAdminModal, type CreateAdminData } from "@/Components/add-admin-modal"
import useAddUser from "@/hooks/useAddUser"
import useUpdateUserRole from "@/hooks/useUpdateUserRole"
import { LoaderIcon } from "react-hot-toast"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/slice/authSlice"
import { Role } from "@/utils/contants"
export default function UserDashboard() {
    const roles = ["SUPER_ADMIN", "ADMIN", "UNIT_MANAGER", "USER"]
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<Role>()
    const [statusFilter, setStatusFilter] = useState<"blocked" | "active" | undefined>(undefined)
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: GetAllUserResponse | null }>({
        isOpen: false,
        user: null,
    })
    const currentUser = useSelector(selectCurrentUser)
    const { isUpdateUserRoleLoading, updateUser } = useUpdateUserRole()
    const [error, setErrors] = useState({})
    const limit = 8
    const { data, isLoading } = useGetAllUsersQuery({
        page,
        limit,
        search: search,
        role: roleFilter,
        status: statusFilter
    })
    const { deleteUser, isUserDeleting } = useDeleteUser()
    const { handleCreateAdmin, isUserCreating, addAdminModal, setAddAdminModal } = useAddUser();

    const handleAddAdmin = async (adminData: CreateAdminData) => {
        const result = await handleCreateAdmin(adminData)
        setErrors({ ...result })


    }
    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value === "all" ? undefined : (value as Role))
        setPage(1)
    }


    const handleStatusFilter = (value: string) => {
        setStatusFilter(value === "all" ? undefined : (value as "blocked" | "active"))
        setPage(1)
    }


    const handleDeleteUser = (user: GetAllUserResponse) => {
        setDeleteModal({ isOpen: true, user })
    }

    const confirmDelete = () => {
        if (deleteModal.user) {
            console.log("Deleting user:", deleteModal.user._id)
            deleteUser(deleteModal.user._id)
        }
        setDeleteModal({ isOpen: false, user: null })
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "destructive"
            case "ADMIN":
                return "default"
            case "UNIT_MANAGER":
                return "secondary"
            default:
                return "outline"
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        return status === "active" ? "default" : "destructive"
    }
    const handleRoleSelect = (newRole: Role, useId: string) => {
        updateUser({ userId: useId, role: newRole })
    };


    return (
        <div className="container mx-auto py-8 px-10 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">User Management</CardTitle>
                            <CardDescription className="text-md font-medium text-gray-600">
                                Manage users, their roles, and access permissions
                            </CardDescription>
                        </div>
                        <Button onClick={() => setAddAdminModal(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {currentUser?.role === "SUPER_ADMIN"
                                ? "Add Admin"
                                : currentUser?.role === "ADMIN"
                                    ? "Add Unit Managers"
                                    : currentUser?.role === "UNIT_MANAGER"
                                        ? "Add Users"
                                        : ""}
                        </Button>

                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label className="pl-2 py-1.5" htmlFor="search">
                                Search Users
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <Label className="pl-2 py-1.5" htmlFor="role-filter">
                                Role
                            </Label>
                            <Select value={roleFilter || "all"} onValueChange={handleRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent className="font-satoshi">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="UNIT_MANAGER">Unit Manager</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:w-48 ">
                            <Label className="pl-2 py-1.5" htmlFor="status-filter">
                                Status
                            </Label>
                            <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="font-satoshi">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Group</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created-By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                                                    <div className="space-y-2">
                                                        <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                                                        <div className="w-32 h-3 bg-muted rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-24 h-8 bg-muted rounded animate-pulse ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : data?.users?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.users.map((user: GetAllUserResponse) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                                                        <AvatarFallback>
                                                            {user.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role.replace("_", " ")}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{user.group}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                            Details <ChevronDown className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-65 font-satoshi">
                                                        <DropdownMenuLabel>Creator Info</DropdownMenuLabel>
                                                        {typeof user.createdBy === "object" && user.createdBy !== null ? (
                                                            <>
                                                                <DropdownMenuItem>
                                                                    <span className="font-bold">Name:</span>
                                                                    {user.createdBy.name}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <span className="font-bold">Email:</span>
                                                                    {user.createdBy.email}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <span className="font-bold">Role:</span>
                                                                    <Badge>{user.createdBy.role}</Badge>
                                                                </DropdownMenuItem>
                                                            </>
                                                        ) : (
                                                            <DropdownMenuItem>Unknown creator</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {showRoleDropdown ? (
                                                        <Select onValueChange={(newRole) => handleRoleSelect(newRole as Role, user._id)}>
                                                            <SelectTrigger className="w-[130px]">
                                                                <SelectValue placeholder="Select Role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {roles.map((role) => (
                                                                    <SelectItem key={role} value={role}>
                                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        currentUser?.role === Role.ADMIN && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setShowRoleDropdown(true)}
                                                            >
                                                                {isUpdateUserRoleLoading ? (
                                                                    <LoaderIcon className="animate-spin h-4 w-4" />
                                                                ) : (
                                                                    "Update"
                                                                )}
                                                            </Button>
                                                        )
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {data && data.totalPages > 1 && (
                        <div className="flex items-center justify-between ">
                            <div className="text-sm text-muted-foreground">
                                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of {data.total} users
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPage(pageNum)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === data.totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, user: null })}
                onConfirm={confirmDelete}
                userName={deleteModal.user?.name || ""}
                isUserDeleting={isUserDeleting}
            />
            <AddAdminModal
                isOpen={addAdminModal}
                onClose={() => setAddAdminModal(false)}
                onSubmit={handleAddAdmin}
                isLoading={isUserCreating}
                addAdminError={error}

            />
        </div>
    )
}
