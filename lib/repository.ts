import { getDatabase } from "./database";

// ============================================================
// TYPES
// ============================================================

export interface Country {
  id: number;
  country: string;
}

export interface CountryConfig {
  id: number;
  country_id: number;
  country_code: string;
  currency_code: string;
  currency_symbol: string;
  tax_id_label: string;
  tax_id_format: string | null;
  default_timezone: string;
  default_locale: string;
  is_active: number;
  phone_prefix: string;
  available_payment_providers: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Region {
  id: number;
  region: string;
  country_id: number;
}

export interface City {
  id: number;
  city: string;
  region_id: number;
}

export interface County {
  id: number;
  county: string;
  city_id: number;
}

export interface Seller {
  id: string;
  email: string;
  seller_type: string;
  is_active: number;
  is_verified: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  preferred_contact_method: string;
  social_media_links: string | null;
  points: number;
  seller_level_id: number | null;
  country_id: number | null;
  region_id: number | null;
  city_id: number | null;
  county_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  synced_at: string | null;
}

export interface PersonProfile {
  id: string;
  seller_id: string;
  first_name: string;
  last_name: string | null;
  display_name: string | null;
  bio: string | null;
  birthday: string | null;
  profile_image: string | null;
  cover_image: string | null;
  allow_exchanges: number;
  person_membership_id: number | null;
}

export interface BusinessProfile {
  id: string;
  seller_id: string;
  business_name: string;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  business_type: string;
  legal_business_name: string | null;
  tax_id: string | null;
  business_start_date: string | null;
  legal_representative: string | null;
  legal_representative_tax_id: string | null;
  shipping_policy: string | null;
  return_policy: string | null;
  service_area: string | null;
  years_of_experience: number | null;
  certifications: string | null;
  travel_radius: number | null;
  business_hours: string | null;
  business_membership_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SellerPreferences {
  id: number;
  seller_id: string;
  preferred_language: string;
  currency: string;
  email_notifications: number;
  push_notifications: number;
  order_updates: number;
  community_updates: number;
  security_alerts: number;
  weekly_summary: number;
  two_factor_auth: number;
}

export interface SellerLevel {
  id: number;
  level_name: string;
  min_points: number;
  max_points: number | null;
  benefits: string | null;
  badge_icon: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Notification {
  id: number;
  seller_id: string;
  type: string;
  title: string;
  message: string;
  is_read: number;
  priority: string;
  related_id: string | null;
  action_url: string | null;
  metadata: string | null;
  created_at: string | null;
  read_at: string | null;
}

export interface Chat {
  id: number;
  sender_id: string;
  receiver_id: string;
  product_id: number | null;
  is_exchange: number;
  created_at: string | null;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: string;
  content: string;
  created_at: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  color: string | null;
  images: string | null;
  brand: string;
  price: number;
  product_category_id: number;
  badges: string | null;
  interests: string | null;
  condition: string;
  condition_description: string | null;
  is_active: number;
  is_exchangeable: number;
  seller_id: string;
  view_count: number;
  created_at: string | null;
  updated_at: string | null;
  synced_at: string | null;
}

export interface StoreProduct {
  id: number;
  name: string;
  description: string;
  stock: number;
  barcode: string | null;
  sku: string | null;
  price: number;
  has_offer: number;
  offer_price: number | null;
  seller_id: string;
  images: string | null;
  is_active: number;
  badges: string | null;
  brand: string | null;
  color: string | null;
  average_rating: number;
  reviews_number: number;
  likes_count: number;
  sale_count: number;
  view_count: number;
  material_composition: string | null;
  recycled_content: number | null;
  weight: number | null;
  weight_unit: string;
  tags: string | null;
  features: string | null;
  warranty: string | null;
  warranty_duration: number | null;
  sub_category_id: number;
  created_at: string | null;
  updated_at: string | null;
  synced_at: string | null;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  seller_id: string;
  pricing_type: string;
  base_price: number | null;
  price_range: string | null;
  duration: number | null;
  is_active: number;
  images: string | null;
  tags: string | null;
  subcategory_id: number;
  average_rating: number;
  view_count: number;
  created_at: string | null;
  updated_at: string | null;
  synced_at: string | null;
}

export interface Order {
  id: number;
  seller_id: string;
  shipping_status: string;
  created_at: string | null;
  updated_at: string | null;
  synced_at: string | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  store_product_id: number | null;
  quantity: number;
  price: number;
  created_at: string | null;
}

// ============================================================
// KEY-VALUE STORE
// ============================================================

export async function getValue(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM key_value WHERE key = ?",
    key
  );
  return row?.value ?? null;
}

export async function setValue(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO key_value (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value
  );
}

export async function deleteValue(key: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM key_value WHERE key = ?", key);
}

// ============================================================
// GEOGRAPHY
// ============================================================

export async function upsertCountry(c: Country): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO country (id, country) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET country = excluded.country`,
    c.id,
    c.country
  );
}

export async function upsertCountries(countries: Country[]): Promise<void> {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const c of countries) {
      await tx.runAsync(
        `INSERT INTO country (id, country) VALUES (?, ?)
         ON CONFLICT(id) DO UPDATE SET country = excluded.country`,
        c.id,
        c.country
      );
    }
  });
}

export async function getCountries(): Promise<Country[]> {
  const db = await getDatabase();
  return db.getAllAsync<Country>("SELECT * FROM country ORDER BY country");
}

export async function upsertRegions(regions: Region[]): Promise<void> {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const r of regions) {
      await tx.runAsync(
        `INSERT INTO region (id, region, country_id) VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET region = excluded.region, country_id = excluded.country_id`,
        r.id,
        r.region,
        r.country_id
      );
    }
  });
}

export async function getRegionsByCountry(countryId: number): Promise<Region[]> {
  const db = await getDatabase();
  return db.getAllAsync<Region>(
    "SELECT * FROM region WHERE country_id = ? ORDER BY region",
    countryId
  );
}

export async function upsertCities(cities: City[]): Promise<void> {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const c of cities) {
      await tx.runAsync(
        `INSERT INTO city (id, city, region_id) VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET city = excluded.city, region_id = excluded.region_id`,
        c.id,
        c.city,
        c.region_id
      );
    }
  });
}

export async function getCitiesByRegion(regionId: number): Promise<City[]> {
  const db = await getDatabase();
  return db.getAllAsync<City>(
    "SELECT * FROM city WHERE region_id = ? ORDER BY city",
    regionId
  );
}

export async function upsertCounties(counties: County[]): Promise<void> {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const c of counties) {
      await tx.runAsync(
        `INSERT INTO county (id, county, city_id) VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET county = excluded.county, city_id = excluded.city_id`,
        c.id,
        c.county,
        c.city_id
      );
    }
  });
}

export async function getCountiesByCity(cityId: number): Promise<County[]> {
  const db = await getDatabase();
  return db.getAllAsync<County>(
    "SELECT * FROM county WHERE city_id = ? ORDER BY county",
    cityId
  );
}

// ============================================================
// SELLER & PROFILES
// ============================================================

export async function upsertSeller(s: Seller): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO seller (id, email, seller_type, is_active, is_verified, address, phone, website,
      preferred_contact_method, social_media_links, points, seller_level_id,
      country_id, region_id, city_id, county_id, created_at, updated_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
      email = excluded.email, seller_type = excluded.seller_type,
      is_active = excluded.is_active, is_verified = excluded.is_verified,
      address = excluded.address, phone = excluded.phone, website = excluded.website,
      preferred_contact_method = excluded.preferred_contact_method,
      social_media_links = excluded.social_media_links, points = excluded.points,
      seller_level_id = excluded.seller_level_id, country_id = excluded.country_id,
      region_id = excluded.region_id, city_id = excluded.city_id, county_id = excluded.county_id,
      created_at = excluded.created_at, updated_at = excluded.updated_at,
      synced_at = datetime('now')`,
    s.id, s.email, s.seller_type, s.is_active, s.is_verified,
    s.address, s.phone, s.website, s.preferred_contact_method,
    s.social_media_links, s.points, s.seller_level_id,
    s.country_id, s.region_id, s.city_id, s.county_id,
    s.created_at, s.updated_at
  );
}

