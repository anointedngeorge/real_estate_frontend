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
import { create_object } from "@/lib/axios_functions";
import {
  RealtorCreateInterface,
  ResponseInterface,
} from "@/interfaces/general";

export const CreateRealtor = () => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: implement update  function
  const submitHandler = async (e: RealtorCreateInterface) => {
    const userdata: RealtorCreateInterface = e;
    const dt: ResponseInterface =
      await create_object<RealtorCreateInterface>(
        userdata,
        "realtors/register_new_realtor",
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
          Add Realtor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md  lg:max-w-screen-lg ">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new realtor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                placeholder="FirstName"
                id="firstName"
                {...register("first_name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                placeholder="LastName"
                id="lastName"
                {...register("last_name", { required: true })}
              />
            </div>
          </div>

          {/* financial information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Email Address"
                {...register("password", { required: true })}
              />
            </div>
            
            {/* <div className="space-y-2">
              <Label htmlFor="bank_type">Bank Type</Label>
              <Controller
                name="bank_type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"savings"}>Savings</SelectItem>
                      <SelectItem value={"current"}>Current</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div> */}
          </div>
          

           <div className="grid gap-4 sm:grid-cols-2">
            
            <div className="space-y-2">
              <Label htmlFor="password">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+234"
                {...register("phone_number", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsor">Who Referred You?</Label>
              <Input
                id="sponsor"
                placeholder="sponsor code"
                {...register("sponsor", { required: false })}
              />
            </div>

          </div>

          <div className="mt-3">
            <Button type="submit">Create New Realtor</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
