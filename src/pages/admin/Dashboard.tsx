import { useEffect, useState } from "react";
import { PawPrint, FileText, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Stats {
  totalPets: number;
  availablePets: number;
  totalAdoptions: number;
  pendingAdoptions: number;
  totalUsers: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPets: 0,
    availablePets: 0,
    totalAdoptions: 0,
    pendingAdoptions: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [petsRes, adoptionsRes, usersRes] = await Promise.all([
          supabase.from('pets').select('status'),
          supabase.from('adoptions').select('status'),
          supabase.from('profiles').select('id'),
        ]);

        const pets = petsRes.data || [];
        const adoptions = adoptionsRes.data || [];
        const users = usersRes.data || [];

        setStats({
          totalPets: pets.length,
          availablePets: pets.filter(p => p.status === 'available').length,
          totalAdoptions: adoptions.length,
          pendingAdoptions: adoptions.filter(a => a.status === 'pending').length,
          totalUsers: users.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Pets",
      value: stats.totalPets,
      subValue: `${stats.availablePets} available`,
      icon: PawPrint,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Adoptions",
      value: stats.totalAdoptions,
      subValue: `${stats.pendingAdoptions} pending`,
      icon: FileText,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      subValue: "Registered users",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Success Rate",
      value: stats.totalAdoptions > 0 
        ? `${Math.round(((stats.totalAdoptions - stats.pendingAdoptions) / stats.totalAdoptions) * 100)}%`
        : "0%",
      subValue: "Completed adoptions",
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the Pawsfam admin panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-card rounded-2xl p-6 border border-border animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {stat.subValue}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/pets"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
            >
              <PawPrint className="w-5 h-5 text-primary" />
              <span className="font-medium">Manage Pets</span>
            </a>
            <a
              href="/admin/adoptions"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
            >
              <FileText className="w-5 h-5 text-amber-500" />
              <span className="font-medium">Review Applications</span>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Manage Users</span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