export async function getSeller(id: string): Promise<Seller | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Seller>("SELECT * FROM seller WHERE id = ?", id);
}

export async function upsertPersonProfile(p: PersonProfile): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO person_profile (id, seller_id, first_name, last_name, display_name, bio,
      birthday, profile_image, cover_image, allow_exchanges, person_membership_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      first_name = excluded.first_name, last_name = excluded.last_name,
      display_name = excluded.display_name, bio = excluded.bio, birthday = excluded.birthday,
      profile_image = excluded.profile_image, cover_image = excluded.cover_image,
      allow_exchanges = excluded.allow_exchanges, person_membership_id = excluded.person_membership_id`,
    p.id, p.seller_id, p.first_name, p.last_name, p.display_name,
    p.bio, p.birthday, p.profile_image, p.cover_image,
    p.allow_exchanges, p.person_membership_id
  );
}

export async function getPersonProfile(sellerId: string): Promise<PersonProfile | null> {
  const db = await getDatabase();
  return db.getFirstAsync<PersonProfile>(
    "SELECT * FROM person_profile WHERE seller_id = ?",
    sellerId
  );
}

export async function upsertBusinessProfile(b: BusinessProfile): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO business_profile (id, seller_id, business_name, description, logo, cover_image,
      business_type, legal_business_name, tax_id, business_start_date, legal_representative,
      legal_representative_tax_id, shipping_policy, return_policy, service_area,
      years_of_experience, certifications, travel_radius, business_hours,
      business_membership_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      business_name = excluded.business_name, description = excluded.description,
      logo = excluded.logo, cover_image = excluded.cover_image,
      business_type = excluded.business_type, legal_business_name = excluded.legal_business_name,
      tax_id = excluded.tax_id, business_start_date = excluded.business_start_date,
      legal_representative = excluded.legal_representative,
      legal_representative_tax_id = excluded.legal_representative_tax_id,
      shipping_policy = excluded.shipping_policy, return_policy = excluded.return_policy,
      service_area = excluded.service_area, years_of_experience = excluded.years_of_experience,
      certifications = excluded.certifications, travel_radius = excluded.travel_radius,
      business_hours = excluded.business_hours, business_membership_id = excluded.business_membership_id,
      created_at = excluded.created_at, updated_at = excluded.updated_at`,
    b.id, b.seller_id, b.business_name, b.description, b.logo, b.cover_image,
    b.business_type, b.legal_business_name, b.tax_id, b.business_start_date,
    b.legal_representative, b.legal_representative_tax_id, b.shipping_policy,
    b.return_policy, b.service_area, b.years_of_experience, b.certifications,
    b.travel_radius, b.business_hours, b.business_membership_id, b.created_at, b.updated_at
  );
}

