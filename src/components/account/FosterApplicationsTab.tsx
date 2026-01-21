import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Check, Clock, XCircle, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface FosterApplicationsTabProps {
  userId: string;
}

export const FosterApplicationsTab = ({ userId }: FosterApplicationsTabProps) => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["user-foster-applications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foster_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-primary/10 text-primary gap-1">
            <Check className="w-3 h-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-600 gap-1">
            <Home className="w-3 h-3" /> Active Foster
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foster Applications</CardTitle>
        <CardDescription>
          View your foster care applications and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : applications?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            You haven't submitted any foster applications yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications?.map((application) => (
              <div
                key={application.id}
                className="p-4 bg-muted rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Foster Application</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted {format(new Date(application.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Housing</p>
                    <p className="capitalize">{application.housing_type || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Pets</p>
                    <p>{application.preferred_pet_types?.join(", ") || "Any"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Has Yard</p>
                    <p>{application.has_yard ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="capitalize">{application.availability || "Not specified"}</p>
                  </div>
                </div>
                {application.admin_notes && application.status !== "pending" && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Admin Notes:</p>
                    <p className="text-sm">{application.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
