import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from './AuthSlice';

function Protected({ children }) {
  const user = useSelector(selectLoggedInUser);

  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }else{
    <>
    <div>{children}</div>
    <h2>hello</h2>
    </>
  }
  return children;
}

export default Protected;