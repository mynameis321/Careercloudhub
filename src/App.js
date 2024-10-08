import "./App.css";
import { useEffect, useState } from "react";
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import ConfirmationModal from "./components/common/ConfirmationModal";
import { SignUp } from "./pages/SignUp";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import { logout } from './services/operations/authAPI';
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Catalog } from "./pages/Catalog";
import { ApplyJob } from "./pages/ApplyJob";
import { JobDetail } from "./pages/JobDetail";
import { Navbar } from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import RecruiterProfile from "./components/core/Dashboard/Recruiter/RecruiterProfile";
import ReceivedApplications from "./components/core/Dashboard/Recruiter/ReceivedApplications";
import ApplicationDetail from "./pages/ApplicationDetail";
import MyJobs from "./components/core/Dashboard/Recruiter/MyJobs";
import { AddJob } from "./components/core/Dashboard/Recruiter/AddJob";
import ApplicantProfile from "./components/core/Dashboard/Applicant/ApplicantProfile";
import MyApplications from "./components/core/Dashboard/Applicant/MyApplications";
import Settings from "./components/core/Dashboard/Settings";
import { ACCOUNT_TYPE } from "./utils/constants";
import { EditJob } from "./components/core/Dashboard/Recruiter/EditJob";
import { deleteAccount } from "./services/operations/SettingsAPI";
import Spinner from "./components/common/Spinner";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [confirmationModal,setConfirmationModal] = useState(null);
  const { user } = useSelector(state => state.profile);
  const {token} = useSelector(state => state.auth);
  const {tokenExpiry} = useSelector(state => state.auth);
  const [loading,setLoading] = useState(true);

  const showConfirmationModal = ()=>{
    setConfirmationModal({
      text1:"Are you sure?",
      text2:"You will be logged out of your account.",
      btnText1:"Logout",
      btnText2:"Cancel",
      btnHandler1:()=>{
        setConfirmationModal(null);
        dispatch(logout(navigate));
      },
      btnHandler2:()=>{setConfirmationModal(null)}
    });
  }
  
  const deleteAccountModal = ()=>{
    setConfirmationModal({
      text1:"Are you sure?",
      text2:"You account will be deleted permenantly.",
      btnText1:"Delete",
      btnText2:"Cancel",
      btnHandler1:()=>{
        setConfirmationModal(null);
        dispatch(deleteAccount(token,navigate));
      },
      btnHandler2:()=>{setConfirmationModal(null)}
    });
  }

  useEffect(()=>{
    // console.log(tokenExpiry);
    if(tokenExpiry && tokenExpiry < Date.now()){
      dispatch(logout(navigate));
    }
  },[location.pathname.includes('dashboard'),location.pathname.includes('apply')]);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 text-white font-inter">
      <Navbar setLoading={setLoading} loading={loading}/>
      
      {
        confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
      }
      
      {
        loading 
        ?(<Spinner/>)
        :(
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="jobs/:jobId" element={<JobDetail/>} />
          <Route path="about" element={<About/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="/catalog/:catalogName" element={<Catalog/>}/>

          <Route
            path="signup"
            element={
              <OpenRoute>
                <SignUp />
              </OpenRoute>
            }
          />

          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail/>
              </OpenRoute>
            }
          />

          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword/>
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:accountType/:token"
            element={
              <OpenRoute>
                <UpdatePassword/>
              </OpenRoute>
            }
          />

          {
            user && user?.accountType === ACCOUNT_TYPE.APPLICANT &&
            <>
                <Route
                  path="/applicant/apply/:jobId"
                  element={<PrivateRoute>
                    <ApplyJob/>
                  </PrivateRoute>}
                />
            </>
          }

          {/* Dashboard Paths */}
          <Route
            element={
              <PrivateRoute>
                <Dashboard 
                  showConfirmationModal={showConfirmationModal}/>
              </PrivateRoute>
            }>
            
            <Route
              path="/dashboard/settings"
              element={<Settings deleteAccountModal={deleteAccountModal}/>}
            />

            {/* Applicant Routes */}
            {
              user?.accountType === ACCOUNT_TYPE.APPLICANT &&
              <>
                <Route
                  path="/dashboard/applicant/profile"
                  element={<ApplicantProfile/>}
                />
                <Route
                  path="/dashboard/applicant/my-applications"
                  element={<MyApplications/>}
                />
              </>
            }

            {/* Recruiter Routes */}
            {
              user?.accountType === ACCOUNT_TYPE.RECRUITER &&
              <>      
                <Route
                  path="/dashboard/recruiter/profile"
                  element={<RecruiterProfile/>}
                />
                <Route
                  path="/dashboard/recruiter/applications-recieved"
                />
                <Route
                  path="/dashboard/recruiter/my-jobs"
                  element={<MyJobs/>}
                />
                <Route
                  path="/dashboard/recruiter/add-job"
                  element={<AddJob/>}
                />
                <Route
                  path="/dashboard/recruiter/edit-job/:jobId"
                  element={<EditJob/>}
                />
                <Route
                  path="/dashboard/recruiter/applications-received"
                  element={<ReceivedApplications/>}
                />
                <Route
                  path="/dashboard/recruiter/application/:applicationId"
                  element={<ApplicationDetail/>}
                />
              </>
            }

          </Route>

          {/* Error Paths */}
          <Route
            path="*"
            element={<div className="h-screen w-screen flex items-center justify-center">
              <p>Error 404 - Page Not Found </p>
            </div>}
          />
        
          </Routes>
        )
      }
      
    </div>
  );
}

export default App;
