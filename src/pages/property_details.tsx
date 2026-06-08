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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/context/DashboardContext";
import {
  Camera,
  Mail,
  Phone,
  Shield,
  Calendar,
  MapPin,
  Edit2,
  Save,
  Plus,
  User2Icon,
  TextIcon,
  FileBarChart2,
  ArrowBigLeft,
  DeleteIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  update_object_info,
  useUserListing,
} from "@/lib/axios_functions";
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
import { Image } from "@radix-ui/react-avatar";
import { formatCurrency } from "@/data/mockData";


export default function PropertyDetails() {
  
  const { user } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const propID = location.state.propID;
  const [form, setForm] = useState<PropertyListInterface>();
  const [objectData, setObjectData] = useState<PropertyListInterface>();

  // fetch user details using the propID from location state
  const { data, isLoading, error } = useUserListing({
    id: propID,
    url: "/properties/list?",
  });

  console.log(data, "loading...")

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
    const userdata: PropertyUpdateInterface = {
      id: propID,
      data: e,
    };

    const dt: ResponseInterface = await update_object_info<PropertyUpdateInterface>(userdata,  'properties/update');

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
            <h3 className="mt-4 text-lg font-semibold">
              {objectData?.name}
            </h3>
        
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold"> {objectData?.location} </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold"> Actual Price:  {formatCurrency(objectData?.actual_price)} </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold"> Selling Price:  {formatCurrency(objectData?.selling_price)} </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span className="text-black font-bold"> {objectData?.description} </span>
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
                  <Label htmlFor="firstName">Property Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={form?.name}
                    disabled={!isEditing}
                    {...ProfileRegister("name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="lastName"
                    defaultValue={form?.location}
                    disabled={!isEditing}
                    {...ProfileRegister("location", { required: true })}
                  />
                </div>
              </div>
              {/* <div className="grid gap-4 sm:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <br />

                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>

                          {Object.entries(roleLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    defaultValue={form?.phone_number}
                    disabled={!isEditing}
                    {...ProfileRegister("phone_number", { required: true })}
                  />
                </div>
              </div> */}

              {/* financial information */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="image"
                    defaultValue={form?.image}
                    disabled={!isEditing}
                    {...ProfileRegister("image", { required: false })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Actual Price">Actual Price</Label>
                  <Input
                    id="actual_price"
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
                <div className="space-y-2">
                  <Label htmlFor="lastName">Property Type</Label>
                  <Controller
                    name="property_type"
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
                          <SelectItem value={null}>Account Types</SelectItem>
                          <SelectItem value={"savings"}>Savings</SelectItem>
                          <SelectItem value={"current"}>Current</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button>Update</Button>
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
