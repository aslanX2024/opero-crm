"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GizlilikPolitikasiPage() {
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
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Son güncelleme: 13 Ocak 2026
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
                        <h2>1. Giriş</h2>
                        <p>
                            Siper Bilişim Sanayi ve Ticaret Limited Şirketi ("Şirket", "Biz", "OPERO") olarak kişisel verilerinizin
                            güvenliği hakkında azami hassasiyet göstermekteyiz. Bu Gizlilik Politikası, opero.tr web sitesi ve
                            OPERO CRM uygulaması aracılığıyla toplanan kişisel verilerin nasıl işlendiğini açıklamaktadır.
                        </p>

                        <h2>2. Toplanan Bilgiler</h2>
                        <p>Hizmetlerimizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
                        <ul>
                            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası</li>
                            <li><strong>Hesap Bilgileri:</strong> Kullanıcı adı, şifre (şifrelenmiş)</li>
                            <li><strong>İşlem Bilgileri:</strong> Mülk verileri, müşteri kayıtları, randevular</li>
                            <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri</li>
                            <li><strong>Kullanım Verileri:</strong> Platformda gerçekleştirilen işlemler, tercihler</li>
                        </ul>

                        <h2>3. Bilgilerin Kullanım Amaçları</h2>
                        <p>Topladığımız bilgileri şu amaçlarla kullanmaktayız:</p>
                        <ul>
                            <li>Hizmetlerimizin sunulması ve iyileştirilmesi</li>
                            <li>Kullanıcı hesaplarının yönetimi</li>
                            <li>Müşteri destek hizmetlerinin sağlanması</li>
                            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                            <li>Güvenlik ve dolandırıcılık önleme</li>
                            <li>İletişim ve bilgilendirme (açık rıza ile)</li>
                        </ul>

                        <h2>4. Bilgilerin Paylaşımı</h2>
                        <p>
                            Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz. Aşağıdaki durumlar istisnadır:
                        </p>
                        <ul>
                            <li>Yasal zorunluluklar ve resmi makam talepleri</li>
                            <li>Hizmet sağlayıcılarımız (ödeme işlemcileri, bulut hizmetleri)</li>
                            <li>Şirket birleşme veya devralma durumları</li>
                        </ul>

                        <h2>5. Veri Güvenliği</h2>
                        <p>
                            Verilerinizin güvenliği için endüstri standardı güvenlik önlemleri uygulamaktayız:
                        </p>
                        <ul>
                            <li>SSL/TLS şifreleme</li>
                            <li>Güvenli sunucu altyapısı</li>
                            <li>Düzenli güvenlik denetimleri</li>
                            <li>Erişim kontrolü ve yetkilendirme</li>
                        </ul>

                        <h2>6. Çerezler</h2>
                        <p>
                            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                            Çerezler hakkında detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.
                        </p>

                        <h2>7. Haklarınız</h2>
                        <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                        <ul>
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenen verilere ilişkin bilgi talep etme</li>
                            <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
                            <li>İşlemeye itiraz etme</li>
                        </ul>

                        <h2>8. İletişim</h2>
                        <p>
                            Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                        </p>
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

                        <h2>9. Değişiklikler</h2>
                        <p>
                            Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması
                            durumunda kullanıcılarımız bilgilendirilecektir. Politikanın güncel halini
                            bu sayfada bulabilirsiniz.
                        </p>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/kosullar" className="text-blue-600 hover:underline">
                        Kullanım Koşulları
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