export async function getBusinessProfile(sellerId: string): Promise<BusinessProfile | null> {
  const db = await getDatabase();
  return db.getFirstAsync<BusinessProfile>(
    "SELECT * FROM business_profile WHERE seller_id = ?",
    sellerId
  );
}

export async function upsertSellerPreferences(p: SellerPreferences): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO seller_preferences (id, seller_id, preferred_language, currency,
      email_notifications, push_notifications, order_updates, community_updates,
      security_alerts, weekly_summary, two_factor_auth)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(seller_id) DO UPDATE SET
      preferred_language = excluded.preferred_language, currency = excluded.currency,
      email_notifications = excluded.email_notifications,
      push_notifications = excluded.push_notifications,
      order_updates = excluded.order_updates, community_updates = excluded.community_updates,
      security_alerts = excluded.security_alerts, weekly_summary = excluded.weekly_summary,
      two_factor_auth = excluded.two_factor_auth`,
    p.id, p.seller_id, p.preferred_language, p.currency,
    p.email_notifications, p.push_notifications, p.order_updates,
    p.community_updates, p.security_alerts, p.weekly_summary, p.two_factor_auth
  );
}

export async function getSellerPreferences(sellerId: string): Promise<SellerPreferences | null> {
  const db = await getDatabase();
  return db.getFirstAsync<SellerPreferences>(
    "SELECT * FROM seller_preferences WHERE seller_id = ?",
    sellerId
  );
}

export async function upsertSellerLevel(l: SellerLevel): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO seller_level (id, level_name, min_points, max_points, benefits, badge_icon, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      level_name = excluded.level_name, min_points = excluded.min_points,
      max_points = excluded.max_points, benefits = excluded.benefits,
      badge_icon = excluded.badge_icon, created_at = excluded.created_at,
      updated_at = excluded.updated_at`,
    l.id, l.level_name, l.min_points, l.max_points,
    l.benefits, l.badge_icon, l.created_at, l.updated_at
  );
}

