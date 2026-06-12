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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { create_object, useUserListing } from "@/lib/axios_functions";
import {
  ClientCreateInterface,
  PropertyListInterface,
  ResponseInterface,
  SalesInInterface,
} from "@/interfaces/general";
import { PaymentPlanLabel, SalesStatusLabel } from "@/data/constant";

export const CreateNewSales = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { data: properties, isLoading, error } = useUserListing({ page: 1, url:'/properties/list?'});
  const propty: PropertyListInterface[] = properties?.items



  // TODO: implement update  function
  const submitHandler = async (e: SalesInInterface) => {
    const userdata: SalesInInterface = e;
    console.log(userdata)
    const dt: ResponseInterface =
      await create_object<SalesInInterface>(
        userdata,
        "sales/create_new_sales",
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
          Create Sales
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md  lg:max-w-screen-lg ">
        <DialogHeader>
          <DialogTitle>Create New Sales</DialogTitle>
          <DialogDescription>Create a new sales record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="property">Properties</Label>
              <Controller
                name="properties_id"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propty.map(item => (
                          <SelectItem key={item?.id} value={item?.id}> {item?.name} </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client Email</Label>
              <Input
                type="email"
                placeholder="client email"
                id="lastName"
                {...register("client", { required: true })}
              />
            </div>
          </div>

          {/* financial information */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email">Realtor's Email</Label>
              <Input
                id="email"
                type="email"
                {...register("realtor", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Payment Plan</Label>
              <Controller
                name="payment_plan"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PaymentPlanLabel).map(item => (
                        <SelectItem  key={item} value={ item }> {PaymentPlanLabel[item]} </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank_type">Status</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SalesStatusLabel).map(item => (
                        <SelectItem  key={item} value={ item }> {SalesStatusLabel[item]} </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          

           <div className="grid gap-4 sm:grid-cols-1">
            
            <div className="space-y-2">
              <Label htmlFor="password">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="000000"
                {...register("amount", { required: true })}
              />
            </div>

          </div>

          <div className="mt-3">
            <Button type="submit">Create New Sales Record</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
