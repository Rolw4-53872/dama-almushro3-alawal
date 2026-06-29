import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { RootState } from '@store/index';
import { updateProfile } from '@store/slices/authSlice';
import { MainLayout } from '@components/Layout';
import { Card, Button, Input, SuccessMessage, ErrorMessage } from '@components/Common';

const profileSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب'),
  phone: z.string().regex(/^[0-9]{10,}$/, 'رقم الهاتف غير صحيح'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const result = await dispatch(updateProfile(data) as any);
    if (result.payload?.id) {
      setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">الملف الشخصي</h1>
          <p className="text-neutral-600 mt-2">إدارة بيانات حسابك الشخصية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <Card className="lg:col-span-1">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-4xl">
                  {user?.firstName.charAt(0)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-neutral-600 mt-2">{user?.email}</p>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'active'
                      ? 'bg-success-100 text-success-800'
                      : user?.status === 'inactive'
                      ? 'bg-neutral-100 text-neutral-800'
                      : 'bg-danger-100 text-danger-800'
                  }`}
                >
                  {user?.status === 'active' && 'نشط'}
                  {user?.status === 'inactive' && 'غير نشط'}
                  {user?.status === 'suspended' && 'موقوف'}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>الدور: <span className="font-medium">{user?.role}</span></p>
                <p>تاريخ الانضمام: <span className="font-medium">
                  {user?.createdAt && new Date(user.createdAt).toLocaleDateString('ar')}
                </span></p>
              </div>
            </div>
          </Card>

          {/* Edit Profile Form */}
          <Card className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">تحديث البيانات</h3>

            {error && <ErrorMessage message={error} />}
            {successMessage && <SuccessMessage message={successMessage} />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="الاسم الأول"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="اسم العائلة"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                label="البريد الإلكتروني"
                type="email"
                value={user?.email || ''}
                disabled
              />

              <Input
                label="رقم الهاتف"
                type="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="bg-neutral-50 p-4 rounded-lg space-y-2 text-sm text-neutral-600">
                <p>معرّف المستخدم: <span className="font-mono">{user?.id}</span></p>
                <p>آخر تحديث: <span className="font-medium">
                  {user?.updatedAt && new Date(user.updatedAt).toLocaleDateString('ar')}
                </span></p>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                حفظ التغييرات
              </Button>
            </form>
          </Card>
        </div>

        {/* Security Section */}
        <Card>
          <h3 className="text-2xl font-bold text-neutral-900 mb-6">الأمان</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">تغيير كلمة المرور</p>
                <p className="text-sm text-neutral-600">قم بتحديث كلمة المرور الخاصة بك</p>
              </div>
              <Button variant="outline" size="sm">
                تغيير
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">المصادقة الثنائية</p>
                <p className="text-sm text-neutral-600">تفعيل المصادقة الثنائية لحسابك</p>
              </div>
              <Button variant="outline" size="sm">
                تفعيل
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">جلسات النشاط</p>
                <p className="text-sm text-neutral-600">إدارة جلساتك النشطة</p>
              </div>
              <Button variant="outline" size="sm">
                عرض
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-danger-200">
          <h3 className="text-2xl font-bold text-danger-900 mb-6">منطقة الخطر</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-danger-50 rounded-lg">
              <div>
                <p className="font-semibold text-danger-900">حذف الحساب</p>
                <p className="text-sm text-danger-700">هذا الإجراء لا يمكن التراجع عنه</p>
              </div>
              <Button variant="danger" size="sm">
                حذف
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
