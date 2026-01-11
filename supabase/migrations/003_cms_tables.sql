-- =============================================
-- OPERO CMS TABLES
-- Blog, Testimonials, FAQ Management
-- =============================================

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Genel',
    cover_image TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_company TEXT,
    author_location TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Items Table
CREATE TABLE IF NOT EXISTS faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'Genel',
    order_index INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);

CREATE INDEX IF NOT EXISTS idx_faq_items_published ON faq_items(published);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamp triggers
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
    BEFORE UPDATE ON faq_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
-- Public can read published posts
CREATE POLICY "Public can read published blog posts"
    ON blog_posts FOR SELECT
    USING (published = true);

-- Admins can do everything (check owner role in profiles)
CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'broker'
        )
    );

-- Testimonials Policies
CREATE POLICY "Public can read published testimonials"
    ON testimonials FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage testimonials"
    ON testimonials FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'broker'
        )
    );

-- FAQ Policies
CREATE POLICY "Public can read published faq items"
    ON faq_items FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can manage faq items"
    ON faq_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'broker'
        )
    );

-- =============================================
-- SEED DATA (Optional Sample Content)
-- =============================================

-- Sample Blog Posts
INSERT INTO blog_posts (slug, title, excerpt, content, category, featured, published, read_time)
VALUES 
    ('emlak-crm-nedir', 'Emlak CRM Nedir ve Neden Kullanmalısınız?', 
     'Emlak danışmanları için CRM yazılımının önemi ve doğru CRM seçimi hakkında bilmeniz gerekenler.',
     '## CRM Nedir?

CRM (Customer Relationship Management), müşteri etkileşimlerinizi tek bir platformda yönetmenizi sağlar.

## Neden Kullanmalısınız?

1. **Müşteri Takibi**: Tüm müşteri bilgilerini tek yerden yönetin
2. **Satış Fırsatları**: Pipeline ile hiçbir fırsatı kaçırmayın
3. **Zaman Tasarrufu**: Otomatik hatırlatmalar ile verimlilik
4. **Ekip Yönetimi**: Performans takibi ve raporlama',
     'Rehber', true, true, 5),
    
    ('musteri-takibi-ipuclari', 'Müşteri Takibinde 5 Kritik Hata',
     'Emlak danışmanlarının sıkça yaptığı hatalar ve çözümleri.',
     '## Giriş

Başarılı satış, müşteri ilişkilerine bağlıdır.

## 1. Takip Yapmamak

Her müşteri için takip planı oluşturun.

## 2. Tercihleri Unutmak

Tüm bilgileri CRM''e kaydedin.

## 3. Herkese Eşit Öncelik

Lead scoring kullanın.',
     'İpuçları', true, true, 4),
    
    ('pipeline-yonetimi', 'Satışları Artırmak için Pipeline Yönetimi',
     'Satış hunisi yaklaşımıyla fırsatlarınızı nasıl yönetirsiniz?',
     '## Pipeline Nedir?

Potansiyel müşterinin satışa kadar geçtiği aşamaları görselleştirir.

## Aşamalar

1. Yeni Lead
2. İletişim Kuruldu
3. Gösterim Yapıldı
4. Teklif
5. Kapanış',
     'Satış', false, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Sample Testimonials
INSERT INTO testimonials (quote, author_name, author_role, author_company, author_location, rating, featured, published)
VALUES 
    ('OPERO ile satışlarımız %40 arttı. Müşteri takibi artık çok kolay.',
     'Ahmet Yılmaz', 'Broker', 'Yılmaz Emlak', 'İstanbul', 5, true, true),
    ('Ekip performansını gerçek zamanlı takip edebiliyorum. Mükemmel bir araç.',
     'Zeynep Kaya', 'Ofis Müdürü', 'Prime Gayrimenkul', 'Ankara', 5, true, true),
    ('Pipeline sayesinde hiçbir müşteriyi kaçırmıyoruz.',
     'Mehmet Demir', 'Danışman', 'Emlak 21', 'İzmir', 5, true, true),
    ('Komisyon takibi çok düzenli oldu.',
     'Ayşe Öztürk', 'Kıdemli Danışman', 'Century Gayrimenkul', 'Bursa', 5, false, true),
    ('Mobil uygulaması sahada çok işe yarıyor.',
     'Can Yıldız', 'Danışman', 'Bağımsız', 'Antalya', 5, false, true)
ON CONFLICT DO NOTHING;

-- Sample FAQ Items
INSERT INTO faq_items (question, answer, category, order_index, published)
VALUES 
    ('OPERO nedir?', 'OPERO, emlak danışmanları ve ofisleri için geliştirilmiş kapsamlı bir CRM platformudur.', 'Genel', 1, true),
    ('Deneme süresi ne kadar?', 'Tüm planlarda 14 gün ücretsiz deneme süresi vardır. Kredi kartı gerekmez.', 'Fiyatlandırma', 1, true),
    ('Mobil uygulama var mı?', 'OPERO bir PWA olarak tasarlanmıştır. Telefonunuzdan ana ekrana ekleyerek kullanabilirsiniz.', 'Genel', 2, true),
    ('Verilerim güvende mi?', 'Evet, tüm veriler şifreli olarak saklanır ve kurumsal düzeyde güvenlik sağlanır.', 'Güvenlik', 1, true),
    ('İstediğim zaman iptal edebilir miyim?', 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz.', 'Fiyatlandırma', 2, true),
    ('Hangi ödeme yöntemlerini kabul ediyorsunuz?', 'Kredi kartı, banka kartı ve yıllık planlarda havale kabul ediyoruz.', 'Fiyatlandırma', 3, true),
    ('Portal entegrasyonu var mı?', 'Sahibinden.com ve Hepsiemlak entegrasyonları yakında eklenecektir.', 'Özellikler', 1, true),
    ('Ekip büyüklüğü limiti var mı?', 'Standart Ofis planında 50 danışmana kadar destek var.', 'Fiyatlandırma', 4, true)
ON CONFLICT DO NOTHING;
