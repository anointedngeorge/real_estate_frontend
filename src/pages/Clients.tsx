import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/dashboard/KPICard";
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
import {
  mockClients,
  mockProperties,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/data/mockData";
import { useUserListing } from "@/lib/axios_functions";
import {
  ClientListingInterface,
  UsersListingInterface,
} from "@/interfaces/general";
import { useNavigate } from "react-router-dom";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const { data, isLoading, error } = useUserListing({
    page: 1,
    url: "/client/list?",
  });

  const filteredClients = data?.items?.filter(
    (client: ClientListingInterface) => {
      const matchesSearch =
        client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      // const matchesStatus = statusFilter === 'all' || client. === statusFilter;
      return matchesSearch;
    },
  );

  const totalClients = mockClients.length;
  const activeClients = mockClients.filter((c) => c.status === "active").length;
  const totalSpent = mockClients.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOutstanding = mockClients.reduce(
    (acc, c) => acc + c.outstandingBalance,
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Clients Management"
        description="Manage clients, properties, and payment plans"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Clients"
          value={formatNumber(totalClients)}
          subtitle={`${activeClients} active`}
          icon={FileText}
        />
        <KPICard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          subtitle="All time purchases"
          icon={CreditCard}
          variant="success"
        />
        <KPICard
          title="Outstanding Balance"
          value={formatCurrency(totalOutstanding)}
          subtitle="Pending payments"
          icon={CreditCard}
          variant="warning"
        />
        <KPICard
          title="Properties Owned"
          value={23}
          subtitle="Total properties"
          icon={Building2}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-muted/50">
              <tr>
                <th>Client</th>
                <th>Contact</th>
                {/* <th>Properties</th> */}
                <th>Total Spent</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients?.map((client: ClientListingInterface) => {
                return (
                  <tr key={client.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {client.avatar ? (
                          <img
                            src={client.avatar}
                            alt={`${client.first_name} ${client.last_name}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-info">
                              {client.first_name[0]}
                              {client.first_name[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {client.first_name} {client.first_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {client.phone_number}
                    </td>
                    {/* <td>
                      <div className="space-y-1">
                        {properties.slice(0, 2).map((prop) => (
                          <div key={prop?.id} className="text-xs">
                            <span className="font-medium">{prop?.title}</span>
                          </div>
                        ))}
                        {properties.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{properties.length - 2} more
                          </span>
                        )}
                      </div>
                    </td> */}
                    <td className="font-medium text-success">
                      {formatCurrency(340000)}
                    </td>
                    <td
                      className={
                        client.outstandingBalance > 0
                          ? "font-medium text-warning"
                          : "text-muted-foreground"
                      }
                    >
                      {formatCurrency(client.outstandingBalance)}
                    </td>
                    <td>
                      <StatusBadge
                        status={client?.is_active ? "active" : "inactive"}
                      />
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatDate(client?.date_joined)}
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
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/clients/profile", {
                                state: {
                                  userID: client?.id,
                                },
                              })
                            }
                          >
                            View Profile{" "}
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Properties</DropdownMenuItem>
                          <DropdownMenuItem>Payment History</DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            Initiate Ownership Change
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-warning">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
