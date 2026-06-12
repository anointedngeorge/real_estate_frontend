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
import { useUserListing } from '@/lib/axios_functions';
import { SalesOutInterface } from '@/interfaces/general';
import { CreateNewSales } from '@/components/sales/add_new_sales';

const paymentPlanLabels = {
  outright: 'Outright',
  '3': '3 Months',
  '6': '6 Months',
  '12': '12 Months',
};


interface Stats {
    total: number;
    total_revenue: number;
    total_commission: number;
    average: number;
    month_sales_performance: string[];
    amount: string;
    total_sales: number
} 



export default function SalesPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

   const { data, isLoading, error } = useUserListing({
      page: 1,
      size:30,
      url: "/sales/list?",
    });

  const sales: SalesOutInterface[] = data?.items;

  // const filteredSales = sales?.filter((sale: SalesOutSchema) => {
  //   const property = sales?.find(p => p.id === sale.id);
  //   // const matchesSearch = property?.name.toLowerCase().includes(searchQuery.toLowerCase());
  //   // const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
  //   return [];
  // });


  const stats: Stats= data?.stats;
  const performance_chart = stats?.month_sales_performance

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sales Management"
        description="Track sales performance, revenue, and commission distribution"
      >
        <CreateNewSales />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Sales"
          value={formatNumber(data?.count)}
          subtitle={`${data?.count} completed`}
          icon={TrendingUp}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue)}
          subtitle="All time revenue"
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Total Commission"
          value={formatCurrency(stats?.total_commission)}
          subtitle="Realtor earnings"
          icon={Users}
          variant="accent"
        />
        <KPICard
          title="Avg. Sale Value"
          value={formatCurrency(stats?.total_revenue / stats?.total_sales)}
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
          <BarChart data={performance_chart}>
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
                {/* <th>Commission</th> */}
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales?.map((sale: SalesOutInterface ) => (
                <tr key={sale.id}>
                  <td className="font-medium">{sale?.properties?.name}</td>
                  <td>{`${sale.client?.first_name} ${sale.client?.last_name}`}</td>
                  <td>{`${sale?.realtor?.first_name} ${sale?.realtor?.last_name}`}</td>
                  <td className="font-medium">{formatCurrency(sale?.amount)}</td>
                  <td>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                      {paymentPlanLabels[sale.payment_plan]}
                    </span>
                  </td>
                  {/* <td>
                    <div className="space-y-0.5 text-xs">
                      <div className="text-success">Direct: {formatCurrency(sale.commission?.direct)}</div>
                      {sale.commission.downliner > 0 && (
                        <div className="text-info">Downline: {formatCurrency(sale.commission.downliner)}</div>
                      )}
                    </div>
                  </td> */}
                  <td><StatusBadge status={ 'in_progress' } /></td>
                  <td className="text-muted-foreground">{formatDate(sale?.sales_date)}</td>
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
