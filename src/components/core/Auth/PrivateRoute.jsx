// This will prevent authenticated users from accessing this route
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { logout } from "../../../services/operations/authAPI";

function PrivateRoute({ children }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth)
  // const { tokenExpiry } = useSelector((state) => state.auth)

  // if(tokenExpiry < Date.now())
  //   dispatch(logout(navigate));

  if (token !== null) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

export default PrivateRoute;