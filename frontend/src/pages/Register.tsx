import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { RootState } from '@store/index';
import { register as registerUser } from '@store/slices/authSlice';
import { Button, Input, Card, Select, ErrorMessage } from '@components/Common';

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب'),
  phone: z.string().regex(/^[0-9]{10,}$/, 'رقم الهاتف غير صحيح'),
  role: z.enum(['user', 'association']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data) as any);
    if (result.payload?.user) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">إنشاء حساب</h1>
          <p className="text-neutral-600 mt-2">اضغط على نظام داما</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الاسم الأول"
              placeholder="أحمد"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="اسم العائلة"
              placeholder="محمد"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="رقم الهاتف"
            type="tel"
            placeholder="0501234567"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Select
            label="نوع الحساب"
            options={[
              { value: 'user', label: 'مستخدم فردي' },
              { value: 'association', label: 'جمعية' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            إنشاء الحساب
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
