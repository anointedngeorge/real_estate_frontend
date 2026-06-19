import { useState } from "react";
import { Plus } from "lucide-react";
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
  PropertyListInterface,
  PropertyPlotsInterface,
  ResponseInterface,
  SalesInInterface,
} from "@/interfaces/general";
import { PaymentPlanLabel, SalesStatusLabel } from "@/data/constant";
import { Checkbox } from "../ui/checkbox";
import { formatCurrency } from "@/data/mockData";

export const CreateNewSales = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [property_plot, setPropertiePlot] = useState<PropertyPlotsInterface[]>(
    [],
  );
  const [plotAmount, setPlotsAmount] = useState<number[]>([0]);
  const total_selected_plot_price = plotAmount.reduce((a, b) => a + b);

  const {
    data: properties,
    isLoading,
    error,
  } = useUserListing({ page: 1, url: "/properties/list?", size: 200 });
  const propty: PropertyListInterface[] = properties?.items;

  // TODO: implement update  function
  const submitHandler = async (e: SalesInInterface) => {
    const userdata: SalesInInterface = e;
    const filtered_plot_ids = Object.keys(e?.plot_ids || {}).filter(
      (prev) => e?.plot_ids[prev] == true,
    );

    if (filtered_plot_ids.length > 0) {
      userdata["plots"] = filtered_plot_ids;

      if (parseInt(userdata?.amount.toString()) > total_selected_plot_price) {
        alert("Amount Supplied is greater than the plot amount selected.");
        return;
      }
    }

    delete userdata['plot_ids_price'];
    delete userdata['plot_ids'];

    const dt: ResponseInterface = await create_object<SalesInInterface>(
      userdata,
      "sales/create_new_sales"
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
                rules={{
                  required: false,
                  onChange(event) {
                    const id = event?.target?.value;
                    const datasets: PropertyListInterface[] = [
                      ...propty.filter((prev) => prev?.id == id),
                    ];
                    //
                    if (datasets?.length > 0) {
                      const dataset: PropertyListInterface = datasets[0];
                      setPropertiePlot(dataset.plots);
                    }
                  },
                }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propty?.map((item) => (
                        <SelectItem key={item?.id} value={item?.id}>
                          {" "}
                          {item?.name}{" "}
                        </SelectItem>
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
                      {Object.keys(PaymentPlanLabel).map((item) => (
                        <SelectItem key={item} value={item}>
                          {" "}
                          {PaymentPlanLabel[item]}{" "}
                        </SelectItem>
                      ))}
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
                      {Object.keys(SalesStatusLabel).map((item) => (
                        <SelectItem key={item} value={item}>
                          {" "}
                          {SalesStatusLabel[item]}{" "}
                        </SelectItem>
                      ))}
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
                // onKeyUp={(e) => {
                //     const amt = e.currentTarget.value;
                //     if (parseInt(amt) > total_selected_plot_price) {
                //         e.currentTarget.style.border = "2px solid red"
                //     }
                // } }
                {...register("amount", { required: true })}
              />
              <span>{formatCurrency(total_selected_plot_price)}</span>
            </div>
          </div>

          {/* plots */}
          <div className="grid gap-4 sm:grid-cols-1 mt-10">
            <table>
              <thead>
                <tr className="font-extrabold ">
                  <td>Action</td>
                  <td>Plot Number</td>
                  <td>Plot Price</td>
                </tr>
              </thead>
              <tbody>
                {property_plot?.map((item: PropertyPlotsInterface) => (
                  <tr key={item?.uid}>
                    <td>
                      <Controller
                        name={`plot_ids.${item.id}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);

                              const p = Number(item.plot_price);

                              if (checked) {
                                setPlotsAmount((prev) => [...prev, p]);
                              } else {
                                setPlotsAmount((prev) =>
                                  prev.filter((price) => price !== p),
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </td>
                    <td className="font-bold text-black  ">
                      {item?.plot_number}
                    </td>
                    <td className="font-bold text-success">
                      <input
                        id="plot_id_price"
                        type="hidden"
                        className="plot_prices"
                        value={item?.plot_price}
                        {...register(`plot_ids_price.${item?.id}`)}
                      />
                      {item?.plot_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <Button type="submit">Create New Sales Record</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
