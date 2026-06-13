import { useState } from "react";
import { Plus, Trash } from "lucide-react";
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
import { PropertyInterface, ResponseInterface } from "@/interfaces/general";

import { v4 as uuidv4 } from "uuid";

const PropertyPlots = ({
  control,
  id,
  removeFeature,
  features,
  profileRegister,
}) => {
  // const status = features.length > 1 ? false : true;
  const status = false;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="description">Plot Number</Label>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              id={`number${id}`}
              placeholder="Plot Number"
              {...profileRegister(`plot_number.${id}`)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Plot Price</Label>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              id={`plot_price${id}`}
              type="number"
              title="plot price"
              placeholder="Value"
              {...profileRegister(`plot_price.${id}`)}
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            disabled={status}
            onClick={() => removeFeature(id)}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CreateProperties = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyPlotsFeatures, setPropertyPlots] = useState<string[]>([]);

  const addPlots = () => {
    const uid = uuidv4();
    setPropertyPlots((prev) => [...prev, uid]);
  };

  const removePlots = (id: string) => {
    setPropertyPlots((prev) => prev.filter((item) => item !== id));
  };

  function checkEmpty(data: Object) {
    return Object.keys(data).length !== 0;
  }
  // TODO: implement update  function
  const propertyHandler = async (e: PropertyInterface) => {
    const userdata: PropertyInterface = e;
    const plot_number = e["plot_number"];
    const plot_price = e["plot_price"];

    const plot_list = [];

    Object.keys(plot_number).map((item, index) => {
      let pList = {};
      if (checkEmpty(plot_number[item]) && checkEmpty(plot_price[item])) {
        pList["plot_number"] = plot_number[item];
        pList["plot_price"] = plot_price[item];
        pList["uid"] = item;
      }
      plot_list.push(pList);
    });

    const plots = [
      ...plot_list.filter((item) => propertyPlotsFeatures.includes(item.uid)),
    ];

    userdata.plots = plots;


    console.log(plot_list, "listing");
    console.log(propertyPlotsFeatures)

    const dt: ResponseInterface = await create_object<PropertyInterface>(
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
                  onChange(event) {
                    const evt = event?.target?.value;
                    setPropertyType(evt);
                  },
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

          <div>
            <b>Choose a property type of land to add more plots</b>
          </div>

          {/* price information */}
          <div>
            {/* add property plots */}
            <div className="grid place-content-end p-3 ">
              <Button
                disabled={propertyType != "land"}
                type="button"
                onClick={() => addPlots()}
              >
                Add Plots
              </Button>
            </div>

            <div className="min-h-60 max-h-96 overflow-x-scroll">
              {propertyPlotsFeatures.map((item) => (
                <PropertyPlots
                  key={item}
                  control={control}
                  removeFeature={removePlots}
                  features={propertyPlotsFeatures}
                  profileRegister={register}
                  id={item}
                />
              ))}
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
