import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import Toasts from '../components/Toasts';

export default function MainLayout({ children, showBreadcrumbs = true, breadcrumbItems = null }) {
  return (
    <div className="main-layout">
      <Header />
      {showBreadcrumbs && <Breadcrumbs customItems={breadcrumbItems} />}
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <Toasts />
    </div>
  );
}