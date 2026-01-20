import { BarChart3, TrendingUp, Users, CreditCard, Building2, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockSalesTrend, mockCommissionDistribution, mockPaymentCompliance, mockDashboardStats, formatCurrency, formatNumber } from '@/data/mockData';

const CHART_COLORS = {
  primary: 'hsl(160, 84%, 39%)',
  secondary: 'hsl(217, 91%, 60%)',
  tertiary: 'hsl(262, 83%, 58%)',
  warning: 'hsl(38, 92%, 50%)',
  danger: 'hsl(0, 84%, 60%)',
};

const realtorPerformance = [
  { name: 'Emmanuel O.', sales: 15, commission: 4500000 },
  { name: 'Grace A.', sales: 8, commission: 2400000 },
  { name: 'Tunde B.', sales: 5, commission: 1500000 },
  { name: 'Amaka E.', sales: 3, commission: 900000 },
];

const revenueForecast = [
  { month: 'Jan', actual: 180, forecast: 200 },
  { month: 'Feb', actual: 245, forecast: 230 },
  { month: 'Mar', actual: 320, forecast: 280 },
  { month: 'Apr', actual: 210, forecast: 250 },
  { month: 'May', actual: 420, forecast: 350 },
  { month: 'Jun', actual: 310, forecast: 380 },
  { month: 'Jul', actual: null, forecast: 420 },
  { month: 'Aug', actual: null, forecast: 450 },
  { month: 'Sep', actual: null, forecast: 400 },
];

export default function AnalyticsPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics & Reports"
        description="Comprehensive analytics and performance insights"
      >
        <Select defaultValue="ytd">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtd">Month to Date</SelectItem>
            <SelectItem value="qtd">Quarter to Date</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Year to date"
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
          variant="accent"
        />
        <KPICard
          title="Properties Sold"
          value={formatNumber(stats.totalSales.yearly)}
          subtitle="This year"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Realtors"
          value={formatNumber(stats.activeRealtors)}
          subtitle="Contributing agents"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Collection Rate"
          value="87%"
          subtitle="Payment compliance"
          icon={CreditCard}
          trend={{ value: 3, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Forecast */}
        <ChartCard
          title="Revenue Forecast"
          subtitle="Actual vs projected revenue (in millions)"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueForecast}>
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
                tickFormatter={(value) => `₦${value}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number | null, name: string) => [
                  value ? `₦${value}M` : 'N/A',
                  name === 'actual' ? 'Actual' : 'Forecast',
                ]}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.1}
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sales Trend */}
        <ChartCard
          title="Sales Trend"
          subtitle="Monthly property sales volume"
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Realtor Performance */}
        <ChartCard
          title="Top Realtors"
          subtitle="By sales count"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={realtorPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'commission' ? formatCurrency(value) : value,
                  name === 'commission' ? 'Commission' : 'Sales',
                ]}
              />
              <Bar 
                dataKey="sales" 
                fill={CHART_COLORS.primary}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Compliance */}
        <ChartCard
          title="Payment Status"
          subtitle="Distribution overview"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockPaymentCompliance}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
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
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {mockPaymentCompliance.map((item, index) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ 
                    backgroundColor: 
                      item.status === 'Paid' ? CHART_COLORS.primary :
                      item.status === 'Due' ? CHART_COLORS.warning :
                      CHART_COLORS.danger
                  }}
                />
                <span className="text-xs text-muted-foreground">{item.status}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Commission Distribution */}
      <ChartCard
        title="Commission Distribution"
        subtitle="Breakdown of commission allocation across the platform"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {mockCommissionDistribution.map((item, index) => (
            <div
              key={item.type}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning][index]}20`,
                  color: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning][index]
                }}
              >
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.type}</p>
                <p className="text-xl font-semibold">{formatCurrency(item.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
