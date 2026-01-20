import {
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Users,
  UserCheck,
  Wallet,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  mockDashboardStats,
  mockSalesTrend,
  mockCommissionDistribution,
  mockPaymentCompliance,
  mockPayments,
  mockRealtors,
  formatCurrency,
  formatNumber,
  formatDate,
} from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CHART_COLORS = {
  primary: 'hsl(160, 84%, 39%)',
  secondary: 'hsl(217, 91%, 60%)',
  tertiary: 'hsl(262, 83%, 58%)',
  warning: 'hsl(38, 92%, 50%)',
  danger: 'hsl(0, 84%, 60%)',
};

const pieColors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning];

export default function OverviewPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your properties today."
      >
        <Select defaultValue="30">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">This year</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value={formatNumber(stats.totalProperties)}
          subtitle="Active listings"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Yearly revenue"
          icon={DollarSign}
          variant="accent"
          trend={{ value: 18, isPositive: true }}
        />
        <KPICard
          title="Pending Payments"
          value={formatNumber(stats.pendingPayments)}
          subtitle={`${formatNumber(stats.completedPayments)} completed`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Active Realtors"
          value={formatNumber(stats.activeRealtors)}
          subtitle={`${formatNumber(stats.activeClients)} clients`}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Monthly Sales"
          value={formatNumber(stats.totalSales.monthly)}
          subtitle="Properties sold this month"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Yearly Sales"
          value={formatNumber(stats.totalSales.yearly)}
          subtitle="Properties sold this year"
          icon={TrendingUp}
        />
        <KPICard
          title="Commissions Paid"
          value={formatCurrency(stats.totalCommissionsPaid)}
          subtitle="Total paid to realtors"
          icon={Wallet}
          variant="success"
        />
        <KPICard
          title="Unpaid Commissions"
          value={formatCurrency(stats.totalCommissionsUnpaid)}
          subtitle="Pending payouts"
          icon={Wallet}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <ChartCard
          title="Sales Trend"
          subtitle="Monthly sales and revenue performance"
          action={
            <Button variant="outline" size="sm">
              View Report
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesTrend}>
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
                tickFormatter={(value) => `${value}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Sales',
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Commission Distribution */}
        <ChartCard
          title="Commission Distribution"
          subtitle="Breakdown of commission allocation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCommissionDistribution}
                dataKey="amount"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {mockCommissionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {mockCommissionDistribution.map((item, index) => (
              <div key={item.type} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="text-xs text-muted-foreground">{item.type}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Payment Compliance & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Compliance */}
        <ChartCard
          title="Payment Compliance"
          subtitle="Payment status distribution"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockPaymentCompliance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="status" 
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'amount' ? formatCurrency(value) : value,
                  name === 'amount' ? 'Amount' : 'Count',
                ]}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
              >
                {mockPaymentCompliance.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.status === 'Paid' ? CHART_COLORS.primary :
                      entry.status === 'Due' ? CHART_COLORS.warning :
                      CHART_COLORS.danger
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Payments */}
        <ChartCard
          title="Recent Payments"
          subtitle="Latest payment activity"
          className="lg:col-span-2"
          action={
            <Button variant="outline" size="sm">
              View All
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="font-medium">
                      {payment.clientId === 'c1' ? 'Oluwaseun Adeola' :
                       payment.clientId === 'c2' ? 'Ngozi Obi' : 'Ibrahim Musa'}
                    </td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td className="text-muted-foreground">{formatDate(payment.dueDate)}</td>
                    <td><StatusBadge status={payment.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Top Realtors */}
      <ChartCard
        title="Top Performing Realtors"
        subtitle="Based on total sales volume"
        action={
          <Button variant="outline" size="sm">
            View All Realtors
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Realtor</th>
                <th>Total Sales</th>
                <th>Commission Earned</th>
                <th>Paid</th>
                <th>Unpaid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRealtors.map((realtor) => (
                <tr key={realtor.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {realtor.avatar ? (
                        <img
                          src={realtor.avatar}
                          alt={`${realtor.firstName} ${realtor.lastName}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {realtor.firstName[0]}{realtor.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{realtor.firstName} {realtor.lastName}</p>
                        <p className="text-xs text-muted-foreground">{realtor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{realtor.totalSales}</td>
                  <td className="text-success">{formatCurrency(realtor.totalCommissionEarned)}</td>
                  <td>{formatCurrency(realtor.paidCommission)}</td>
                  <td className="text-warning">{formatCurrency(realtor.unpaidCommission)}</td>
                  <td><StatusBadge status={realtor.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
