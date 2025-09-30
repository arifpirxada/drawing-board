import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardFiles from "./DashboardFiles";

const Dashboard = () => {
  const [viewProfile, setViewProfile] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  return (

    <>
      <DashboardHeader sidebar={ sidebar } setSidebar={ setSidebar } setViewProfile={ setViewProfile } viewProfile={ viewProfile } />

      <Sidebar sidebar={ sidebar } />

      <DashboardFiles />
    </>
  );
};

export default Dashboard;
