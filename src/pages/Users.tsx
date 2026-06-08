import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { mockUsers, formatDate } from "@/data/mockData";
import type { UserRole, UserServer } from "@/types";
import { UserRegistration } from "@/components/users/add_new_user";
import { deleteUser, useUserListing } from "@/lib/axios_functions";
import { useNavigate } from "react-router-dom";
import { roleLabels } from "@/data/constant";


const roleColors: Record<UserRole, string> = {
  super_admin: "bg-accent/10 text-accent",
  manager: "bg-info/10 text-info",
  finance_admin: "bg-success/10 text-success",
  sales_admin: "bg-warning/10 text-warning",
  marketing_admin: "bg-purple-100 text-purple-600",
  admin: "bg-purple-100 text-purple-600",
  buyer: "bg-purple-100 text-purple-600",
  agent: "bg-purple-50 text-purple-600"
};



export default function UsersPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const { data, isLoading, error } = useUserListing({ page: 1, exclude_users_roles:'agent' });
  const [users, setUsers] = useState<UserServer[]>(data?.items);

  const filteredUsers = data?.items.filter((user: UserServer) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });


  // delete user function
  async function removeUser(id:string, name?: string) {
       const confirm = window.confirm("Are You Sure?");
       if (confirm) {
          const rmFn = await deleteUser(id);
          const {status} = rmFn;
          if (status) {
            window.location.reload();
          }
       }
       
  }

  // load user profile page


  return !isLoading ? (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Management"
        description="Manage admin users, roles, and permissions"
      >
        <UserRegistration />
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(roleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-muted/50">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: UserServer) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.first_name[0]}
                            {user.last_name[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email? user.email : `${user.first_name}${user.last_name}@gmail.com`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role]}`}
                    >
                      <Shield className="h-3 w-3" />
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td>
                    {user.phone_number && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{user.phone_number}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="text-muted-foreground text-sm">
                    {user.last_login ? formatDate(user.last_login) : "Never"}
                  </td>
                  <td className="text-muted-foreground text-sm">
                    {formatDate(user.date_joined)}
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/users/profile", {
                            state: {
                                userID: user.id
                            }
                        })}>
                          View Profile
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Manage Permissions</DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                    
                        <DropdownMenuItem className="text-destructive" onClick={(e) => removeUser(user?.id)}>
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {data?.items.length} users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
      <span className="text-black text-3xl">Loading...</span>
    </div>
  );
}
