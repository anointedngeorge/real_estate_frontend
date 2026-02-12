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




export const NetworkSettings = ({control, settings_data,  register}) => {
    

    return (
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
    );
}