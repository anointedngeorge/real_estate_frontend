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
  update_user_suspended,
  useUserListing,
  useUserRolePermissions,
} from "@/lib/axios_functions";
import { UUID } from "crypto";
import { Controller, useForm } from "react-hook-form";
import {
  UserProfile,
  UserProfileUpdate,
  UserProfileUpdate2,
} from "@/interfaces/auth";
import {
  ResponseInterface,
  UserRolePermissionInterface,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { roleLabels } from "@/data/constant";

interface CheckPermissionInterface {
  id: string;
  name: string;
}

export default function ClientProfile() {
  const { user } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const userID = location.state?.userID;
  const [form, setForm] = useState<UserProfile>();
  const [profileData, setProfileData] = useState<UserProfile>();

  // fetch user details using the userID from location state
  const { data, isLoading, error } = useUserListing({ id: userID });

  useEffect(() => {
    if (data) {
      setProfileData(data?.items[0]);
    }
  }, [data]);

  const {
    register: ProfileRegister,
    handleSubmit: ProfileHandleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: PasswordRegister,
    handleSubmit: PasswordHandleSubmit,
    formState: { errors: pass_error },
  } = useForm();

  useEffect(() => {
    setForm(profileData);
    // setPermissionData(profileData.permissions);
  }, [profileData]);

  const handleSave = () => {
    setIsEditing(false);
    ToastComponent({
      title: "Profile Updated",
      content: "Your profile has been updated successfully.",
    });
  };

  // TODO: implement update  function
  const profileHandler = async (e: UserProfileUpdate) => {
    const userdata: UserProfileUpdate2 = {
      user_id: userID,
      data: e,
    };

    const dt: ResponseInterface = await update_object_info<UserProfileUpdate2>(userdata);

    if (dt.status == true) {
      globalThis.location.reload();
    }
  };

  const passwordChangeHandler = async (e: React.FormEvent) => {
    const password1 = e["password1"];
    const password2 = e["password2"];
    // console.log("loading...", e, password1, password2)
  };

  const roleLabel = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  function handlePermission(perm_id: string, perm_name: string): void {
    console.log("Permission toggled:", perm_id, perm_name);
  }

  // suspend user function
  async function suspendUser(user_id: string) {
    const confirm = window.confirm(
      "Are you sure you want to toggle the suspension status of this account?",
    );
    if (confirm) {
      const user_suspend_account: ResponseInterface =
        await update_user_suspended(user_id);
      if (user_suspend_account?.status) {
        ToastComponent({
          title: "Account Suspended",
          content: "The user's account has been suspended.",
        });
        globalThis.location.reload();
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`My Profile - ${profileData?.first_name} ${profileData?.last_name}`}
        description="View and manage your account information"
      >
        <Link to={"/users/list"}> Back </Link>
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
      <div
        className={`md:col-span-1 p-3 border ${!profileData?.is_active ? "bg-red-100 border-red-200" : "bg-green-100 border-green-200"} rounded-md text-center `}
      >
        This Account is {profileData?.is_active ? "Active" : "Inactive"}
      </div>
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
                    defaultValue={form?.first_name}
                    disabled={!isEditing}
                    {...ProfileRegister("first_name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={form?.last_name}
                    disabled={!isEditing}
                    {...ProfileRegister("last_name", { required: true })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1">
              
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  
                  <Input
                    id="phone"
                    defaultValue={form?.phone_number}
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

      {/* Manage Permissions */}
      <div className="grid gap-6 md:grid-cols-1">
        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Role Permissions</CardTitle>
            <CardDescription>
              This can be edited by administrators only.
            </CardDescription>
            {/* {JSON.stringify(profileData?.permissions)} */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {profileData?.permissions?.permissions?.map((perm) => (
                <div
                  className="space-y-2 grid grid-cols-2 items-center"
                  key={perm?.id}
                >
                  <p className="font-medium text-green-500">
                    {`${perm?.name}`.split("_").join(" ").toUpperCase()}
                  </p>
                  <Input
                    id="role"
                    type="checkbox"
                    disabled={true}
                    defaultChecked={true}
                  />
                </div>
              ))}
            </div>
            {/* extra permissions */}

            <h3 className="text-md font-medium">Extra Permissions</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {profileData?.permissions?.extra_permissions?.map((perm) => (
                <div
                  className="space-y-2 grid grid-cols-2 items-center"
                  key={perm?.id}
                >
                  <p className="font-medium text-green-500">
                    {`${perm?.name}`.split("_").join(" ").toUpperCase()}
                  </p>
                  <Input
                    id="role"
                    type="checkbox"
                    defaultChecked={false}
                    onChange={() => handlePermission(perm?.id, perm?.name)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login histories */}
      <div className="grid gap-6 md:grid-cols-1">
        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Login Histories</CardTitle>
            <CardDescription>
              Showing the last 5 login histories. This can be edited by
              administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Login Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {profileData?.login_histories?.length ? (
                  profileData.login_histories.slice(0, 5).map(
                    (
                      history: {
                        id: string;
                        location: string;
                        platform: string;
                        agent: string;
                        l_date: string;
                      },
                      index,
                    ) => (
                      <TableRow key={history.id || index}>
                        <TableCell className="font-medium">
                          {history.location || "Unknown"}
                        </TableCell>

                        <TableCell>
                          <span className="rounded-md bg-muted px-2 py-1 text-xs">
                            {history.platform || "Unknown"}
                          </span>
                        </TableCell>

                        <TableCell className="max-w-[250px] truncate">
                          {history.agent || "Unknown"}
                        </TableCell>

                        <TableCell className="text-right text-muted-foreground">
                          {history.l_date
                            ? new Date(history.l_date).toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No login history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
              <div>
                <Button
                  onClick={() => suspendUser(profileData?.id)}
                  className={`w-full text-white ${profileData?.is_active ? "hover:bg-red-600 bg-red-500" : "bg-green-500 hover:bg-green-600"}  `}
                >
                  {profileData?.is_active ? "Suspend Account" : "Activate Account"}
                </Button>
              </div>
              <div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
