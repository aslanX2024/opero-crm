"use client";

import Link from "next/link";
import { Scale, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KVKKPage() {
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
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">KVKK Aydınlatma Metni</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
                        <h2>1. Veri Sorumlusu</h2>
                        <p>
                            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz;
                            veri sorumlusu olarak <strong>Siper Bilişim Sanayi ve Ticaret Limited Şirketi</strong> tarafından
                            aşağıda açıklanan kapsamda işlenebilecektir.
                        </p>

                        <h2>2. Kişisel Verilerin İşlenme Amacı</h2>
                        <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                        <ul>
                            <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
                            <li>Hizmet sunumu ve kalitesinin artırılması</li>
                            <li>Sözleşmesel yükümlülüklerin yerine getirilmesi</li>
                            <li>Talep ve şikayetlerin değerlendirilmesi</li>
                            <li>Yasal düzenlemelerin gerektirdiği yükümlülüklerin yerine getirilmesi</li>
                            <li>İstatistiksel analizler yapılması</li>
                            <li>Pazarlama ve reklam faaliyetleri (açık rıza ile)</li>
                        </ul>

                        <h2>3. İşlenen Kişisel Veri Kategorileri</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left p-2 bg-gray-100 dark:bg-gray-800">Kategori</th>
                                    <th className="text-left p-2 bg-gray-100 dark:bg-gray-800">Açıklama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border-b">Kimlik Bilgisi</td>
                                    <td className="p-2 border-b">Ad, soyad, T.C. kimlik no</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border-b">İletişim Bilgisi</td>
                                    <td className="p-2 border-b">Telefon, e-posta, adres</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border-b">Müşteri İşlem Bilgisi</td>
                                    <td className="p-2 border-b">Satın alma, fatura, randevu</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border-b">İşlem Güvenliği</td>
                                    <td className="p-2 border-b">IP, log, şifre (şifreli)</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border-b">Finans Bilgisi</td>
                                    <td className="p-2 border-b">Ödeme bilgileri</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
                        <p>
                            Kişisel verileriniz, elektronik ortamda web sitesi ve mobil uygulama aracılığıyla
                            otomatik yollarla toplanmaktadır.
                        </p>
                        <p>Hukuki sebepler:</p>
                        <ul>
                            <li>Sözleşmenin kurulması ve ifası için gerekli olması (KVKK m.5/2-c)</li>
                            <li>Kanunlarda açıkça öngörülmesi (KVKK m.5/2-a)</li>
                            <li>Meşru menfaatlerimiz için zorunlu olması (KVKK m.5/2-f)</li>
                            <li>Açık rızanızın bulunması (KVKK m.5/1)</li>
                        </ul>

                        <h2>5. Kişisel Verilerin Aktarımı</h2>
                        <p>Kişisel verileriniz aşağıdaki taraflara aktarılabilir:</p>
                        <ul>
                            <li>İş ortakları ve tedarikçiler (ödeme kuruluşları, bulut hizmet sağlayıcıları)</li>
                            <li>Yasal zorunluluk halinde yetkili kamu kurum ve kuruluşları</li>
                            <li>Hukuki uyuşmazlıklarda mahkemeler ve icra daireleri</li>
                        </ul>

                        <h2>6. Kişisel Veri Sahibinin Hakları</h2>
                        <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                        <ul>
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                            <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme</li>
                            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                            <li>KVKK'nın 7. maddesi kapsamında silinmesini veya yok edilmesini isteme</li>
                            <li>Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</li>
                            <li>Münhasıran otomatik sistemler ile analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                            <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                        </ul>

                        <h2>7. Başvuru Yöntemi</h2>
                        <p>
                            KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
                        </p>
                        <ul>
                            <li>Yazılı başvuru: Aşağıdaki adrese ıslak imzalı dilekçe ile</li>
                            <li>E-posta: kvkk@opero.tr adresine kayıtlı e-posta adresinizden</li>
                            <li>KEP: Şirketimizin kayıtlı elektronik posta adresine</li>
                        </ul>

                        <h2>8. Veri Saklama Süresi</h2>
                        <p>
                            Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal
                            zorunluluklar çerçevesinde saklanmaktadır. İlgili sürelerin dolmasının ardından
                            verileriniz güvenli bir şekilde silinir veya anonim hale getirilir.
                        </p>

                        <h2>9. İletişim Bilgileri</h2>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 not-prose">
                            <p className="font-semibold mb-2">Veri Sorumlusu:</p>
                            <p className="mb-4">Siper Bilişim Sanayi ve Ticaret Limited Şirketi</p>
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
                                    kvkk@opero.tr
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
                    <Link href="/kosullar" className="text-blue-600 hover:underline">
                        Kullanım Koşulları
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
