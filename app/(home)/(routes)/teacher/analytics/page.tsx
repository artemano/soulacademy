//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/charts";
import { auth } from "@/actions/auth";

const AnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Ingresos"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Total Ventas"
          value={totalSales}
        />
      </div>
      <Chart
        data={data}
      />
    </div>
  );
}

export default AnalyticsPage;