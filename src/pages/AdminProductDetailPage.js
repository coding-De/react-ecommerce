import AdminProductDetail from "../features/admin/AdminProductDetail";
import NavBar from "../features/navBar/EcomNavBar";
function AdminProductDetailPage() {
    return ( 
        <div>
            <NavBar>
                <AdminProductDetail></AdminProductDetail>
            </NavBar>
        </div>
     );
}

export default AdminProductDetailPage;