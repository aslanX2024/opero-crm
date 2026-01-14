/**
 * PDF Export Utility
 * Browser'ın native print API'sini kullanarak PDF export sağlar.
 * Ek bağımlılık gerektirmez.
 */

interface PrintableContent {
    title: string;
    content: string;
    styles?: string;
}

/**
 * Yazdırılabilir içerik oluştur ve print dialog aç
 */
export function printContent({ title, content, styles = "" }: PrintableContent): void {
    // Yeni pencere aç
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
        alert("Popup engelleyici aktif olabilir. Lütfen izin verin.");
        return;
    }

    // HTML içeriği oluştur
    const html = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none !important; }
                }
                
                /* Rapor stilleri */
                .report-header {
                    text-align: center;
                    border-bottom: 2px solid #2563eb;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .report-logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2563eb;
                    margin-bottom: 5px;
                }
                .report-title {
                    font-size: 20px;
                    color: #1f2937;
                    margin-bottom: 5px;
                }
                .report-date {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .section {
                    margin-bottom: 25px;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2563eb;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px dashed #e5e7eb;
                }
                .info-label {
                    color: #6b7280;
                    font-size: 13px;
                }
                .info-value {
                    font-weight: 500;
                    font-size: 13px;
                }
                
                .price-box {
                    background: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    margin: 20px 0;
                }
                .price-label {
                    font-size: 12px;
                    color: #0369a1;
                    margin-bottom: 5px;
                }
                .price-value {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0284c7;
                }
                
                .description {
                    background: #f9fafb;
                    border-radius: 8px;
                    padding: 15px;
                    font-size: 13px;
                    white-space: pre-wrap;
                }
                
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 11px;
                    color: #9ca3af;
                }
                
                .print-button {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 24px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                }
                .print-button:hover {
                    background: #1d4ed8;
                }
                
                ${styles}
            </style>
        </head>
        <body>
            <button class="print-button no-print" onclick="window.print()">
                📄 PDF Olarak Kaydet
            </button>
            ${content}
            <script>
                // Otomatik print dialog aç (opsiyonel)
                // window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    // İçeriği yaz ve pencereyi hazırla
    printWindow.document.write(html);
    printWindow.document.close();
}

/**
 * Tarih formatla
 */
export function formatReportDate(date: Date = new Date()): string {
    return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Para formatla
 */
export function formatReportPrice(price: number, currency: string = "TRY"): string {
    const symbols: Record<string, string> = {
        TRY: "₺",
        USD: "$",
        EUR: "€",
    };
    const symbol = symbols[currency] || currency;

    return `${symbol}${price.toLocaleString("tr-TR")}`;
}
