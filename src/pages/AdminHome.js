import AdminProductList from "../features/admin/AdminProductList";
import NavBar from "../features/navBar/EcomNavBar";

function AdminHome() {
    return ( 
        <div>
            <NavBar>
                <AdminProductList></AdminProductList>
            </NavBar>
        </div>
     );
}

export default AdminHome;