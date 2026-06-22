import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import HomePage from './pages/store/HomePage';
import ProductsPage from './pages/store/ProductsPage';
import ProductDetailPage from './pages/store/ProductDetailPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import OrderSuccessPage from './pages/store/OrderSuccessPage';
import LoginPage from './pages/store/LoginPage';
import RegisterPage from './pages/store/RegisterPage';
import StaticPage from './pages/store/StaticPage';
import ProductListingPage from './pages/store/ProductListingPage';
import CollectionsPage from './pages/store/CollectionsPage';
import CollectionDetailPage from './pages/store/CollectionDetailPage';
import DiscoverPage from './pages/store/DiscoverPage';
import WishlistPage from './pages/store/WishlistPage';
import TrackOrderPage from './pages/store/TrackOrderPage';
import PolicyPage from './pages/store/PolicyPage';
import AccountShell, {
  AccountDashboard,
  AccountOrders,
  AccountProfile,
  AccountAddresses,
  AccountNotifications,
} from './pages/store/AccountShell';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCmsPage from './pages/admin/AdminCmsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import {
  AdminCustomersPage,
  AdminCouponsPage,
  AdminBannersPage,
  AdminSettingsPage,
} from './pages/admin/AdminOtherPages';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="order/success" element={<OrderSuccessPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                <Route path="account" element={<ProtectedRoute><AccountShell /></ProtectedRoute>}>
                  <Route index element={<AccountDashboard />} />
                  <Route path="orders" element={<AccountOrders />} />
                  <Route path="profile" element={<AccountProfile />} />
                  <Route path="addresses" element={<AccountAddresses />} />
                  <Route path="notifications" element={<AccountNotifications />} />
                </Route>

                <Route path="discover" element={<DiscoverPage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="collections/:id" element={<CollectionDetailPage />} />
                <Route path="bestsellers" element={
                  <ProductListingPage label="الأكثر مبيعاً" title="كنوز المسافرين" description="المنتجات الأكثر طلباً في أوربيتا" />
                } />
                <Route path="new" element={
                  <ProductListingPage label="وصل حديثاً" title="إشارات جديدة" description="آخر ما وصل من أقاصي المجرة" />
                } />
                <Route path="drops" element={
                  <ProductListingPage label="إسقاطات" title="حملات محدودة" apiParams={{ featured: 'true' }} description="إسقاطات حصرية لفترة محدودة" />
                } />
                <Route path="offers" element={
                  <ProductListingPage label="مهمّات" title="عروض المجرة" apiParams={{ featured: 'true' }} />
                } />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="track-order" element={<TrackOrderPage />} />

                <Route path="about" element={
                  <StaticPage title="أسطورة أوربيتا" subtitle="قصة المجرّة التي ولدت من حلم">
                    <p>في قلب مجرّة بعيدة، اكتُشفت محطة كارتونية تطفو بين النجوم. أوربيتا ليست متجراً — إنها بوابة لعالم حيث كل منتج قطعة من مغامرة.</p>
                    <p style={{ marginTop: '1rem' }}>من بغداد إلى أقاصي الفضاء، نقدّم شخصيات وألعاب وكنوز نادرة لعشاق الكارتون في العراق والعالم العربي.</p>
                  </StaticPage>
                } />
                <Route path="contact" element={
                  <StaticPage title="تواصل معنا">
                    <p>📞 07700000000</p>
                    <p>📧 info@orbita.iq</p>
                    <p>📍 بغداد، العراق</p>
                  </StaticPage>
                } />
                <Route path="faq" element={
                  <StaticPage title="الأسئلة الشائعة">
                    <p><strong>كيف أتتبع طلبي؟</strong> من صفحة حسابي → مهماتي أو <a href="/track-order">تتبع المهمة</a></p>
                    <p><strong>ما طرق الدفع؟</strong> الدفع الإلكتروني عبر Qi Card</p>
                    <p><strong>كم يستغرق التوصيل؟</strong> ٢-٥ أيام عمل داخل العراق</p>
                  </StaticPage>
                } />
                <Route path="policies/shipping" element={
                  <PolicyPage label="سياسات" title="سياسة الشحن">
                    <p>نوصّل لجميع محافظات العراق. مدة التوصيل ٢-٥ أيام عمل حسب المحافظة.</p>
                    <p style={{ marginTop: '1rem' }}>رسوم الشحن تُحسب عند إتمام الطلب حسب الوجهة.</p>
                  </PolicyPage>
                } />
                <Route path="policies/privacy" element={
                  <PolicyPage label="سياسات" title="سياسة الخصوصية">
                    <p>نحترم خصوصيتك — بياناتك تُستخدم فقط لإتمام طلباتك وتحسين تجربتك في أوربيتا.</p>
                    <p style={{ marginTop: '1rem' }}>لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك.</p>
                  </PolicyPage>
                } />
                <Route path="*" element={
                  <div className="container empty-state" style={{ padding: '4rem' }}>
                    <h3>ضعت في الفضاء؟</h3>
                    <p>الصفحة غير موجودة</p>
                  </div>
                } />
              </Route>

              <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:id" element={<AdminProductFormPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="cms" element={<AdminCmsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
