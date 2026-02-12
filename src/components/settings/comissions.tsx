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

export const CommissionSettings = ({control, settings_data, register}) => {

  return (
    
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
                    value={settings_data.commission_payout_schedule}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue  />
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
   
  );
};
