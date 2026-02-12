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




export const RoleSettings = ({control, settings_data,  register}) => {
    

    return (
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
    );
}