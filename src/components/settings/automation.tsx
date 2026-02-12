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
import { bool } from "@/helpers/lib";

export const AutomationSettings = ({ control, settings_data, register }) => {
  const [automations, setAutomations] = useState({
    commissionCalculation: true,
    weeklyPayout: true,
    paymentReminders: true,
    overdueAlerts: true,
    performanceNotifications: true,
  });

  return (
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
              defaultValue={bool(settings_data.automation_commission)}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange }
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
              defaultValue={bool(settings_data.automation_payout)}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange }
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
              defaultValue={bool(settings_data.automation_payment_reminders)}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange }
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
              defaultValue={bool(settings_data.automation_overdue_alert)}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange }
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
              defaultValue={bool(settings_data.automation_performance)}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange }
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
