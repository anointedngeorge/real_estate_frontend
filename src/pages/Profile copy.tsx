import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/context/DashboardContext";
import { Camera, Mail, Phone, Shield, Calendar, MapPin, Edit2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { get_user_details, useUser } from "@/lib/axios_functions";
import { UUID } from "crypto";


interface userProfile {
    id:string,
    first_name:string,
    last_name:string,
    phone:string,
    username:string,
    email:string,
    role:string,
    date_joined:string,
    login_histories: []
}

export default function Profile() {
  const { user} = useDashboard();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data : {data}, isLoading, error } = useUser();
//   const [profileData, setProfile] = useState<userProfile>(data)

  const profileData:userProfile = data;
  const [form, setForm] = useState(data);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
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
                  {profileData?.first_name }
                  {profileData?.last_name}
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
              {roleLabel(profileData?.role || '')}
            </Badge>
            <Separator className="my-4 w-full" />
            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profileData?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profileData?.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profileData?.username || ''}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {/* <span>Joined {new Date(profileData.date_joined).toLocaleDateString("en-NG", { year: "numeric", month: "long" })}</span> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Update your personal details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.first_name}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.last_name}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  disabled={!isEditing}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="username">username</Label>
              <Input
                id="username"
                value={form.username}
                disabled={!isEditing}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div> */}

            <Separator />

            <div>
              <CardTitle className="text-lg mb-1">Security</CardTitle>
              <CardDescription>Manage your password</CardDescription>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" disabled={!isEditing} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" disabled={!isEditing} placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
