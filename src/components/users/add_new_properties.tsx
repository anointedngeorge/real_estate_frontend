import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { create_object } from "@/lib/axios_functions";
import { PropertyLabel, StatusLabel } from "@/data/constant";
import {
  PropertyInterface,
  PropertyUpdateInterface,
  ResponseInterface,
} from "@/interfaces/general";

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  manager: "Manager",
  finance_admin: "Finance Admin",
  sales_admin: "Sales Admin",
  marketing_admin: "Marketing Admin",
  admin: "",
  buyer: "",
  agent: "",
};

export const CreateProperties = () => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: implement update  function
  const propertyHandler = async (e: PropertyInterface) => {

    const userdata: PropertyInterface = e;
    const dt: ResponseInterface =
      await create_object<PropertyInterface>(
        userdata,
        "properties/create_property",
      );

    if (dt.status == true) {
      globalThis.location.reload();
    }
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md  lg:max-w-screen-lg ">
        <form onSubmit={handleSubmit(propertyHandler)}>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>Create a new properties.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="lastName"
                {...register("location", { required: true })}
              />
            </div>
          </div>

          {/* financial information */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="account_name">Image</Label>
              <Input id="image" {...register("image", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual_price">Actual Price</Label>
              <Input
                id="actual_price"
                {...register("actual_price", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register("description", { required: true })}
              />
            </div>
          </div>

          {/* price information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lastName">Property Type</Label>
              <Controller
                name="property_types"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value={null}>Account Types</SelectItem> */}
                      {Object.entries(PropertyLabel).map(([value, label]) => (
                        <SelectItem key={label} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Property Status {":  "}</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Status</SelectItem>
                      {Object.entries(StatusLabel).map(([value, label]) => (
                        <SelectItem key={label} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Create New Property </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
