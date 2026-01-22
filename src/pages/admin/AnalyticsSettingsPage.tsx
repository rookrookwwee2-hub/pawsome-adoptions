import AdminLayout from "@/components/admin/AdminLayout";
import AnalyticsSettings from "@/components/admin/AnalyticsSettings";
import { Helmet } from "react-helmet-async";

const AnalyticsSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Analytics Settings | Admin - Pawsfam</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure Google Analytics and Tag Manager for your website
            </p>
          </div>
          <AnalyticsSettings />
        </div>
      </AdminLayout>
    </>
  );
};

export default AnalyticsSettingsPage;
