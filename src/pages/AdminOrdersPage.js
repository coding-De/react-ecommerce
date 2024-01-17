import AdminOrders from "../features/admin/AdminOrders";
import NavBar from "../features/navBar/EcomNavBar";

function AdminOrdersPage() {
    return ( 
        <div>
            <NavBar>
                <AdminOrders></AdminOrders>
            </NavBar>
        </div>
     );
}

export default AdminOrdersPage;