CREATE TABLE mst_roles (
	id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
	role_name varchar NULL, 
	is_admin bool NULL DEFAULT false, 
	is_superadmin bool NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_users (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    fullname VARCHAR(200) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_user_identity (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(30),
    gender VARCHAR(20),
    birth_place VARCHAR(100),
    birth_date DATE,
    avatar_url TEXT,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_address (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    receiver_name VARCHAR(200),
    phone_number VARCHAR(30),
    province VARCHAR(150),
    city VARCHAR(150),
    district VARCHAR(150),
    village VARCHAR(150),
    postal_code VARCHAR(20),
    full_address TEXT,
    address_label VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    latitude NUMERIC(12,8),
    longitude NUMERIC(12,8),
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_user_sessions (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    refresh_token TEXT NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(100),
    expired_at TIMESTAMPTZ,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE trx_otp (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    otp_code VARCHAR(10),
    otp_type VARCHAR(50),
    resend_count INTEGER DEFAULT 0,
    expired_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_category (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    category_name VARCHAR(150),
    category_slug VARCHAR(150) UNIQUE,
    category_icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_product (
	id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    product_name VARCHAR(255),
    product_slug VARCHAR(255) UNIQUE,
    description TEXT,
    brand VARCHAR(100),
    gender VARCHAR(30),
    material VARCHAR(150),
    price NUMERIC(18,2),
    discount_price NUMERIC(18,2),
    stock INTEGER,
    weight NUMERIC(10,2),
    thumbnail_url TEXT,
    average_rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    sold_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_product_variant (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    color VARCHAR(100),
    size VARCHAR(50),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    stock INTEGER,
    weight NUMERIC(10,2),
    price_adjustment NUMERIC(18,2),
    variant_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
	created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_product_images (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    image_url TEXT,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    sort_order INTEGER,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_product_specifications (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    spec_name VARCHAR(150),
    spec_value TEXT,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_product_tags (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    tag_name VARCHAR(100),
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_cart (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_cart_items (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL,
    product_variant_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);


CREATE TABLE mst_voucher (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE,
    discount_type VARCHAR(20),
    discount_value NUMERIC(18,2),
    minimum_purchase NUMERIC(18,2),
    max_usage INTEGER,
    used_count INTEGER,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_orders (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE,
    user_id UUID NOT NULL,
    address_id UUID NOT NULL,
    subtotal_amount NUMERIC(18,2),
    discount_amount NUMERIC(18,2),
    tax_amount NUMERIC(18,2),
    shipping_cost NUMERIC(18,2),
    grand_total NUMERIC(18,2),
    order_status VARCHAR(50),
    payment_status VARCHAR(50),
    notes TEXT,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_order_items (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_variant_id UUID NOT NULL,
    quantity INTEGER,
    price NUMERIC(18,2),
    subtotal NUMERIC(18,2),
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);


CREATE TABLE trx_order_status_history (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    status VARCHAR(50),
    notes TEXT,
    changed_by UUID,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_payment_provider (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    provider_name VARCHAR(100) NOT NULL,
    provider_code VARCHAR(50) UNIQUE NOT NULL,
    provider_type VARCHAR(50),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_payment_method (
	id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL,
    method_name VARCHAR(100) NOT NULL,
    method_code VARCHAR(50) UNIQUE NOT NULL,
    method_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null,
    CONSTRAINT fk_payment_method_provider FOREIGN KEY(provider_id) REFERENCES mst_payment_provider(id)
);

CREATE TABLE mst_shipping_service (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    shipping_company_id UUID NOT NULL,
    service_name VARCHAR(100),
    service_code VARCHAR(50),
    estimated_days VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz null default now(), 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null,
    CONSTRAINT fk_shipping_service_company FOREIGN KEY(shipping_company_id) REFERENCES mst_shipping_company(id)
);

CREATE TABLE mst_shipping_company (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL,
    company_code VARCHAR(50) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz null default now(), 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_payment (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    payment_method VARCHAR(100),
    payment_provider VARCHAR(100),
    payment_reference VARCHAR(255),
    amount NUMERIC(18,2),
    payment_status VARCHAR(50),
    paid_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_shipping (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    courier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_status VARCHAR(50),
    estimated_arrival TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE trx_shipping_tracking (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    shipping_id UUID NOT NULL,
    status VARCHAR(50),
    location TEXT,
    description TEXT,
    tracked_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE trx_refund (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    user_id UUID NOT NULL,
    refund_number VARCHAR(50),
    refund_type VARCHAR(50),
    refund_reason TEXT,
    refund_amount NUMERIC(18,2),
    refund_status VARCHAR(50),
    admin_notes TEXT,
    approved_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE trx_refund_evidence (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    refund_id UUID NOT NULL,
    file_url TEXT,
    file_type VARCHAR(50),
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_faq (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    question TEXT,
    answer TEXT,
    sort_order INTEGER,
    is_active BOOLEAN,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_promotion (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    promotion_name VARCHAR(255),
    promotion_type VARCHAR(50),
    discount_type VARCHAR(50),
    discount_value NUMERIC(18,2),
    minimum_purchase NUMERIC(18,2),
    banner_image TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_promotion_product (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL,
    product_id UUID NOT null,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE trx_daily_sales (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    sales_date DATE,
    total_order INTEGER,
    total_customer INTEGER,
    total_revenue NUMERIC(18,2),
    total_refund NUMERIC(18,2),
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

CREATE TABLE mst_user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null,
    CONSTRAINT fk_user_sessions_user
        FOREIGN KEY(user_id)
        REFERENCES mst_users(id)
);

CREATE INDEX idx_user_sessions_user
ON mst_user_sessions(user_id);

CREATE INDEX idx_user_sessions_expired
ON mst_user_sessions(expired_at);

CREATE INDEX idx_user_sessions_refresh
ON mst_user_sessions(refresh_token_hash);

CREATE TABLE mst_otp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email VARCHAR(255),
    otp_code VARCHAR(10) NOT NULL,
    otp_type VARCHAR(50) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expired_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null,
    CONSTRAINT fk_otp_user
        FOREIGN KEY(user_id)
        REFERENCES mst_users(id)
);

CREATE TABLE trx_login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email VARCHAR(255),
    ip_address INET,
    browser VARCHAR(255),
    os VARCHAR(255),
    login_status VARCHAR(50),
    failure_reason TEXT,
    created_at timestamptz NOT NULL DEFAULT now(), 
	updated_at timestamptz NULL, 
	deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null,
    CONSTRAINT fk_login_history_user
        FOREIGN KEY(user_id)
        REFERENCES mst_users(id)
);


ALTER TABLE mst_users
ADD CONSTRAINT fk_users_role
FOREIGN KEY (role_id)
REFERENCES mst_roles(id);

ALTER TABLE mst_user_identity
ADD CONSTRAINT fk_identity_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE mst_user_sessions
ADD CONSTRAINT fk_session_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE trx_otp
ADD CONSTRAINT fk_otp_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE mst_address
ADD CONSTRAINT fk_address_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE mst_product
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id)
REFERENCES mst_category(id);

ALTER TABLE mst_product_variant
ADD CONSTRAINT fk_variant_product
FOREIGN KEY (product_id)
REFERENCES mst_product(id);

ALTER TABLE mst_product_images
ADD CONSTRAINT fk_product_image
FOREIGN KEY (product_id)
REFERENCES mst_product(id);

ALTER TABLE mst_product_specifications
ADD CONSTRAINT fk_product_spec
FOREIGN KEY (product_id)
REFERENCES mst_product(id);

ALTER TABLE mst_product_tags
ADD CONSTRAINT fk_product_tag
FOREIGN KEY (product_id)
REFERENCES mst_product(id);

ALTER TABLE mst_cart
ADD CONSTRAINT fk_cart_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE mst_cart_items
ADD CONSTRAINT fk_cart_item_cart
FOREIGN KEY (cart_id)
REFERENCES mst_cart(id);

ALTER TABLE mst_cart_items
ADD CONSTRAINT fk_cart_item_variant
FOREIGN KEY (product_variant_id)
REFERENCES mst_product_variant(id);

ALTER TABLE mst_orders
ADD CONSTRAINT fk_order_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE mst_orders
ADD CONSTRAINT fk_order_address
FOREIGN KEY (address_id)
REFERENCES mst_address(id);

ALTER TABLE mst_order_items
ADD CONSTRAINT fk_order_item_order
FOREIGN KEY (order_id)
REFERENCES mst_orders(id);

ALTER TABLE mst_order_items
ADD CONSTRAINT fk_order_item_variant
FOREIGN KEY (product_variant_id)
REFERENCES mst_product_variant(id);

ALTER TABLE trx_order_status_history
ADD CONSTRAINT fk_order_history_order
FOREIGN KEY (order_id)
REFERENCES mst_orders(id);

ALTER TABLE trx_order_status_history
ADD CONSTRAINT fk_order_history_user
FOREIGN KEY (changed_by)
REFERENCES mst_users(id);

ALTER TABLE mst_payment
ADD CONSTRAINT fk_payment_order
FOREIGN KEY (order_id)
REFERENCES mst_orders(id);

ALTER TABLE mst_shipping
ADD CONSTRAINT fk_shipping_order
FOREIGN KEY (order_id)
REFERENCES mst_orders(id);

ALTER TABLE trx_shipping_tracking
ADD CONSTRAINT fk_tracking_shipping
FOREIGN KEY (shipping_id)
REFERENCES mst_shipping(id);

ALTER TABLE trx_refund
ADD CONSTRAINT fk_refund_order
FOREIGN KEY (order_id)
REFERENCES mst_orders(id);

ALTER TABLE trx_refund
ADD CONSTRAINT fk_refund_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);

ALTER TABLE trx_refund_evidence
ADD CONSTRAINT fk_refund_evidence
FOREIGN KEY (refund_id)
REFERENCES trx_refund(id);

ALTER TABLE mst_promotion_product
ADD CONSTRAINT fk_promo_product_promo
FOREIGN KEY (promotion_id)
REFERENCES mst_promotion(id);

ALTER TABLE mst_promotion_product
ADD CONSTRAINT fk_promo_product_product
FOREIGN KEY (product_id)
REFERENCES mst_product(id);

CREATE TABLE trx_notification (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at timestamptz NOT NULL DEFAULT now(), 
    updated_at timestamptz NULL, 
    deleted_at timestamptz NULL, 
    created_by UUID null,
    updated_by UUID null,
    deleted_by UUID null
);

ALTER TABLE trx_notification
ADD CONSTRAINT fk_notification_user
FOREIGN KEY (user_id)
REFERENCES mst_users(id);