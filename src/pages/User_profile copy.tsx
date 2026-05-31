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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  get_user_details,
  update_signed_user,
  useUser,
} from "@/lib/axios_functions";
import { UUID } from "crypto";
import { Controller, useForm } from "react-hook-form";
import { UserProfile } from "@/interfaces/auth";
import { ResponseInterface, UsersListingInterface } from "@/interfaces/general";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { roleLabels } from "@/data/constant";

export default function UserProfilePage() {
  const { user } = useDashboard();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>();

  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(location.state?.user);
    // console.log(user, "loading.. state")
    setProfileData(user);
  }, [location]);

  const {
    register: ProfileRegister,
    handleSubmit: ProfileHandleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: PasswordRegister,
    handleSubmit: PasswordHandleSubmit,
    formState: { errors: pass_error },
  } = useForm();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const profileHandler = async (e: any) => {
    console.log("loading...", e)
    const dt: ResponseInterface = await update_signed_user(e);
    if (dt.status == true) {
       console.log(dt.message)
      // globalThis.location.reload();
    }
  };

  const passwordChangeHandler = async (e: React.FormEvent) => {
    const password1 = e["password1"];
    const password2 = e["password2"];
    console.log("loading...", e, password1, password2);
  };

  const roleLabel = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your account information"
      >
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
              <Avatar className="h-28 w-28">
                <AvatarImage src={""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profileData?.first_name}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {profileData?.first_name} {profileData?.last_name}
            </h3>
            <Badge variant="secondary" className="mt-1">
              <Shield className="mr-1 h-3 w-3" />
              {roleLabel(profileData?.role || "")}
            </Badge>
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profileData?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profileData?.phone_number}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TextIcon className="h-4 w-4" />
                <span>{profileData?.username || ""}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined{" "}
                  {new Date(profileData?.date_joined).toLocaleDateString(
                    "en-NG",
                    { year: "numeric", month: "long" },
                  )}
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={profileData?.first_name}
                    disabled={!isEditing}
                    {...ProfileRegister("first_name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={profileData?.last_name}
                    disabled={!isEditing}
                    {...ProfileRegister("last_name", { required: true })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1">
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
                  {/* <Input
                    id="role"
                    type="role"
                    defaultValue={profileData?.role}
                    disabled={!isEditing}
                    {...ProfileRegister("role", {required:true})}
                  /> */}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    defaultValue={profileData?.phone_number}
                    disabled={!isEditing}
                    {...ProfileRegister("phone_number", { required: true })}
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

      {/* security */}

      <div className="grid gap-6 md:grid-cols-1">
        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Security Information</CardTitle>
            <CardDescription>
              Update your Password details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={PasswordHandleSubmit(passwordChangeHandler)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    required={true}
                    disabled={!isEditing}
                    placeholder="••••••••"
                    {...PasswordRegister("password1", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    required={true}
                    disabled={!isEditing}
                    placeholder="••••••••"
                    {...PasswordRegister("password2", { required: true })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button>Update Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/*  */}
    </div>
  );
}
