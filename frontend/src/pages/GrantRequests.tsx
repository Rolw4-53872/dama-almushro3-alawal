import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { fetchGrants } from '@store/slices/grantsSlice';
import { MainLayout } from '@components/Layout';
import { Card, Button, LoadingSpinner, Input } from '@components/Common';

const GrantRequests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grants, isLoading } = useSelector((state: RootState) => state.grants);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchGrants({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const filteredGrants = grants.filter(
    (grant) =>
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="جاري تحميل المنح..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">طلبات المنح</h1>
          <p className="text-neutral-600 mt-2">
            تصفح وقدم طلبات للمنح المتاحة
          </p>
        </div>

        <Card>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="بحث عن منحة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">بحث</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGrants.map((grant) => (
            <Card key={grant.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-neutral-900">{grant.title}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    grant.status === 'open'
                      ? 'bg-success-100 text-success-800'
                      : grant.status === 'closed'
                      ? 'bg-danger-100 text-danger-800'
                      : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {grant.status === 'open' && 'مفتوحة'}
                  {grant.status === 'closed' && 'مغلقة'}
                  {grant.status === 'ended' && 'منتهية'}
                  {grant.status === 'archived' && 'مؤرشفة'}
                </span>
              </div>

              <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{grant.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-neutral-200">
                <div>
                  <p className="text-neutral-500 text-sm">المبلغ</p>
                  <p className="text-xl font-bold text-primary-600">
                    {grant.amount.toLocaleString()} {grant.currency}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm">الفئة</p>
                  <p className="text-lg font-semibold text-neutral-900">{grant.category}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-neutral-500 text-sm mb-2">المتطلبات:</p>
                <ul className="space-y-1">
                  {grant.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span>✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" className="flex-1">
                  تقديم طلب
                </Button>
                <Button variant="outline" className="flex-1">
                  التفاصيل
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredGrants.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">لم يتم العثور على منح</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default GrantRequests;
