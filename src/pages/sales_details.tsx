import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/context/DashboardContext";
import { CheckSquare2, Edit2, Save, TextIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { update_object_info, useUserListing } from "@/lib/axios_functions";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  SalesOutInterface,
  SalesPaymentPlanOutInterface,
} from "@/interfaces/general";
import { Link, useLocation } from "react-router-dom";
import { ToastComponent } from "@/components/dashboard/ToastComponent";

import { formatCurrency } from "@/data/mockData";
import { v4 as uuidv4 } from "uuid";
import { PaymentPlanLabel } from "@/data/constant";
import { ResultProps, SalesServices } from "@/services/SalesServices";

const ReferralList = ({ objectData }: { objectData: SalesOutInterface }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Realtor</CardTitle>
          <CardDescription>Realtor Details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <strong>First Name:</strong>{" "}
              {objectData?.realtor?.referralList?.realtor?.first_name}
            </li>

            <li>
              <strong>Last Name:</strong>{" "}
              {objectData?.realtor?.referralList?.realtor?.last_name}
            </li>

            <li>
              <strong>Bank Name:</strong>{" "}
              {objectData?.realtor?.referralList?.realtor?.bank_name ?? "-"}
            </li>

            <li>
              <strong>Account Number:</strong>{" "}
              {objectData?.realtor?.referralList?.realtor?.bank_number ?? "-"}
            </li>
          </ul>
        </CardContent>
        <CardFooter className="justify-start gap-2">
          <Button>Pay</Button>
          <Button className="bg-orange-400 text-white">Commission List</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor</CardTitle>
          <CardDescription>Sponsor Details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <strong>First Name:</strong>{" "}
              {objectData?.realtor?.referralList?.sponsor?.first_name}
            </li>

            <li>
              <strong>Last Name:</strong>{" "}
              {objectData?.realtor?.referralList?.sponsor?.last_name}
            </li>

            <li>
              <strong>Bank Name:</strong>{" "}
              {objectData?.realtor?.referralList?.sponsor?.bank_name ?? "-"}
            </li>

            <li>
              <strong>Account Number:</strong>{" "}
              {objectData?.realtor?.referralList?.sponsor?.bank_number ?? "-"}
            </li>
          </ul>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button>Pay</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PaymentPlanTable = ({
  table_object,
  salesService,
  object_data,
}: {
  table_object: SalesPaymentPlanOutInterface[];
  salesService: SalesServices;
  object_data?: SalesOutInterface;
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Billing Type</TableHead>
            <TableHead>Billing Period Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount To Pay</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {table_object?.map((item, index) => (
            <TableRow key={`plan_${item.billing_name}_${index}`}>
              <TableCell>{index + 1}</TableCell>

              <TableCell>{item.billing_name}</TableCell>

              <TableCell>{item.billing_period_number}</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>

              <TableCell>
                {formatCurrency(item.billing_amount_to_pay)}
              </TableCell>

              <TableCell>
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <Button
                      type="button"
                      disabled={item.status === "completed"}
                      onClick={() =>
                        salesService.initiatePayment({
                          sales_id: object_data?.id,
                          billing_amount_to_pay: item.billing_amount_to_pay,
                          billing_date: item.billing_date,
                          id: item.id,
                        })
                      }
                    >
                      {item.status === "completed" ? "Paid" : "Pay"}
                    </Button>
                  </div>
                  <div>
                    {item.status === "completed" ? (
                      <Button
                        disabled={item.status === "completed"}
                        className="bg-red-600 hover:bg-red-700"
                        type="button"
                        onClick={() =>
                          salesService.initiatePayment({
                            sales_id: object_data?.id,
                            billing_amount_to_pay: item.billing_amount_to_pay,
                            billing_date: item.billing_date,
                            id: item.id,
                          })
                        }
                      >
                        Revoke
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function SalesDetails() {
  const { user } = useDashboard();
  const location = useLocation();

  const saleID = location.state.saleID;
  const [form, setForm] = useState<SalesOutInterface>();
  const [objectData, setObjectData] = useState<SalesOutInterface>();
  const [paymentPlans, setPaymentPlans] = useState<ResultProps>();
  const [billingName, setBillingName] = useState<"week" | "month" | string>(
    "week",
  );
  const [billingDateNumber, setBillingDateName] = useState<number>(2);

  const salesService = new SalesServices();

  const GeneratePaymentPlan = () => {
    if (billingName == undefined) {
      alert("Empty field name (Billing Name).");
    }

    const result = salesService.paymentPlanSpread({
      billing_name: billingName,
      billing_date_number: billingDateNumber,
      sales_date: new Date(objectData?.sales_date),
    });

    setPaymentPlans(result);
  };

  // fetch user details using the propID from location state
  const { data, isLoading, error } = useUserListing({
    id: saleID,
    url: "/sales/list?",
  });

  useEffect(() => {
    if (data) {
      setObjectData(data?.items[0]);
    }
  }, [data]);

  const sales_plan_list = objectData?.payment_plan_list;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setForm(objectData);
    // setPermissionData(profileData.permissions);
  }, [objectData]);

  // shorten the property like
  const remainingBalance =
    Number(
      objectData?.properties?.selling_price > 0
        ? objectData?.properties?.selling_price
        : objectData?.properties?.actual_price,
    ) - Number(objectData?.amount);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`View Sales Details -  (${objectData?.properties?.name} )`}
        description="View and manage your account information"
      >
        <Link to={"/sales/list"}> Back </Link>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative">
              <img src={objectData?.properties?.image} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {objectData?.properties?.name}
            </h3>

            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" Sales Date: "}
                  {objectData?.sales_date}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Sales Amount: {formatCurrency(objectData?.amount)}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Actual Price:{" "}
                  {formatCurrency(objectData?.properties?.actual_price)}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Selling Price:{" "}
                  {formatCurrency(objectData?.properties?.selling_price)}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-green-500 font-bold">
                  Remaining Balance: {formatCurrency(remainingBalance)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Sales Amount: {formatCurrency(objectData?.amount)}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-gray-500 p-2 rounded-s font-bold ">
                  {" Realtor: "}
                  {objectData?.realtor?.first_name}{" "}
                  {objectData?.realtor?.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-gray-950 p-2 rounded-s font-bold ">
                  {" Client: "}
                  {objectData?.client?.first_name}{" "}
                  {objectData?.client?.last_name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              <b>Payment Plan:</b>{" "}
              <span className="px-4 py-2 bg-green-700 rounded-md text-white">
                {PaymentPlanLabel[objectData?.payment_plan]}{" "}
              </span>
            </CardTitle>
            <CardDescription>
              Generate A Payment Break down Plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="password">Billing In Week/Month</Label>
                  <Controller
                    name="billing_name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value); // Update RHF
                          setBillingName(value); // Update local state
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                          {["week", "month"].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label>Weeks/Month</label>
                  <Input
                    type="number"
                    value={billingDateNumber}
                    onChange={(e) =>
                      setBillingDateName(parseInt(e.currentTarget.value))
                    }
                    min={2}
                  />
                </div>
                <div className="w-32">
                  <label htmlFor="">Action</label>
                  <Button
                    onClick={GeneratePaymentPlan}
                    disabled={sales_plan_list?.length > 0 ? true : false}
                  >
                    Generate Payment Plans{" "}
                  </Button>
                </div>
              </div>
            </div>

            {/* form */}

            {paymentPlans?.dates?.map((item, index) => (
              <div
                className="grid md:grid-cols-3 gap-3 border-b-2 p-2"
                key={`${item}_${index}`}
              >
                <div>
                  <b>{item}</b>
                </div>
                <div>
                  <b>{paymentPlans?.date_to_string[index]}</b>{" "}
                </div>
                <div>
                  <b>
                    {formatCurrency(
                      remainingBalance / paymentPlans?.billing_date_number,
                    )}
                  </b>{" "}
                </div>
              </div>
            ))}

            <div className="mt-12">
              <h3 className="font-bold">Existing Payment Plans</h3>
              <PaymentPlanTable
                table_object={sales_plan_list}
                salesService={salesService}
                object_data={objectData}
              />
            </div>

            <div className="grid md:grid-cols-1">
              {paymentPlans?.dates.length > 0 ? (
                <Button
                  onClick={(e) =>
                    salesService.savePaymentPlan({
                      billing_dates: paymentPlans?.dates,
                      billing_name: paymentPlans?.billing_name,
                      sales_id: objectData?.id,
                      billing_period_number: parseInt(
                        paymentPlans.billing_date_number.toString(),
                      ),
                    })
                  }
                  className="w-full"
                >
                  Save
                </Button>
              ) : (
                " "
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Commission Break-down Information
            </CardTitle>
            <CardDescription>Commission Break-down</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... */}
            <ReferralList objectData={objectData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
