import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { fetchGrants } from '@store/slices/grantsSlice';
import { fetchAssociations } from '@store/slices/associationsSlice';
import { fetchDocuments } from '@store/slices/documentsSlice';
import { fetchContracts } from '@store/slices/contractsSlice';
import { MainLayout } from '@components/Layout';
import { Card, LoadingSpinner } from '@components/Common';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { grants, totalGrants, isLoading: grantsLoading } = useSelector((state: RootState) => state.grants);
  const { associations, totalAssociations } = useSelector((state: RootState) => state.associations);
  const { documents, totalDocuments } = useSelector((state: RootState) => state.documents);
  const { contracts, totalContracts } = useSelector((state: RootState) => state.contracts);

  useEffect(() => {
    dispatch(fetchGrants({ page: 1, pageSize: 10 }));
    dispatch(fetchAssociations({ page: 1, pageSize: 10 }));
    dispatch(fetchDocuments({ page: 1, pageSize: 10 }));
    dispatch(fetchContracts({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const stats: StatCard[] = [
    {
      title: 'إجمالي المنح',
      value: totalGrants,
      icon: '💰',
      color: 'primary',
    },
    {
      title: 'الجمعيات',
      value: totalAssociations,
      icon: '👥',
      color: 'secondary',
    },
    {
      title: 'الملفات',
      value: totalDocuments,
      icon: '📄',
      color: 'success',
    },
    {
      title: 'العقود',
      value: totalContracts,
      icon: '📋',
      color: 'warning',
    },
  ];

  if (grantsLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="جاري تحميل البيانات..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8">
          <h1 className="text-4xl font-bold">أهلا بك يا {user?.firstName}</h1>
          <p className="mt-2 text-primary-100">
            مرحبا بك في نظام داما للمنح والتأهيل الشامل
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Grants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">المنح الأخيرة</h2>
            <div className="space-y-3">
              {grants.slice(0, 5).map((grant) => (
                <div
                  key={grant.id}
                  className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <p className="font-semibold text-neutral-900">{grant.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-neutral-600">
                      {grant.amount} {grant.currency}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        grant.status === 'open'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {grant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">إجراءات سريعة</h2>
            <div className="space-y-3">
              <a
                href="/grants"
                className="block p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                طلب منحة جديدة →
              </a>
              <a
                href="/documents"
                className="block p-3 bg-secondary-50 text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors font-medium"
              >
                رفع ملفات →
              </a>
              <a
                href="/profile"
                className="block p-3 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 transition-colors font-medium"
              >
                تحديث الملف الشخصي →
              </a>
              <a
                href="/contracts"
                className="block p-3 bg-warning-50 text-warning-600 rounded-lg hover:bg-warning-100 transition-colors font-medium"
              >
                عرض العقود →
              </a>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
