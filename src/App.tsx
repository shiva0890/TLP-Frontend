import { Suspense, createContext, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from "react-router-dom";

import AlertProvider from "./components/Context/AlertDetails";
import { Backdrop, CircularProgress } from "@mui/material";
import LoadingProvider from "./components/Context/Loading";
import AuthProvider from "./components/Auth/AuthProvider";
import PrivateRoute from "./components/Auth/PrivateRouter";
import PageLayout from "./components/Custom/PageLayout";

interface Subjects {
  subCode: string;
  subname: string;
  qtype: string;
  facID: number;
  facName: string;
}

// import showNavbar from "./components/Custom/useShowNavbar";
import Download from "./Pages/Download/Download";
import Upload from "./Pages/Upload/Upload";
import ManageDB from "./Pages/ManageDB/ManageDB";
import Report from "./Pages/Report/Report";
import ManageUsers from "./Pages/ManageUsers/ManageUsers";
import ControlForm from "./Pages/ControlForm/ControlForm";
import Backup from "./Pages/Backup/BackUp";
import UnfilledList from "./Pages/UnfilledList/UnfilledList";
import CFReport from "./Pages/CFReport/CFReport";
import Electives from "./Pages/Electives/Electives";
export const Bus = createContext<{ sub: Subjects[] | null, setSub: React.Dispatch<React.SetStateAction<Subjects[] | null>> } | null>(null);

const LoginForm = lazy(() => import("./Pages/Login/Login"));
const Feedback = lazy(() => import("./Pages/Feedback/Feedback"));
const CentralFacilities = lazy(() => import("./Pages/CentralFacilities/CentralFacilities"));
// const Report = lazy(() => import("./Pages/Report/Report"));
// const ControlForm = lazy(() => import("./Pages/ControlForm/ControlForm"));
const Sem = lazy(() => import("./Pages/Sem/Sem"));
// const Download = lazy(() => import("./Pages/Download/Download"));
// const Upload = lazy(() => import("./Pages/Upload/Upload"));
// const ManageUsers = lazy(() => import("./Pages/ManageUsers/ManageUsers"));
// const Backup = lazy(() => import("./Pages/Backup/BackUp"));
// const ManageDB = lazy(() => import("./Pages/ManageDB/ManageDB"));
const Test = lazy(() => import("./misc/Test"));
const ThankYou = lazy(() => import("./Pages/ThankYou/ThankYou"));
const CompletedFeedback = lazy(() => import("./Pages/CompletedFeedback/CompletedFeedback"));
const ShowNavbar = lazy(() => import('./components/Custom/useShowNavbar'))

function App() {
  // const nav = ;
  // const [sub, setSub] = useState<Subjects[] | null>([]);
  const router = createBrowserRouter([


    {
      path: "/login",
      element: <LoginForm />
    },
    {
      path: "/",
      element: (<>
        <ShowNavbar/>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </>
      ),
      children: [
        {
          path: "/",
          element: <PrivateRoute />,

          children: [
            {
              path: "/feedback",
              element: <Feedback />,
            },
            {
              path: "/report",
              element: <Report />
            },
            {
              path: "/control",
              element: <ControlForm />
            },
            {
              path: "/unfilled-list",
              element: <UnfilledList />
            },
            {
              path: "/sem",
              element: <Sem />
            },
            {
              path: "/centralfacilities",
              element: <CentralFacilities />
            },
            {
              path: "/cfreport",
              element: <CFReport />
            },
            {
              path: "/download",
              element: <Download />,
            },
            {
              path: "/upload",
              element: <Upload />,
            },
            {
              path: "/manage-users",
              element: <ManageUsers />,
            },
            {
              path: "/backup-and-restore",
              element: <Backup />,
            },
            {
              path: "/electives",
              element: <Electives />,
            },
            {
              path: "/manage-database",
              element: <ManageDB />,
            },
            {
              path: "/test",
              element: <Test />,
            },
            {
              path: "/thank-you",
              element: <ThankYou />,
            },
            {
              path: "/completed",
              element: <CompletedFeedback />
            },
          ]
        }

      ]
    },



  ]);


  return (

    <Suspense
      fallback={
        <Backdrop
          sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >

          <CircularProgress color="inherit" />
        </Backdrop>
      }
    >
      <LoadingProvider>
        <AlertProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AlertProvider>
      </LoadingProvider>
    </Suspense>
  );
}

export default App;
