import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
// export default function Dashboard() {

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//         </div>
//     </>
//   );
// }

const Dashboard = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <SignOut />
    </div>
  );
};
export default Dashboard;
