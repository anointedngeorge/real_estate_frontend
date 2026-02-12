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
import { GeneralSettings } from "@/components/settings/general";
import { CommissionSettings } from "@/components/settings/comissions";
import { PaymentSettings } from "@/components/settings/payments";
import { AutomationSettings } from "@/components/settings/automation";
import { RoleSettings } from "@/components/settings/roles";
import { NetworkSettings } from "@/components/settings/network";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const settingsHandler = async (e) => {
    const formattedString = JSON.stringify(e);
    await system_settings(formattedString);
    
    globalThis.alert("Settings Saved")
  };

  const { data, isLoading, error } = useSettings();

  if (isLoading) {
    return null;
  }
  const settings_data = data.data;
  globalThis.localStorage.setItem("real_estate_settings", JSON.stringify(settings_data));

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
        <GeneralSettings control={control} settings_data={settings_data} register={register} />

        {/* Commission Settings */}
        <CommissionSettings control={control} settings_data={settings_data} register={register} />

        {/* Payment Settings */}
        <PaymentSettings control={control} settings_data={settings_data} register={register} />

        {/* Automation Settings */}
        <AutomationSettings control={control} settings_data={settings_data} register={register} />

        {/* Role Settings */}
        <RoleSettings control={control} settings_data={settings_data} register={register} />

        {/* network Settings */}
        <NetworkSettings control={control} settings_data={settings_data} register={register} />
      </Tabs>
      </form>
    </div>
  );
}
