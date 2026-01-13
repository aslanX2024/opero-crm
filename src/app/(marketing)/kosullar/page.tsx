"use client";

import Link from "next/link";
import { FileText, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KullanimKosullariPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Ana Sayfa
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Kullanım Koşulları</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Son güncelleme: 13 Ocak 2026
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
                        <h2>1. Genel Hükümler</h2>
                        <p>
                            Bu Kullanım Koşulları, Siper Bilişim Sanayi ve Ticaret Limited Şirketi tarafından sunulan
                            OPERO CRM hizmetlerinin kullanımını düzenlemektedir. Platformumuza kayıt olarak veya
                            hizmetlerimizi kullanarak bu koşulları kabul etmiş sayılırsınız.
                        </p>

                        <h2>2. Tanımlar</h2>
                        <ul>
                            <li><strong>"Platform":</strong> opero.tr web sitesi ve OPERO CRM uygulaması</li>
                            <li><strong>"Kullanıcı":</strong> Platformu kullanan gerçek veya tüzel kişiler</li>
                            <li><strong>"Hizmet":</strong> Platform üzerinden sunulan tüm özellik ve işlevler</li>
                            <li><strong>"Abonelik":</strong> Kullanıcının seçtiği ücretli plan</li>
                        </ul>

                        <h2>3. Hesap Oluşturma ve Güvenlik</h2>
                        <p>Kullanıcı olarak:</p>
                        <ul>
                            <li>Doğru ve güncel bilgiler sağlamakla yükümlüsünüz</li>
                            <li>Hesap güvenliğinizden siz sorumlusunuz</li>
                            <li>Şifrenizi gizli tutmalısınız</li>
                            <li>Hesabınızdaki tüm aktivitelerden siz sorumlusunuz</li>
                            <li>Yetkisiz erişim durumunda derhal bizi bilgilendirmelisiniz</li>
                        </ul>

                        <h2>4. Hizmet Kullanımı</h2>
                        <p>Platformu kullanırken aşağıdaki kurallara uymalısınız:</p>
                        <ul>
                            <li>Yasalara ve düzenlemelere uygun hareket etmek</li>
                            <li>Üçüncü taraf haklarına saygı göstermek</li>
                            <li>Platformu kötüye kullanmamak</li>
                            <li>Güvenlik açıklarını istismar etmemek</li>
                            <li>Zararlı yazılım yüklememek veya yaymamak</li>
                        </ul>

                        <h2>5. Abonelik ve Ödeme</h2>
                        <h3>5.1 Abonelik Planları</h3>
                        <p>
                            OPERO, farklı özellik ve fiyatlandırma seçenekleri sunan çeşitli abonelik planları
                            sunmaktadır. Plan detayları fiyatlandırma sayfamızda belirtilmiştir.
                        </p>

                        <h3>5.2 Ödeme Koşulları</h3>
                        <ul>
                            <li>Ödemeler aylık veya yıllık olarak alınır</li>
                            <li>Faturalar dönem başında kesilir</li>
                            <li>Geç ödemelerde hizmet askıya alınabilir</li>
                            <li>Fiyat değişiklikleri en az 30 gün önceden bildirilir</li>
                        </ul>

                        <h3>5.3 İade Politikası</h3>
                        <p>
                            Yıllık aboneliklerde ilk 14 gün içinde tam iade yapılır. Aylık aboneliklerde
                            iade yapılmaz, ancak dönem sonunda iptal edilebilir.
                        </p>

                        <h2>6. Fikri Mülkiyet</h2>
                        <p>
                            Platform ve içeriğindeki tüm fikri mülkiyet hakları şirketimize aittir.
                            Kullanıcılar, platforma yükledikleri verilerin mülkiyetini korur ancak
                            hizmet sunumu için gerekli lisansı şirketimize vermiş olur.
                        </p>

                        <h2>7. Veri ve Gizlilik</h2>
                        <p>
                            Verilerinizin işlenmesi hakkında detaylı bilgi için <Link href="/gizlilik" className="text-blue-600">Gizlilik Politikamızı</Link> ve
                            <Link href="/kvkk" className="text-blue-600"> KVKK Aydınlatma Metnimizi</Link> inceleyiniz.
                        </p>

                        <h2>8. Sorumluluk Sınırlamaları</h2>
                        <p>Şirketimiz:</p>
                        <ul>
                            <li>Hizmetin kesintisiz çalışacağını garanti etmez</li>
                            <li>Kullanıcı verilerinin kaybından sorumlu değildir (yedekleme kullanıcı sorumluluğundadır)</li>
                            <li>Dolaylı veya arızi zararlardan sorumlu tutulamaz</li>
                            <li>Üçüncü taraf hizmetlerinin işleyişinden sorumlu değildir</li>
                        </ul>

                        <h2>9. Hesap Sonlandırma</h2>
                        <p>
                            Kullanıcılar hesaplarını istedikleri zaman kapatabilir. Şirketimiz,
                            koşulların ihlali durumunda hesapları askıya alabilir veya sonlandırabilir.
                        </p>

                        <h2>10. Değişiklikler</h2>
                        <p>
                            Bu koşullar zaman zaman güncellenebilir. Önemli değişiklikler e-posta ile
                            bildirilecektir. Değişiklikler sonrası platformu kullanmaya devam etmeniz,
                            yeni koşulları kabul ettiğiniz anlamına gelir.
                        </p>

                        <h2>11. Uygulanacak Hukuk</h2>
                        <p>
                            Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda
                            Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>

                        <h2>12. İletişim</h2>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 not-prose">
                            <p className="font-semibold mb-2">Siper Bilişim Sanayi ve Ticaret Limited Şirketi</p>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Ostim OSB, 100. Yıl Blv Ostim Prestij İş Merkezi D:2.Kat, 55/A/20
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    0 312 870 0 800
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    info@opero.tr
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/gizlilik" className="text-blue-600 hover:underline">
                        Gizlilik Politikası
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/kvkk" className="text-blue-600 hover:underline">
                        KVKK Aydınlatma Metni
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/iletisim" className="text-blue-600 hover:underline">
                        İletişim
                    </Link>
                </div>
            </main>
        </div>
    );
}
