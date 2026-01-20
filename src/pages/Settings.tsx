import { useState } from 'react';
import { Save, Bell, Shield, Users, Zap, Globe, Database } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { COMMISSION_RULES, INSTALLMENT_INTEREST_RATE } from '@/types';

export default function SettingsPage() {
  const [automations, setAutomations] = useState({
    commissionCalculation: true,
    weeklyPayout: true,
    paymentReminders: true,
    overdueAlerts: true,
    performanceNotifications: true,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Configure system settings, automations, and permissions"
      >
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Arible Estate & Property" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="info@arible.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+234 800 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="Lagos, Nigeria" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Show notifications in dashboard</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Settings */}
        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Rules</CardTitle>
              <CardDescription>
                Configure commission percentages for realtors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="directCommission">Direct Commission (%)</Label>
                  <Input
                    id="directCommission"
                    type="number"
                    defaultValue={COMMISSION_RULES.DIRECT * 100}
                  />
                  <p className="text-xs text-muted-foreground">Commission for the selling realtor</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downlinerCommission">Downliner Commission (%)</Label>
                  <Input
                    id="downlinerCommission"
                    type="number"
                    defaultValue={COMMISSION_RULES.DOWNLINER * 100}
                  />
                  <p className="text-xs text-muted-foreground">Commission for the upline realtor</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyShare">Company Share (%)</Label>
                  <Input
                    id="companyShare"
                    type="number"
                    defaultValue={COMMISSION_RULES.COMPANY * 100}
                  />
                  <p className="text-xs text-muted-foreground">Remaining goes to company</p>
                </div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm">
                  <strong>Current Rules:</strong> Direct {COMMISSION_RULES.DIRECT * 100}% + Downliner {COMMISSION_RULES.DOWNLINER * 100}% + Company {COMMISSION_RULES.COMPANY * 100}% = 100%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>
                Configure when commissions are paid out
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payout Day</Label>
                <Select defaultValue="friday">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Commissions are processed weekly on this day</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installment Plans</CardTitle>
              <CardDescription>
                Configure available payment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Outright Payment</p>
                    <p className="text-sm text-muted-foreground">Full payment at once</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">3-Month Plan</p>
                    <p className="text-sm text-muted-foreground">Split into 3 payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">6-Month Plan</p>
                    <p className="text-sm text-muted-foreground">Split into 6 payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">10-Month Plan</p>
                    <p className="text-sm text-muted-foreground">Split into 10 payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interest Settings</CardTitle>
              <CardDescription>
                Configure interest rates for installment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    defaultValue={INSTALLMENT_INTEREST_RATE * 100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestPeriod">Applied Every</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-warning">
                  <strong>Current Rule:</strong> {INSTALLMENT_INTEREST_RATE * 100}% interest is applied every 3 months on outstanding balance
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation Engine
              </CardTitle>
              <CardDescription>
                Configure automated workflows and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Commission Calculation</p>
                  <p className="text-sm text-muted-foreground">Automatically calculate commissions on sale completion</p>
                </div>
                <Switch
                  checked={automations.commissionCalculation}
                  onCheckedChange={(checked) => setAutomations(prev => ({ ...prev, commissionCalculation: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Weekly Payout Generation</p>
                  <p className="text-sm text-muted-foreground">Generate payout reports every Friday</p>
                </div>
                <Switch
                  checked={automations.weeklyPayout}
                  onCheckedChange={(checked) => setAutomations(prev => ({ ...prev, weeklyPayout: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Payment Reminders</p>
                  <p className="text-sm text-muted-foreground">Send reminders before payment due dates</p>
                </div>
                <Switch
                  checked={automations.paymentReminders}
                  onCheckedChange={(checked) => setAutomations(prev => ({ ...prev, paymentReminders: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Overdue Payment Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify admins of overdue payments</p>
                </div>
                <Switch
                  checked={automations.overdueAlerts}
                  onCheckedChange={(checked) => setAutomations(prev => ({ ...prev, overdueAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Performance Notifications</p>
                  <p className="text-sm text-muted-foreground">Notify realtors of their performance metrics</p>
                </div>
                <Switch
                  checked={automations.performanceNotifications}
                  onCheckedChange={(checked) => setAutomations(prev => ({ ...prev, performanceNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Settings */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Configure permissions for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Super Admin', 'Manager', 'Finance Admin', 'Sales Admin', 'Marketing Admin'].map((role) => (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{role}</p>
                          <p className="text-sm text-muted-foreground">
                            {role === 'Super Admin' ? 'Full system access' : 'Limited access'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['View Dashboard', 'Manage Users', 'View Analytics', 'Manage Payments', 'Manage Properties'].map((permission, i) => (
                        <span
                          key={permission}
                          className={`text-xs px-2 py-1 rounded-full ${
                            role === 'Super Admin' || (i < 3 && role === 'Manager')
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
