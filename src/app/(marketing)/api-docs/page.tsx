export default function ApiDocsPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">API Dokümantasyonu</h1>
                <p className="text-gray-600 mb-8">
                    Opero API, CRM verilerinize programatik olarak erişmenizi sağlar.
                    Aşağıda mevcut endpoint'lerin listesini ve kullanım örneklerini bulabilirsiniz.
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="text-5xl mb-4">🔌</div>
                    <h2 className="text-xl font-semibold mb-2">Swagger UI Entegrasyonu</h2>
                    <p className="text-gray-500">
                        OpenAPI (Swagger) arayüzü yakında burada aktif olacak.
                        Şimdilik <a href="#" className="text-blue-600 hover:underline">Postman Koleksiyonumuzu</a> inceleyebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