// ============================================================
// PRODUCTS (Marketplace)
// ============================================================

export async function upsertProduct(p: Product): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO product (id, name, description, color, images, brand, price,
      product_category_id, badges, interests, condition, condition_description,
      is_active, is_exchangeable, seller_id, view_count, created_at, updated_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, description = excluded.description, color = excluded.color,
      images = excluded.images, brand = excluded.brand, price = excluded.price,
      product_category_id = excluded.product_category_id, badges = excluded.badges,
      interests = excluded.interests, condition = excluded.condition,
      condition_description = excluded.condition_description,
      is_active = excluded.is_active, is_exchangeable = excluded.is_exchangeable,
      view_count = excluded.view_count, created_at = excluded.created_at,
      updated_at = excluded.updated_at, synced_at = datetime('now')`,
    p.id, p.name, p.description, p.color, p.images, p.brand, p.price,
    p.product_category_id, p.badges, p.interests, p.condition,
    p.condition_description, p.is_active, p.is_exchangeable,
    p.seller_id, p.view_count, p.created_at, p.updated_at
  );
}

export async function getProduct(id: number): Promise<Product | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Product>("SELECT * FROM product WHERE id = ?", id);
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const db = await getDatabase();
  return db.getAllAsync<Product>(
    "SELECT * FROM product WHERE seller_id = ? ORDER BY created_at DESC",
    sellerId
  );
}

export async function getProductsByCategory(categoryId: number, limit = 20, offset = 0): Promise<Product[]> {
  const db = await getDatabase();
  return db.getAllAsync<Product>(
    "SELECT * FROM product WHERE product_category_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?",
    categoryId, limit, offset
  );
}

// ============================================================
// STORE PRODUCTS (Ecommerce)
// ============================================================

export async function upsertStoreProduct(p: StoreProduct): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO store_product (id, name, description, stock, barcode, sku, price,
      has_offer, offer_price, seller_id, images, is_active, badges, brand, color,
      average_rating, reviews_number, likes_count, sale_count, view_count,
      material_composition, recycled_content, weight, weight_unit, tags, features,
      warranty, warranty_duration, sub_category_id, created_at, updated_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, description = excluded.description, stock = excluded.stock,
      barcode = excluded.barcode, sku = excluded.sku, price = excluded.price,
      has_offer = excluded.has_offer, offer_price = excluded.offer_price,
      images = excluded.images, is_active = excluded.is_active, badges = excluded.badges,
      brand = excluded.brand, color = excluded.color, average_rating = excluded.average_rating,
      reviews_number = excluded.reviews_number, likes_count = excluded.likes_count,
      sale_count = excluded.sale_count, view_count = excluded.view_count,
      material_composition = excluded.material_composition, recycled_content = excluded.recycled_content,
      weight = excluded.weight, weight_unit = excluded.weight_unit, tags = excluded.tags,
      features = excluded.features, warranty = excluded.warranty,
      warranty_duration = excluded.warranty_duration, sub_category_id = excluded.sub_category_id,
      created_at = excluded.created_at, updated_at = excluded.updated_at, synced_at = datetime('now')`,
    p.id, p.name, p.description, p.stock, p.barcode, p.sku, p.price,
    p.has_offer, p.offer_price, p.seller_id, p.images, p.is_active,
    p.badges, p.brand, p.color, p.average_rating, p.reviews_number,
    p.likes_count, p.sale_count, p.view_count, p.material_composition,
    p.recycled_content, p.weight, p.weight_unit, p.tags, p.features,
    p.warranty, p.warranty_duration, p.sub_category_id, p.created_at, p.updated_at
  );
}

