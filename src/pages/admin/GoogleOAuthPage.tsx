import AdminLayout from "@/components/admin/AdminLayout";
import GoogleOAuthSettings from "@/components/admin/GoogleOAuthSettings";
import { Helmet } from "react-helmet-async";

const GoogleOAuthPage = () => {
  return (
    <>
      <Helmet>
        <title>Google OAuth Settings | Admin - Pawsfam</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Google OAuth Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure Google Sign-In for your application
            </p>
          </div>
          <GoogleOAuthSettings />
        </div>
      </AdminLayout>
    </>
  );
};

export default GoogleOAuthPage;
