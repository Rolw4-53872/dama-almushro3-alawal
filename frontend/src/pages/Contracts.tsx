import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { fetchContracts } from '@store/slices/contractsSlice';
import { MainLayout } from '@components/Layout';
import { Card, Button, LoadingSpinner, Input, Select } from '@components/Common';

const Contracts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contracts, isLoading, totalContracts } = useSelector((state: RootState) => state.contracts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchContracts({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!statusFilter || contract.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-neutral-100', text: 'text-neutral-800', label: 'مسودة' },
      active: { bg: 'bg-success-100', text: 'text-success-800', label: 'نشط' },
      ended: { bg: 'bg-warning-100', text: 'text-warning-800', label: 'منتهي' },
      terminated: { bg: 'bg-danger-100', text: 'text-danger-800', label: 'ملغى' },
      archived: { bg: 'bg-neutral-200', text: 'text-neutral-700', label: 'مؤرشف' },
    };
    const badge = badges[status] || badges.draft;
    return { ...badge };
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="جاري تحميل العقود..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">العقود</h1>
            <p className="text-neutral-600 mt-2">إدارة ومراجعة العقود والاتفاقيات</p>
          </div>
          <Button variant="primary">
            إنشاء عقد جديد
          </Button>
        </div>

        <Card className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="بحث عن عقد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="تصفية بالحالة"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'draft', label: 'مسودة' },
                { value: 'active', label: 'نشط' },
                { value: 'ended', label: 'منتهي' },
                { value: 'terminated', label: 'ملغى' },
                { value: 'archived', label: 'مؤرشف' },
              ]}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContracts.map((contract) => {
            const statusBadge = getStatusBadge(contract.status);
            return (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{contract.title}</h3>
                    <p className="text-neutral-600 text-sm mt-1">{contract.association?.name}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{contract.description}</p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-200">
                  <div>
                    <p className="text-neutral-500 text-xs">المبلغ</p>
                    <p className="text-lg font-bold text-primary-600">
                      {contract.amount.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs">نوع العقد</p>
                    <p className="font-semibold text-neutral-900">
                      {contract.contractType === 'grant' && 'منحة'}
                      {contract.contractType === 'partnership' && 'شراكة'}
                      {contract.contractType === 'service' && 'خدمة'}
                      {contract.contractType === 'other' && 'أخرى'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span>تاريخ البداية:</span>
                    <span className="font-medium">
                      {new Date(contract.startDate).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تاريخ النهاية:</span>
                    <span className="font-medium">
                      {new Date(contract.endDate).toLocaleDateString('ar')}
                    </span>
                  </div>
                  {contract.signedDate && (
                    <div className="flex items-center justify-between">
                      <span>تاريخ التوقيع:</span>
                      <span className="font-medium">
                        {new Date(contract.signedDate).toLocaleDateString('ar')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="primary" className="flex-1" size="sm">
                    عرض التفاصيل
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    تحميل
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredContracts.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">لم يتم العثور على عقود</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Contracts;
