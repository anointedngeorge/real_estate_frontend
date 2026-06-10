import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/context/DashboardContext";
import { Edit2, Save, TextIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { update_object_info, useUserListing } from "@/lib/axios_functions";
import { Controller, useForm } from "react-hook-form";

import {
  PropertyInterface,
  PropertyListInterface,
  PropertyUpdateInterface,
  ResponseInterface,
} from "@/interfaces/general";
import { Link, useLocation } from "react-router-dom";
import { ToastComponent } from "@/components/dashboard/ToastComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/data/mockData";
import { FeaturesLabel, PropertyLabel, StatusLabel } from "@/data/constant";
import { v4 as uuidv4 } from "uuid";

const Features = ({ control, id, removeFeature , features, profileRegister}) => {
  const status = features.length > 1 ? false : true;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="extra">Extra Feature </Label>
        <Controller
          name={`extra.${id}`}
          control={control}
          rules={{
            required: false
          }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent >
                {/* <SelectItem value={null}>Account Types</SelectItem> */}
                {Object.entries(FeaturesLabel).map(([value, label]) => (
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
        <Label htmlFor="description">Content</Label>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input id="content" placeholder="Value" {...profileRegister(`extra_values.${id}` )} />
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

export default function PropertyDetails() {
  const { user } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const propID = location.state.propID;
  const [form, setForm] = useState<PropertyListInterface>();
  const [objectData, setObjectData] = useState<PropertyListInterface>();
  const [features, setFeatures] = useState([uuidv4()]);

  const addFeatures = () => {
    const uid = uuidv4();
    setFeatures((prev) => [...prev, uid]);
  };

  const removeFeature = (id: string) => {
    setFeatures((prev) => prev.filter((item) => item !== id));
  };

  // fetch user details using the propID from location state
  const { data, isLoading, error } = useUserListing({
    id: propID,
    url: "/properties/list?",
  });

  useEffect(() => {
    if (data) {
      setObjectData(data?.items[0]);
    }
  }, [data]);

  const {
    register: ProfileRegister,
    handleSubmit: ProfileHandleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setForm(objectData);
    // setPermissionData(profileData.permissions);
  }, [objectData]);

  const handleSave = () => {
    setIsEditing(false);
    ToastComponent({
      title: "Profile Updated",
      content: "Your profile has been updated successfully.",
    });
  };

  // TODO: implement update  function
  const profileHandler = async (e: PropertyInterface) => {

    const features = {};
    const extra_name  = e['extra'];
    const extra_values = e['extra_values'];

    for (const key in extra_name) {
      const name = extra_name[key];
      const value = extra_values[key]
       features[name] = value;
    }

    if ( ("extra" in e) && ("extra_values" in e) ) {
        delete e['extra'];
        delete e['extra_values'];
    }
        
    const userdata: PropertyUpdateInterface = {
      id: propID,
      data: {...e, features},
    };
  
    const dt: ResponseInterface =
      await update_object_info<PropertyUpdateInterface>(
        userdata,
        "properties/update",
      );

    if (dt.status == true) {
      globalThis.location.reload();
    }
  };

  // console.log(profileData)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`View Property -  (${objectData?.name} )`}
        description="View and manage your account information"
      >
        <Link to={"/properties/list"}> Back </Link>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative">
              <img src={objectData?.image} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{objectData?.name}</h3>

            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  {objectData?.location}{" "}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Actual Price: {formatCurrency(objectData?.actual_price)}{" "}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  Selling Price:{" "}
                  {formatCurrency(objectData?.selling_price)}{" "}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold">
                  {" "}
                  {objectData?.description}{" "}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>
              Update your personal details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={ProfileHandleSubmit(profileHandler)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    defaultValue={form?.name}
                    disabled={!isEditing}
                    {...ProfileRegister("name", { required: false })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="lastName"
                    defaultValue={form?.location}
                    disabled={!isEditing}
                    {...ProfileRegister("location", { required: false })}
                  />
                </div>
              </div>

              {/* financial information */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="account_name">Image</Label>
                  <Input
                    id="image"
                    defaultValue={form?.image}
                    disabled={!isEditing}
                    {...ProfileRegister("image", { required: false })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_price">Actual Price</Label>
                  <Input
                    id="actual_price"
                    // type="number"
                    defaultValue={form?.actual_price}
                    disabled={!isEditing}
                    {...ProfileRegister("actual_price", { required: false })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    defaultValue={form?.description}
                    disabled={!isEditing}
                    {...ProfileRegister("description", { required: false })}
                  />
                </div>
              </div>

              {/* price information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Property Type: {":  "}
                    <span>{objectData?.property_types}</span>
                  </Label>
                  <Controller
                    name="property_types"
                    control={control}
                    rules={{
                      required: false,
                      value: objectData?.property_types,
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* <SelectItem value={null}>Account Types</SelectItem> */}
                          {Object.entries(PropertyLabel).map(
                            ([value, label]) => (
                              <SelectItem key={label} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Property Status {":  "}
                    <span>{objectData?.status}</span>
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
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

              <div className="grid grid-cols-none place-content-end p-3 ">
                <Button type="button" onClick={() => addFeatures()}>
                  Add
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-none">
                {features.map((item) => (
                  <Features
                    key={item}
                    control={control}
                    removeFeature={removeFeature}
                    features={features}
                    profileRegister={ProfileRegister}
                    id={item}
                  />
                ))}
              </div>

              <div className="mt-3">
                <Button disabled={!isEditing}>Update</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Security Caution</CardTitle>
            <CardDescription>
              Take necessary precautions to ensure account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3">
              <div></div>
              {/* <div>
                <Button
                  onClick={() => alert("Not Implemented")}
                  className={`w-full text-white ${objectData?.is_active ? "hover:bg-red-600 bg-red-500" : "bg-green-500 hover:bg-green-600"}  `}
                >
                  {objectData?.is_active
                    ? "Suspend Account"
                    : "Activate Account"}
                </Button>
              </div> */}
              <div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
