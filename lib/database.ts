import * as SQLite from "expo-sqlite";

const DB_NAME = "ekoru.db";
const DB_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable WAL mode for better performance
  await db.execAsync("PRAGMA journal_mode = WAL;");
  await db.execAsync("PRAGMA foreign_keys = ON;");

  await runMigrations(db);

  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const result = await database.getFirstAsync<{ version: number }>(
    "SELECT MAX(version) as version FROM _migrations"
  );
  const currentVersion = result?.version ?? 0;

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      await database.execAsync(migration.sql);
      await database.runAsync(
        "INSERT INTO _migrations (version) VALUES (?)",
        migration.version
      );
      console.log(`[DB] Applied migration v${migration.version}`);
    }
  }
}

interface Migration {
  version: number;
  sql: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    sql: `
      -- ============================================================
      -- GEOGRAPHY
      -- ============================================================

      CREATE TABLE IF NOT EXISTS country (
        id INTEGER PRIMARY KEY,
        country TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS country_config (
        id INTEGER PRIMARY KEY,
        country_id INTEGER NOT NULL UNIQUE,
        country_code TEXT NOT NULL UNIQUE,
        currency_code TEXT NOT NULL,
        currency_symbol TEXT NOT NULL,
        tax_id_label TEXT NOT NULL,
        tax_id_format TEXT,
        default_timezone TEXT NOT NULL,
        default_locale TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        phone_prefix TEXT NOT NULL,
        available_payment_providers TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (country_id) REFERENCES country(id)
      );

      CREATE TABLE IF NOT EXISTS region (
        id INTEGER PRIMARY KEY,
        region TEXT NOT NULL,
        country_id INTEGER NOT NULL,
        FOREIGN KEY (country_id) REFERENCES country(id)
      );

      CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY,
        city TEXT NOT NULL,
        region_id INTEGER NOT NULL,
        FOREIGN KEY (region_id) REFERENCES region(id)
      );

      CREATE TABLE IF NOT EXISTS county (
        id INTEGER PRIMARY KEY,
        county TEXT NOT NULL,
        city_id INTEGER NOT NULL,
        FOREIGN KEY (city_id) REFERENCES city(id)
      );

      -- ============================================================
      -- SELLERS & PROFILES
      -- ============================================================

      CREATE TABLE IF NOT EXISTS seller (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        seller_type TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        is_verified INTEGER DEFAULT 0,
        address TEXT,
        phone TEXT,
        website TEXT,
        preferred_contact_method TEXT DEFAULT 'WHATSAPP',
        social_media_links TEXT,
        points INTEGER DEFAULT 0,
        seller_level_id INTEGER,
        country_id INTEGER,
        region_id INTEGER,
        city_id INTEGER,
        county_id INTEGER,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (seller_level_id) REFERENCES seller_level(id),
        FOREIGN KEY (country_id) REFERENCES country(id),
        FOREIGN KEY (region_id) REFERENCES region(id),
        FOREIGN KEY (city_id) REFERENCES city(id),
        FOREIGN KEY (county_id) REFERENCES county(id)
      );

      CREATE TABLE IF NOT EXISTS person_profile (
        id TEXT PRIMARY KEY,
        seller_id TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT,
        display_name TEXT,
        bio TEXT,
        birthday TEXT,
        profile_image TEXT,
        cover_image TEXT,
        allow_exchanges INTEGER DEFAULT 1,
        person_membership_id INTEGER,
        FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS business_profile (
        id TEXT PRIMARY KEY,
        seller_id TEXT NOT NULL UNIQUE,
        business_name TEXT NOT NULL,
        description TEXT,
        logo TEXT,
        cover_image TEXT,
        business_type TEXT NOT NULL,
        legal_business_name TEXT,
        tax_id TEXT UNIQUE,
        business_start_date TEXT,
        legal_representative TEXT,
        legal_representative_tax_id TEXT,
        shipping_policy TEXT,
        return_policy TEXT,
        service_area TEXT,
        years_of_experience INTEGER,
        certifications TEXT,
        travel_radius INTEGER,
        business_hours TEXT,
        business_membership_id INTEGER,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS seller_preferences (
        id INTEGER PRIMARY KEY,
        seller_id TEXT NOT NULL UNIQUE,
        preferred_language TEXT DEFAULT 'es',
        currency TEXT DEFAULT 'CLP',
        email_notifications INTEGER DEFAULT 1,
        push_notifications INTEGER DEFAULT 1,
        order_updates INTEGER DEFAULT 1,
        community_updates INTEGER DEFAULT 1,
        security_alerts INTEGER DEFAULT 1,
        weekly_summary INTEGER DEFAULT 0,
        two_factor_auth INTEGER DEFAULT 0,
        FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
      );

      -- ============================================================
      -- GAMIFICATION
      -- ============================================================

      CREATE TABLE IF NOT EXISTS seller_level (
        id INTEGER PRIMARY KEY,
        level_name TEXT NOT NULL UNIQUE,
        min_points INTEGER NOT NULL UNIQUE,
        max_points INTEGER,
        benefits TEXT,
        badge_icon TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS seller_label (
        id INTEGER PRIMARY KEY,
        label_name TEXT NOT NULL UNIQUE,
        transaction_kind TEXT NOT NULL,
        transactions_required INTEGER NOT NULL,
        description TEXT,
        badge_icon TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS seller_achieved_label (
        id INTEGER PRIMARY KEY,
        seller_id TEXT NOT NULL,
        label_id INTEGER NOT NULL,
        achieved_at TEXT DEFAULT (datetime('now')),
        current_count INTEGER,
        UNIQUE(seller_id, label_id),
        FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE,
        FOREIGN KEY (label_id) REFERENCES seller_label(id) ON DELETE CASCADE
      );

      -- ============================================================
      -- MARKETPLACE PRODUCTS (Used/Exchangeable)
      -- ============================================================

      CREATE TABLE IF NOT EXISTS department (
        id INTEGER PRIMARY KEY,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS department_translation (
        id INTEGER PRIMARY KEY,
        department_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(department_id, language),
        FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS department_category (
        id INTEGER PRIMARY KEY,
        department_id INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (department_id) REFERENCES department(id)
      );

      CREATE TABLE IF NOT EXISTS department_category_translation (
        id INTEGER PRIMARY KEY,
        department_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(department_category_id, language),
        FOREIGN KEY (department_category_id) REFERENCES department_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS product_category (
        id INTEGER PRIMARY KEY,
        department_category_id INTEGER NOT NULL,
        average_weight REAL DEFAULT 0.0,
        size TEXT DEFAULT 'M',
        weight_unit TEXT DEFAULT 'KG',
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (department_category_id) REFERENCES department_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS product_category_translation (
        id INTEGER PRIMARY KEY,
        product_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        keywords TEXT,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(product_category_id, language),
        FOREIGN KEY (product_category_id) REFERENCES product_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        color TEXT,
        images TEXT,
        brand TEXT NOT NULL,
        price INTEGER NOT NULL,
        product_category_id INTEGER NOT NULL,
        badges TEXT,
        interests TEXT,
        condition TEXT DEFAULT 'NEW',
        condition_description TEXT,
        is_active INTEGER DEFAULT 1,
        is_exchangeable INTEGER DEFAULT 0,
        seller_id TEXT NOT NULL,
        view_count INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (product_category_id) REFERENCES product_category(id),
        FOREIGN KEY (seller_id) REFERENCES seller(id)
      );

      -- ============================================================
      -- STORE PRODUCTS (New Ecommerce)
      -- ============================================================

      CREATE TABLE IF NOT EXISTS store_category (
        id INTEGER PRIMARY KEY,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS store_category_translation (
        id INTEGER PRIMARY KEY,
        store_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(store_category_id, language),
        FOREIGN KEY (store_category_id) REFERENCES store_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS store_sub_category (
        id INTEGER PRIMARY KEY,
        store_category_id INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        average_weight REAL DEFAULT 0.0,
        size TEXT DEFAULT 'M',
        weight_unit TEXT DEFAULT 'KG',
        FOREIGN KEY (store_category_id) REFERENCES store_category(id)
      );

      CREATE TABLE IF NOT EXISTS store_sub_category_translation (
        id INTEGER PRIMARY KEY,
        store_sub_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        keywords TEXT,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        UNIQUE(store_sub_category_id, language),
        FOREIGN KEY (store_sub_category_id) REFERENCES store_sub_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS store_product (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        barcode TEXT UNIQUE,
        sku TEXT,
        price INTEGER NOT NULL,
        has_offer INTEGER DEFAULT 0,
        offer_price INTEGER,
        seller_id TEXT NOT NULL,
        images TEXT,
        is_active INTEGER DEFAULT 1,
        badges TEXT,
        brand TEXT,
        color TEXT,
        average_rating REAL DEFAULT 0,
        reviews_number INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        sale_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        material_composition TEXT,
        recycled_content REAL,
        weight REAL,
        weight_unit TEXT DEFAULT 'KG',
        tags TEXT,
        features TEXT,
        warranty TEXT,
        warranty_duration INTEGER,
        sub_category_id INTEGER NOT NULL,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (seller_id) REFERENCES seller(id),
        FOREIGN KEY (sub_category_id) REFERENCES store_sub_category(id)
      );

      CREATE TABLE IF NOT EXISTS product_variant (
        id INTEGER PRIMARY KEY,
        store_product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        color TEXT,
        size TEXT NOT NULL,
        UNIQUE(store_product_id, color, size),
        FOREIGN KEY (store_product_id) REFERENCES store_product(id)
      );

      -- ============================================================
      -- SERVICES
      -- ============================================================

      CREATE TABLE IF NOT EXISTS service_category (
        id INTEGER PRIMARY KEY,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS service_category_translation (
        id INTEGER PRIMARY KEY,
        service_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        category TEXT NOT NULL,
        slug TEXT NOT NULL,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(service_category_id, language),
        FOREIGN KEY (service_category_id) REFERENCES service_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS service_sub_category (
        id INTEGER PRIMARY KEY,
        service_category_id INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (service_category_id) REFERENCES service_category(id)
      );

      CREATE TABLE IF NOT EXISTS service_sub_category_translation (
        id INTEGER PRIMARY KEY,
        service_sub_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        sub_category TEXT NOT NULL,
        slug TEXT NOT NULL,
        href TEXT,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        UNIQUE(service_sub_category_id, language),
        FOREIGN KEY (service_sub_category_id) REFERENCES service_sub_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS service (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        seller_id TEXT NOT NULL,
        pricing_type TEXT DEFAULT 'QUOTATION',
        base_price REAL,
        price_range TEXT,
        duration INTEGER,
        is_active INTEGER DEFAULT 1,
        images TEXT,
        tags TEXT,
        subcategory_id INTEGER NOT NULL,
        average_rating REAL DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (seller_id) REFERENCES seller(id),
        FOREIGN KEY (subcategory_id) REFERENCES service_sub_category(id)
      );

      -- ============================================================
      -- ORDERS
      -- ============================================================

      CREATE TABLE IF NOT EXISTS "order" (
        id INTEGER PRIMARY KEY,
        seller_id TEXT NOT NULL,
        shipping_status TEXT DEFAULT 'PREPARING',
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (seller_id) REFERENCES seller(id)
      );

      CREATE TABLE IF NOT EXISTS order_item (
        id INTEGER PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        store_product_id INTEGER,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TEXT,
        FOREIGN KEY (order_id) REFERENCES "order"(id),
        FOREIGN KEY (product_id) REFERENCES product(id),
        FOREIGN KEY (store_product_id) REFERENCES store_product(id)
      );

      -- ============================================================
      -- NOTIFICATIONS
      -- ============================================================

      CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY,
        seller_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'MEDIUM',
        related_id TEXT,
        action_url TEXT,
        metadata TEXT,
        created_at TEXT,
        read_at TEXT,
        FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
      );

      -- ============================================================
      -- CHAT & MESSAGES
      -- ============================================================

      CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        product_id INTEGER,
        is_exchange INTEGER DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY (sender_id) REFERENCES seller(id),
        FOREIGN KEY (receiver_id) REFERENCES seller(id),
        FOREIGN KEY (product_id) REFERENCES product(id)
      );

      CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        sender_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT,
        FOREIGN KEY (chat_id) REFERENCES chat(id),
        FOREIGN KEY (sender_id) REFERENCES seller(id)
      );

      -- ============================================================
      -- ENVIRONMENTAL IMPACT
      -- ============================================================

      CREATE TABLE IF NOT EXISTS material_impact_estimate (
        id INTEGER PRIMARY KEY,
        material_type TEXT NOT NULL UNIQUE,
        estimated_co2_savings_kg REAL NOT NULL,
        estimated_water_savings_lt REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS material_impact_estimate_translation (
        id INTEGER PRIMARY KEY,
        material_impact_estimate_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        material_type_translation TEXT NOT NULL,
        UNIQUE(material_impact_estimate_id, language),
        FOREIGN KEY (material_impact_estimate_id) REFERENCES material_impact_estimate(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS product_category_material (
        id INTEGER PRIMARY KEY,
        product_category_id INTEGER NOT NULL,
        material_type_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT DEFAULT 'percentage',
        is_primary INTEGER DEFAULT 0,
        UNIQUE(product_category_id, material_type_id),
        FOREIGN KEY (product_category_id) REFERENCES product_category(id) ON DELETE CASCADE,
        FOREIGN KEY (material_type_id) REFERENCES material_impact_estimate(id)
      );

      -- ============================================================
      -- BLOG & COMMUNITY
      -- ============================================================

      CREATE TABLE IF NOT EXISTS blog_category (
        id INTEGER PRIMARY KEY,
        icon TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS blog_category_translation (
        id INTEGER PRIMARY KEY,
        blog_category_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT NOT NULL,
        href TEXT,
        UNIQUE(blog_category_id, language),
        FOREIGN KEY (blog_category_id) REFERENCES blog_category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS blog_post (
        id INTEGER PRIMARY KEY,
        author_id TEXT NOT NULL,
        is_published INTEGER DEFAULT 0,
        published_at TEXT,
        blog_category_id INTEGER NOT NULL,
        type TEXT DEFAULT 'OTHER',
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (blog_category_id) REFERENCES blog_category(id)
      );

      CREATE TABLE IF NOT EXISTS blog_post_translation (
        id INTEGER PRIMARY KEY,
        blog_post_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        UNIQUE(blog_post_id, language),
        FOREIGN KEY (blog_post_id) REFERENCES blog_post(id) ON DELETE CASCADE
      );

      -- ============================================================
      -- KEY-VALUE STORE
      -- ============================================================

      CREATE TABLE IF NOT EXISTS key_value (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `,
  },
];

export { DB_VERSION };
