import { useState } from 'react';
import { Search, MoreHorizontal, Download, TrendingUp, DollarSign, Building2, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockSales, mockProperties, mockClients, mockRealtors, mockSalesTrend, formatCurrency, formatDate, formatNumber } from '@/data/mockData';

const paymentPlanLabels = {
  outright: 'Outright',
  '3_months': '3 Months',
  '6_months': '6 Months',
  '10_months': '10 Months',
};

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSales = mockSales.filter((sale) => {
    const property = mockProperties.find(p => p.id === sale.propertyId);
    const matchesSearch = property?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = mockSales.length;
  const completedSales = mockSales.filter(s => s.status === 'completed').length;
  const totalRevenue = mockSales.reduce((acc, s) => acc + s.amount, 0);
  const totalCommission = mockSales.reduce((acc, s) => acc + s.commission.direct + s.commission.downliner, 0);

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property?.title || 'Unknown Property';
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const getRealtorName = (realtorId: string) => {
    const realtor = mockRealtors.find(r => r.id === realtorId);
    return realtor ? `${realtor.firstName} ${realtor.lastName}` : 'Unknown Realtor';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sales Management"
        description="Track sales performance, revenue, and commission distribution"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Sales"
          value={formatNumber(totalSales)}
          subtitle={`${completedSales} completed`}
          icon={TrendingUp}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="All time revenue"
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Total Commission"
          value={formatCurrency(totalCommission)}
          subtitle="Realtor earnings"
          icon={Users}
          variant="accent"
        />
        <KPICard
          title="Avg. Sale Value"
          value={formatCurrency(totalRevenue / totalSales)}
          subtitle="Per transaction"
          icon={Building2}
        />
      </div>

      {/* Sales Chart */}
      <ChartCard
        title="Monthly Sales Performance"
        subtitle="Sales count and revenue over time"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockSalesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(var(--accent))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-muted/50">
              <tr>
                <th>Property</th>
                <th>Client</th>
                <th>Realtor</th>
                <th>Amount</th>
                <th>Payment Plan</th>
                <th>Commission</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-medium">{getPropertyTitle(sale.propertyId)}</td>
                  <td>{getClientName(sale.clientId)}</td>
                  <td>{getRealtorName(sale.realtorId)}</td>
                  <td className="font-medium">{formatCurrency(sale.amount)}</td>
                  <td>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                      {paymentPlanLabels[sale.paymentPlan]}
                    </span>
                  </td>
                  <td>
                    <div className="space-y-0.5 text-xs">
                      <div className="text-success">Direct: {formatCurrency(sale.commission.direct)}</div>
                      {sale.commission.downliner > 0 && (
                        <div className="text-info">Downline: {formatCurrency(sale.commission.downliner)}</div>
                      )}
                    </div>
                  </td>
                  <td><StatusBadge status={sale.status} /></td>
                  <td className="text-muted-foreground">{formatDate(sale.createdAt)}</td>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Payments</DropdownMenuItem>
                        <DropdownMenuItem>Commission Breakdown</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Cancel Sale</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