export async function getStoreProduct(id: number): Promise<StoreProduct | null> {
  const db = await getDatabase();
  return db.getFirstAsync<StoreProduct>("SELECT * FROM store_product WHERE id = ?", id);
}

export async function getStoreProductsBySeller(sellerId: string): Promise<StoreProduct[]> {
  const db = await getDatabase();
  return db.getAllAsync<StoreProduct>(
    "SELECT * FROM store_product WHERE seller_id = ? ORDER BY created_at DESC",
    sellerId
  );
}

export async function getStoreProductsByCategory(subCategoryId: number, limit = 20, offset = 0): Promise<StoreProduct[]> {
  const db = await getDatabase();
  return db.getAllAsync<StoreProduct>(
    "SELECT * FROM store_product WHERE sub_category_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?",
    subCategoryId, limit, offset
  );
}

// ============================================================
// SERVICES
// ============================================================

export async function upsertService(s: Service): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO service (id, name, description, seller_id, pricing_type, base_price,
      price_range, duration, is_active, images, tags, subcategory_id,
      average_rating, view_count, created_at, updated_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, description = excluded.description,
      pricing_type = excluded.pricing_type, base_price = excluded.base_price,
      price_range = excluded.price_range, duration = excluded.duration,
      is_active = excluded.is_active, images = excluded.images, tags = excluded.tags,
      subcategory_id = excluded.subcategory_id, average_rating = excluded.average_rating,
      view_count = excluded.view_count, created_at = excluded.created_at,
      updated_at = excluded.updated_at, synced_at = datetime('now')`,
    s.id, s.name, s.description, s.seller_id, s.pricing_type, s.base_price,
    s.price_range, s.duration, s.is_active, s.images, s.tags,
    s.subcategory_id, s.average_rating, s.view_count, s.created_at, s.updated_at
  );
}

export async function getService(id: number): Promise<Service | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Service>("SELECT * FROM service WHERE id = ?", id);
}

export async function getServicesBySeller(sellerId: string): Promise<Service[]> {
  const db = await getDatabase();
  return db.getAllAsync<Service>(
    "SELECT * FROM service WHERE seller_id = ? ORDER BY created_at DESC",
    sellerId
  );
}

// ============================================================
// ORDERS
// ============================================================

export async function upsertOrder(o: Order): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO "order" (id, seller_id, shipping_status, created_at, updated_at, synced_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
      shipping_status = excluded.shipping_status, updated_at = excluded.updated_at,
      synced_at = datetime('now')`,
    o.id, o.seller_id, o.shipping_status, o.created_at, o.updated_at
  );
}

export async function getOrder(id: number): Promise<Order | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Order>('SELECT * FROM "order" WHERE id = ?', id);
}

export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  const db = await getDatabase();
  return db.getAllAsync<Order>(
    'SELECT * FROM "order" WHERE seller_id = ? ORDER BY created_at DESC',
    sellerId
  );
}

export async function upsertOrderItem(item: OrderItem): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO order_item (id, order_id, product_id, store_product_id, quantity, price, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      quantity = excluded.quantity, price = excluded.price`,
    item.id, item.order_id, item.product_id, item.store_product_id,
    item.quantity, item.price, item.created_at
  );
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<OrderItem>(
    "SELECT * FROM order_item WHERE order_id = ?",
    orderId
  );
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function upsertNotification(n: Notification): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO notification (id, seller_id, type, title, message, is_read, priority,
      related_id, action_url, metadata, created_at, read_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      is_read = excluded.is_read, read_at = excluded.read_at, metadata = excluded.metadata`,
    n.id, n.seller_id, n.type, n.title, n.message, n.is_read,
    n.priority, n.related_id, n.action_url, n.metadata, n.created_at, n.read_at
  );
}

