import { useState } from "react";
import {
  Save,
  Bell,
  Shield,
  Users,
  Zap,
  Globe,
  Database,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { COMMISSION_RULES, INSTALLMENT_INTEREST_RATE } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { system_settings, useSettings } from "@/lib/axios_functions";

export default function SettingsPage() {
  const [automations, setAutomations] = useState({
    commissionCalculation: true,
    weeklyPayout: true,
    paymentReminders: true,
    overdueAlerts: true,
    performanceNotifications: true,
  });

  
  const { data, isLoading, error } = useSettings();
  const settings_data = data?.data;
  console.log(settings_data, "data loading")
  

  const bool = (value) => {
        const dt = {"True": true, "False": false};
        return dt[value];
  }


  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const settingsHandler = async (e) => {
    const formattedString = JSON.stringify(e);
    const st = await system_settings(formattedString)
    console.log("created")
  };

  return (
    <div className="space-y-6 animate-fade-in">


      <form onSubmit={handleSubmit(settingsHandler)}>
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
          <TabsList className="grid w-full grid-cols-6 max-w-2xl">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
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
                    <Input
                      id="companyName"
                      defaultValue={settings_data?.company_name }
                      {...register("company_name", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={settings_data?.company_email}
                      {...register("company_email", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={settings_data?.company_phone} {...register("company_phone", {required:true})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      defaultValue={settings_data?.data?.company_address}
                      {...register("company_address", { required: true })}
                    />
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
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Controller
                    name="notification_email"
                    control={control}
                    defaultValue={bool(settings_data?.notification_email)}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                  <Controller
                    name="notification_sms"
                    control={control}
                    defaultValue={bool(settings_data?.notification_sms)}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">In-App Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in dashboard
                    </p>
                  </div>

                  <Controller
                    name="notification_in_apps"
                    control={control}
                    defaultValue={bool(settings_data?.notification_in_apps)}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
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
                    <Label htmlFor="directCommission">
                      Direct Commission (%)
                    </Label>
                    <Input
                      id="directCommission"
                      type="number"
                      defaultValue={COMMISSION_RULES.DIRECT * 100}
                      {...register("direct_commission", { required: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Commission for the selling realtor
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downlinerCommission">
                      Downliner Commission (%)
                    </Label>
                    <Input
                      id="downlinerCommission"
                      type="number"
                      defaultValue={COMMISSION_RULES.DOWNLINER * 100}
                      {...register("downliner_commission", { required: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Commission for the upline realtor
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyShare">Company Share (%)</Label>
                    <Input
                      id="companyShare"
                      type="number"
                      defaultValue={COMMISSION_RULES.COMPANY * 100}
                      {...register("company_commission", { required: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Remaining goes to company
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Current Rules:</strong> Direct{" "}
                    {COMMISSION_RULES.DIRECT * 100}% + Downliner{" "}
                    {COMMISSION_RULES.DOWNLINER * 100}% + Company{" "}
                    {COMMISSION_RULES.COMPANY * 100}% = 100%
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

                  <Controller
                    name="commission_payout_schedule"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        defaultValue={settings_data?.commission_payout_schedule}
                        onValueChange={field.onChange}
                      >
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
                    )}
                  />

                  <p className="text-xs text-muted-foreground">
                    Commissions are processed weekly on this day
                  </p>
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
                      <p className="text-sm text-muted-foreground">
                        Full payment at once
                      </p>
                    </div>

                    <Controller
                      name="full_payment_plan"
                      control={control}
                      defaultValue={bool(settings_data?.full_payment_plan)}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">3-Month Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Split into 3 payments
                      </p>
                    </div>

                    <Controller
                      name="three_payment_plan"
                      control={control}
                      defaultValue={bool(settings_data?.three_payment_plan)}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">6-Month Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Split into 6 payments
                      </p>
                    </div>

                    <Controller
                      name="six_payment_plan"
                      control={control}
                      defaultValue={bool(settings_data?.six_payment_plan)}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">10-Month Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Split into 10 payments
                      </p>
                    </div>

                    <Controller
                      name="ten_payment_plan"
                      control={control}
                      defaultValue={bool(settings_data?.ten_payment_plan)}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
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
                      {...register("interest_rate", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestPeriod">Applied Every</Label>

                    <Controller
                      name="interest_period"
                      control={control}
                      defaultValue={bool(settings_data?.interest_period)}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="1">1 Month</SelectItem>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-sm text-warning">
                    <strong>Current Rule:</strong>{" "}
                    {INSTALLMENT_INTEREST_RATE * 100}% interest is applied every
                    3 months on outstanding balance
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
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate commissions on sale completion
                    </p>
                  </div>

                  <Controller
                    name="automation_commission"
                    control={control}
                    defaultValue={bool(settings_data?.automation_commission)}
                    render={({ field }) => (
                      <Switch
                        checked={automations?.commissionCalculation}
                        onCheckedChange={(checked) =>
                          setAutomations((prev) => ({
                            ...prev,
                            commissionCalculation: checked,
                          }))
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Payout Generation</p>
                    <p className="text-sm text-muted-foreground">
                      Generate payout reports every Friday
                    </p>
                  </div>

                  <Controller
                    name="automation_payout"
                    control={control}
                    defaultValue={bool(settings_data?.automation_payout)}
                    render={({ field }) => (
                      <Switch
                        checked={automations?.weeklyPayout}
                        onCheckedChange={(checked) =>
                          setAutomations((prev) => ({
                            ...prev,
                            weeklyPayout: checked,
                          }))
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Payment Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send reminders before payment due dates
                    </p>
                  </div>
                  <Controller
                    name="automation_payment_reminders"
                    control={control}
                    defaultValue={bool(settings_data?.automation_payment_reminders)}
                    render={({ field }) => (
                      <Switch
                        checked={automations?.paymentReminders}
                        onCheckedChange={(checked) =>
                          setAutomations((prev) => ({
                            ...prev,
                            paymentReminders: checked,
                          }))
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Overdue Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Notify admins of overdue payments
                    </p>
                  </div>
                  <Controller
                    name="automation_overdue_alert"
                    control={control}
                    defaultValue={bool(settings_data?.automation_overdue_alert)}
                    render={({ field }) => (
                      <Switch
                        checked={automations?.overdueAlerts}
                        onCheckedChange={(checked) =>
                          setAutomations((prev) => ({
                            ...prev,
                            overdueAlerts: checked,
                          }))
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Performance Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Notify realtors of their performance metrics
                    </p>
                  </div>
                  <Controller
                    name="automation_performance"
                    control={control}
                    defaultValue={bool(settings_data?.automation_performance)}
                    render={({ field }) => (
                      <Switch
                        checked={automations?.performanceNotifications}
                        onCheckedChange={(checked) =>
                          setAutomations((prev) => ({
                            ...prev,
                            performanceNotifications: checked,
                          }))
                        }
                      />
                    )}
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
                  {[
                    "Super Admin",
                    "Manager",
                    "Finance Admin",
                    "Sales Admin",
                    "Marketing Admin",
                  ].map((role) => (
                    <div key={role} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{role}</p>
                            <p className="text-sm text-muted-foreground">
                              {role === "Super Admin"
                                ? "Full system access"
                                : "Limited access"}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "View Dashboard",
                          "Manage Users",
                          "View Analytics",
                          "Manage Payments",
                          "Manage Properties",
                        ].map((permission, i) => (
                          <span
                            key={permission}
                            className={`text-xs px-2 py-1 rounded-full ${
                              role === "Super Admin" ||
                              (i < 3 && role === "Manager")
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
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

          {/* General Settings */}
          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="address">Webhook</Label>
                    <Input
                      id="webhook"
                      name="webhook_address"
                      defaultValue={bool(settings_data?.webhook_address)}
                      {...register("webhook", { required: false })}
                    />
                  </div>
                </div>
              </CardContent>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">API-KEY</Label>
                    <Input
                      id="api-key"
                      name="api_key"
                      className="w-full"
                      defaultValue={bool(settings_data?.api_key)}
                      {...register("api_key", { required: false })}
                    />
                  </div>
                  <div className="space-y-2 flex items-end ">
                    <button
                      type="button"
                      className="px-6 py-2 rounded-md bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                    >
                      <RefreshCw className="inline mr-2" />
                      Refresh API Key
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
