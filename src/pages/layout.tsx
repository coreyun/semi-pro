import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navbar, { generateFullPathname } from '@/components/Navbar';
import Tabbar, { scrollToTab } from '@/components/Tabbar';
import NoAccess from '@/pages/exception/403';
import { getName, routes as fullRoutes } from '@/routes';
import settings from '@/settings.json';
import { RootState } from '@/store';
import { openTab } from '@/store/tabbar';
import styles from '@/style/layout.module.less';
import useLocale from '@/utils/useLocale';
import { Breadcrumb, Layout, Spin } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import KeepAlive from 'react-activation';
import { useDispatch, useSelector } from 'react-redux';

export default function PageLayout({ children }: { children: ReactNode }) {
  const t = useLocale();
  const router = useRouter();
  const fullPathname = generateFullPathname(router);
  const dispatch = useDispatch();

  const pathname = router.asPath;

  const {
    user: { userLoading },
    navbar: { routeKeys },
  } = useSelector((state: RootState) => state);

  const showHeader = settings?.header !== false;
  const showTabbar = settings?.tabbar !== false;
  const showFooter = settings?.footer !== false;
  const showNavbar = settings?.navbar !== true;

  const [breadcrumb, setBreadcrumb] = useState<[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(showNavbar);
  const [siderWidth, setSiderWidth] = useState<number>(
    showNavbar ? 60 : settings?.siderWidth
  );

  const headerHeight = 60;
  const tabbarHeight = 60;
  const footerHeight = 60;

  useEffect(() => {
    setSiderWidth(collapsed ? 60 : settings?.siderWidth);
  }, [collapsed]);

  const systemPage = ['/_error', '/404', '/500', '/403'];

  useEffect(() => {
    const name = getName(fullPathname, fullRoutes);
    dispatch(openTab({ name, key: pathname, path: fullPathname }));
  }, [router.asPath, router.query, t]);

  return (
    <Layout>
      {showHeader && <Header />}
      <Layout>
        <Navbar
          collapsed={collapsed}
          onRoute={(e) => scrollToTab(e)}
          onCollapseChange={(e) => setCollapsed(e)}
          onBreadcrumbChange={(e) => setBreadcrumb(e)}
          width={siderWidth}
          style={{
            height: `calc(100vh - ${showHeader ? headerHeight : 0}px)`,
            marginTop: showHeader ? headerHeight : 0,
          }}
        />
        <Layout style={{ paddingTop: showHeader ? headerHeight : 0 }}>
          {userLoading ? (
            <Spin wrapperClassName={styles['spin']} />
          ) : (
            <Layout>
              {showTabbar && (
                <Tabbar
                  style={{
                    width: `calc(100vw - ${siderWidth}px)`,
                    height: tabbarHeight,
                    top: showHeader ? headerHeight : 0,
                  }}
                />
              )}
              <Layout.Content
                style={{
                  padding: 24,
                  marginTop: showTabbar ? tabbarHeight : 0,
                  backgroundColor: 'var(--semi-color-default)',
                  minHeight:
                    'calc(100vh - ' +
                    ((showHeader ? headerHeight : 0) +
                      (showFooter ? footerHeight : 0) +
                      (showTabbar ? tabbarHeight : 0)) +
                    'px)',
                }}
              >
                {!!breadcrumb.length && (
                  <Breadcrumb
                    style={{ marginBottom: 24 }}
                    routes={breadcrumb}
                    renderItem={({ name }) => <>{t[name] || name}</>}
                  />
                )}
                <KeepAlive
                  cacheKey={fullPathname}
                  name={fullPathname}
                  when={settings.keepalive == true}
                >
                  <div
                    style={{
                      borderRadius: 10,
                      border: '1px solid var(--semi-color-border)',
                      padding: 32,
                      minHeight: systemPage.includes(fullPathname)
                        ? '100%'
                        : 'calc(100% - 52px)',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--semi-color-bg-0)',
                    }}
                  >
                    {routeKeys.includes(fullPathname) ||
                    systemPage.includes(router.pathname) ? (
                      children
                    ) : (
                      <NoAccess />
                    )}
                  </div>
                </KeepAlive>
              </Layout.Content>
              {showFooter && <Footer />}
            </Layout>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
}