export async function getNotifications(sellerId: string, limit = 50, offset = 0): Promise<Notification[]> {
  const db = await getDatabase();
  return db.getAllAsync<Notification>(
    "SELECT * FROM notification WHERE seller_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    sellerId, limit, offset
  );
}

export async function getUnreadNotificationCount(sellerId: string): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM notification WHERE seller_id = ? AND is_read = 0",
    sellerId
  );
  return row?.count ?? 0;
}

export async function markNotificationRead(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE notification SET is_read = 1, read_at = datetime('now') WHERE id = ?",
    id
  );
}

export async function markAllNotificationsRead(sellerId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE notification SET is_read = 1, read_at = datetime('now') WHERE seller_id = ? AND is_read = 0",
    sellerId
  );
}

// ============================================================
// CHAT & MESSAGES
// ============================================================

export async function upsertChat(c: Chat): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO chat (id, sender_id, receiver_id, product_id, is_exchange, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
      product_id = excluded.product_id, is_exchange = excluded.is_exchange`,
    c.id, c.sender_id, c.receiver_id, c.product_id, c.is_exchange, c.created_at
  );
}

export async function getChatsBySeller(sellerId: string): Promise<Chat[]> {
  const db = await getDatabase();
  return db.getAllAsync<Chat>(
    "SELECT * FROM chat WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC",
    sellerId, sellerId
  );
}

export async function upsertMessage(m: Message): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO message (id, chat_id, sender_id, content, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET content = excluded.content`,
    m.id, m.chat_id, m.sender_id, m.content, m.created_at
  );
}

export async function getMessages(chatId: number, limit = 50, offset = 0): Promise<Message[]> {
  const db = await getDatabase();
  return db.getAllAsync<Message>(
    "SELECT * FROM message WHERE chat_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    chatId, limit, offset
  );
}

// ============================================================
// CACHE CURRENT USER (from GraphQL `me` query)
// ============================================================

export async function cacheCurrentUser(data: {
  seller: Seller;
  personProfile?: PersonProfile;
  businessProfile?: BusinessProfile;
  preferences?: SellerPreferences;
  sellerLevel?: SellerLevel;
  country?: Country;
  region?: Region;
  city?: City;
  county?: County;
}): Promise<void> {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async () => {
    if (data.country) await upsertCountry(data.country);
    if (data.region) await upsertRegions([data.region]);
    if (data.city) await upsertCities([data.city]);
    if (data.county) await upsertCounties([data.county]);
    if (data.sellerLevel) await upsertSellerLevel(data.sellerLevel);
    await upsertSeller(data.seller);
    if (data.personProfile) await upsertPersonProfile(data.personProfile);
    if (data.businessProfile) await upsertBusinessProfile(data.businessProfile);
    if (data.preferences) await upsertSellerPreferences(data.preferences);
  });
}

// ============================================================
// CLEAR CACHE
// ============================================================

export async function clearAllCache(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM message;
    DELETE FROM chat;
    DELETE FROM order_item;
    DELETE FROM "order";
    DELETE FROM notification;
    DELETE FROM service;
    DELETE FROM store_product;
    DELETE FROM product_variant;
    DELETE FROM product;
    DELETE FROM seller_preferences;
    DELETE FROM person_profile;
    DELETE FROM business_profile;
    DELETE FROM seller;
    DELETE FROM seller_level;
    DELETE FROM key_value;
  `);
}

export async function clearSellerData(sellerId: string): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM notification WHERE seller_id = '${sellerId}';
    DELETE FROM message WHERE sender_id = '${sellerId}';
    DELETE FROM chat WHERE sender_id = '${sellerId}' OR receiver_id = '${sellerId}';
    DELETE FROM seller_preferences WHERE seller_id = '${sellerId}';
    DELETE FROM person_profile WHERE seller_id = '${sellerId}';
    DELETE FROM business_profile WHERE seller_id = '${sellerId}';
    DELETE FROM seller WHERE id = '${sellerId}';
  `);
}
