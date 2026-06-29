import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { fetchAssociations } from '@store/slices/associationsSlice';
import { MainLayout } from '@components/Layout';
import { Card, Button, LoadingSpinner, Input } from '@components/Common';

const Associations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { associations, isLoading, totalAssociations } = useSelector((state: RootState) => state.associations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAssociations({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const filteredAssociations = associations.filter(
    (assoc) =>
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.arName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="جاري تحميل الجمعيات..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">الجمعيات</h1>
            <p className="text-neutral-600 mt-2">إدارة ومعلومات الجمعيات المسجلة</p>
          </div>
          <Button variant="primary">
            إضافة جمعية جديدة
          </Button>
        </div>

        <Card>
          <Input
            placeholder="بحث عن جمعية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssociations.map((assoc) => (
            <Card key={assoc.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {assoc.logo ? (
                  <img
                    src={assoc.logo}
                    alt={assoc.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {assoc.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">{assoc.name}</h3>
                  <p className="text-neutral-600 text-sm">{assoc.arName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        assoc.certificationStatus === 'approved'
                          ? 'bg-success-100 text-success-800'
                          : assoc.certificationStatus === 'pending'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-danger-100 text-danger-800'
                      }`}
                    >
                      {assoc.certificationStatus === 'approved' && 'معتمدة'}
                      {assoc.certificationStatus === 'pending' && 'قيد المراجعة'}
                      {assoc.certificationStatus === 'rejected' && 'مرفوضة'}
                      {assoc.certificationStatus === 'suspended' && 'معلقة'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 mt-4 border-y border-neutral-200">
                <div className="text-center">
                  <p className="text-neutral-600 text-xs">الأعضاء</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {assoc.stats.totalMembers}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-600 text-xs">المنح</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {assoc.stats.totalGrants}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-600 text-xs">الملفات</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">
                    {assoc.stats.totalDocuments}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>📍 {assoc.city}, {assoc.region}</p>
                <p>📧 {assoc.email}</p>
                <p>📞 {assoc.phone}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="primary" className="flex-1" size="sm">
                  عرض التفاصيل
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  تعديل
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredAssociations.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">لم يتم العثور على جمعيات</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Associations;
