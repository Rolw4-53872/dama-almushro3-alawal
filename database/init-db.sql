-- ============================================
-- نظام داما للمنح والتأهيل - قاعدة البيانات
-- ============================================

-- تفعيل الامتدادات
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- جدول المستخدمين
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('GUEST', 'ASSOCIATION', 'ADMIN', 'EXECUTIVE')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول الجمعيات
-- ============================================
CREATE TABLE associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,

  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website_url VARCHAR(255),

  business_description TEXT,
  logo_url VARCHAR(500),

  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول طلبات المنح
-- ============================================
CREATE TABLE grant_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  association_id UUID NOT NULL REFERENCES associations(id) ON DELETE CASCADE,

  request_number VARCHAR(50) UNIQUE NOT NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  project_objectives TEXT,

  requested_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  project_duration_months INTEGER NOT NULL,

  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (
    status IN (
      'DRAFT',
      'PENDING_REVIEW',
      'NEEDS_REVISION',
      'APPROVED',
      'REJECTED',
      'CONTRACT_UPLOADED',
      'SIGNED',
      'COMPLETED'
    )
  ),

  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول الملفات والمستندات
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_request_id UUID NOT NULL REFERENCES grant_requests(id) ON DELETE CASCADE,

  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url VARCHAR(500) NOT NULL,

  document_type VARCHAR(100) NOT NULL CHECK (
    document_type IN (
      'LICENSE',
      'FINANCIAL_PLAN',
      'BANK_STATEMENTS',
      'PROJECT_PLAN',
      'BUDGET',
      'CVS',
      'OTHER'
    )
  ),

  is_verified BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول العقود
-- ============================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_request_id UUID UNIQUE NOT NULL REFERENCES grant_requests(id) ON DELETE CASCADE,

  contract_number VARCHAR(50) UNIQUE NOT NULL,
  contract_url VARCHAR(500) NOT NULL,
  signed_contract_url VARCHAR(500),

  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'UPLOADED', 'SIGNED', 'APPROVED', 'ARCHIVED')
  ),

  created_by UUID REFERENCES users(id),
  signed_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول سجل التدقيق
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,

  details JSONB,
  ip_address INET,
  user_agent TEXT,

  status VARCHAR(50) DEFAULT 'SUCCESS',
  error_message TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- جدول الإشعارات
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  notification_type VARCHAR(50) NOT NULL,
  related_entity_type VARCHAR(100),
  related_entity_id UUID,

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- إنشاء الفهارس لتحسين الأداء
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_associations_license ON associations(license_number);
CREATE INDEX idx_associations_user ON associations(user_id);
CREATE INDEX idx_grant_requests_status ON grant_requests(status);
CREATE INDEX idx_grant_requests_association ON grant_requests(association_id);
CREATE INDEX idx_documents_grant_request ON documents(grant_request_id);
CREATE INDEX idx_contracts_grant_request ON contracts(grant_request_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================
-- Triggers للتحديث التلقائي
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_associations_updated_at BEFORE UPDATE ON associations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grant_requests_updated_at BEFORE UPDATE ON grant_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- البيانات الأولية
-- ============================================
INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@dama.com', '$argon2id$v=19$m=65540,t=3,p=4$placeholder$placeholder', 'مسؤول النظام', 'ADMIN'),
  ('manager@dama.com', '$argon2id$v=19$m=65540,t=3,p=4$placeholder$placeholder', 'المدير التنفيذي', 'EXECUTIVE');

-- ============================================
-- تعليقات جداول قاعدة البيانات
-- ============================================
COMMENT ON TABLE users IS 'جدول المستخدمين - يحتوي على بيانات جميع المستخدمين';
COMMENT ON TABLE associations IS 'جدول الجمعيات - بيانات الجمعيات الخيرية';
COMMENT ON TABLE grant_requests IS 'جدول طلبات المنح - طلبات المنح المقدمة';
COMMENT ON TABLE documents IS 'جدول الملفات - الملفات والمستندات المرفوعة';
COMMENT ON TABLE contracts IS 'جدول العقود - العقود والاتفاقيات';
COMMENT ON TABLE audit_logs IS 'جدول السجلات - سجل تدقيق شامل لجميع العمليات';
COMMENT ON TABLE notifications IS 'جدول الإشعارات - إشعارات النظام للمستخدمين';
