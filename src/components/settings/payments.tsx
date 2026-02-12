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

export const PaymentSettings = ({control, settings_data, register}) => {

  return (

      <TabsContent value="payments" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Installment Plans</CardTitle>
            <CardDescription>Configure available payment plans</CardDescription>
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
                  defaultValue={bool(settings_data.full_payment_plan)}
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
                  defaultValue={parseInt(settings_data.interest_rate)}
                  {...register("interest_rate", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestPeriod">Applied Every</Label>

                <Controller
                  name="interest_period"
                  control={control}
                  defaultValue={settings_data.interest_period }
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
                <strong>Current Rule:</strong> {INSTALLMENT_INTEREST_RATE * 100}
                % interest is applied every 3 months on outstanding balance
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
  );
};
