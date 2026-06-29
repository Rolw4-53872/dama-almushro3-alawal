import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { fetchDocuments } from '@store/slices/documentsSlice';
import { MainLayout } from '@components/Layout';
import { Card, Button, LoadingSpinner, Input, Select } from '@components/Common';

const Documents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, isLoading, totalDocuments } = useSelector((state: RootState) => state.documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDocuments({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!categoryFilter || doc.category === categoryFilter)
  );

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      jpg: '🖼️',
      png: '🖼️',
      other: '📄',
    };
    return icons[type] || icons.other;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="جاري تحميل الملفات..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">الملفات والمستندات</h1>
            <p className="text-neutral-600 mt-2">إدارة ورفع الملفات والمستندات المهمة</p>
          </div>
          <Button variant="primary">
            رفع ملف جديد
          </Button>
        </div>

        <Card className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="بحث عن ملف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="تصفية بالفئة"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'identification', label: 'هوية' },
                { value: 'registration', label: 'تسجيل' },
                { value: 'financial', label: 'مالي' },
                { value: 'other', label: 'أخرى' },
              ]}
            />
          </div>
        </Card>

        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{doc.name}</h3>
                      <p className="text-neutral-600 text-sm mt-1">
                        {formatFileSize(doc.size)} • {doc.type.toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        doc.status === 'approved'
                          ? 'bg-success-100 text-success-800'
                          : doc.status === 'pending'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-danger-100 text-danger-800'
                      }`}
                    >
                      {doc.status === 'approved' && 'موافق عليه'}
                      {doc.status === 'pending' && 'قيد المراجعة'}
                      {doc.status === 'rejected' && 'مرفوض'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-neutral-200">
                    <div>
                      <p className="text-neutral-500 text-xs">الفئة</p>
                      <p className="font-medium text-neutral-900">
                        {doc.category === 'identification' && 'هوية'}
                        {doc.category === 'registration' && 'تسجيل'}
                        {doc.category === 'financial' && 'مالي'}
                        {doc.category === 'other' && 'أخرى'}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">تاريخ الرفع</p>
                      <p className="font-medium text-neutral-900">
                        {new Date(doc.uploadedDate).toLocaleDateString('ar')}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">رافع</p>
                      <p className="font-medium text-neutral-900 truncate">{doc.uploadedBy}</p>
                    </div>
                    {doc.expiryDate && (
                      <div>
                        <p className="text-neutral-500 text-xs">ينتهي في</p>
                        <p className="font-medium text-neutral-900">
                          {new Date(doc.expiryDate).toLocaleDateString('ar')}
                        </p>
                      </div>
                    )}
                  </div>

                  {doc.notes && (
                    <p className="text-neutral-600 text-sm mt-3 p-2 bg-neutral-50 rounded">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="primary" size="sm" className="flex-1">
                  تحميل
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  معاينة
                </Button>
                <Button variant="outline" size="sm">
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">لم يتم العثور على ملفات</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Documents;
