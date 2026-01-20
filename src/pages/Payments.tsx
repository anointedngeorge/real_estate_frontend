import { useState } from 'react';
import { Search, MoreHorizontal, Download, CreditCard, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { mockPayments, mockCommissions, mockClients, mockProperties, mockRealtors, formatCurrency, formatDate, formatNumber } from '@/data/mockData';

const paymentPlanLabels = {
  outright: 'Outright',
  '3_months': '3 Months',
  '6_months': '6 Months',
  '10_months': '10 Months',
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter((payment) => {
    const client = mockClients.find(c => c.id === payment.clientId);
    const matchesSearch = client?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = mockPayments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amountPaid, 0);
  const totalDue = mockPayments.filter(p => p.status === 'due').reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0);
  const pendingCommissions = mockCommissions.filter(c => c.status !== 'paid').reduce((acc, c) => acc + c.amount, 0);

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property?.title || 'Unknown Property';
  };

  const getRealtorName = (realtorId: string) => {
    const realtor = mockRealtors.find(r => r.id === realtorId);
    return realtor ? `${realtor.firstName} ${realtor.lastName}` : 'Unknown Realtor';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Payment Management"
        description="Track payments, installments, and commission payouts"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Received"
          value={formatCurrency(totalPaid)}
          subtitle="Payments collected"
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Due Payments"
          value={formatCurrency(totalDue)}
          subtitle={`${mockPayments.filter(p => p.status === 'due').length} pending`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Overdue"
          value={formatCurrency(totalOverdue)}
          subtitle={`${mockPayments.filter(p => p.status === 'overdue').length} overdue`}
          icon={AlertTriangle}
          variant="warning"
        />
        <KPICard
          title="Pending Commissions"
          value={formatCurrency(pendingCommissions)}
          subtitle="Ready for payout"
          icon={CreditCard}
          variant="accent"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Client Payments</TabsTrigger>
          <TabsTrigger value="commissions">Commission Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by client..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead className="bg-muted/50">
                  <tr>
                    <th>Client</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Payment Plan</th>
                    <th>Installment</th>
                    <th>Due Date</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="font-medium">{getClientName(payment.clientId)}</td>
                      <td className="text-muted-foreground">{getPropertyTitle(payment.propertyId)}</td>
                      <td className="font-medium">{formatCurrency(payment.amount)}</td>
                      <td className={payment.amountPaid > 0 ? "text-success" : "text-muted-foreground"}>
                        {formatCurrency(payment.amountPaid)}
                      </td>
                      <td>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {paymentPlanLabels[payment.paymentPlan]}
                        </span>
                      </td>
                      <td className="text-center">
                        {payment.installmentNumber && payment.totalInstallments ? (
                          <span className="text-sm">
                            {payment.installmentNumber} / {payment.totalInstallments}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-muted-foreground">{formatDate(payment.dueDate)}</td>
                      <td className={payment.interestApplied > 0 ? "text-warning" : "text-muted-foreground"}>
                        {payment.interestApplied > 0 ? formatCurrency(payment.interestApplied) : '-'}
                      </td>
                      <td><StatusBadge status={payment.status} /></td>
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
                            <DropdownMenuItem>Record Payment</DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Payment History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          {/* Commission Info */}
          <ChartCard
            title="Weekly Payout Schedule"
            subtitle="Commissions are processed every Friday"
          >
            <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Calendar className="h-10 w-10 text-accent" />
              <div>
                <p className="font-medium">Next Payout: Friday, January 24, 2026</p>
                <p className="text-sm text-muted-foreground">
                  {mockCommissions.filter(c => c.status === 'approved').length} commissions ready for payout
                </p>
              </div>
              <Button className="ml-auto">Process Payouts</Button>
            </div>
          </ChartCard>

          {/* Commissions Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead className="bg-muted/50">
                  <tr>
                    <th>Realtor</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Scheduled Payout</th>
                    <th>Paid Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCommissions.map((commission) => (
                    <tr key={commission.id}>
                      <td className="font-medium">{getRealtorName(commission.realtorId)}</td>
                      <td>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          commission.type === 'direct' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                        }`}>
                          {commission.type === 'direct' ? 'Direct (10%)' : 'Downliner (2%)'}
                        </span>
                      </td>
                      <td className="font-medium text-success">{formatCurrency(commission.amount)}</td>
                      <td><StatusBadge status={commission.status} /></td>
                      <td className="text-muted-foreground">{formatDate(commission.scheduledPayoutDate)}</td>
                      <td className="text-muted-foreground">
                        {commission.paidDate ? formatDate(commission.paidDate) : '-'}
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
                            <DropdownMenuItem>View Sale</DropdownMenuItem>
                            <DropdownMenuItem>Approve Payout</DropdownMenuItem>
                            <DropdownMenuItem>Process Now</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
