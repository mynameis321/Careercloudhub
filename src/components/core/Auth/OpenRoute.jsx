// This will prevent authenticated users from accessing this route
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { logout } from "../../../services/operations/authAPI";

function OpenRoute({ children }) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const {user}= useSelector(state => state.profile);
  // const { tokenExpiry } = useSelector((state) => state.auth)

  // if(tokenExpiry < Date.now())
  //   dispatch(logout(navigate));

  if (token === null) {
    return children
  } else {
     if(user?.accountType === ACCOUNT_TYPE.APPLICANT)
      return <Navigate to="/dashboard/applicant/profile" />
    else if(user?.accountType === ACCOUNT_TYPE.RECRUITER)
      return <Navigate to="/dashboard/recruiter/profile" />
    else if(user?.accountType === ACCOUNT_TYPE.ADMIN)
      return <Navigate to="/dashboard/admin/profile" />
  }
}

export default OpenRoute;