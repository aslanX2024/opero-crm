"use client";

import { Property } from "@/lib/services/properties";
import { printContent, formatReportDate, formatReportPrice } from "@/lib/pdf-export";
import {
    PROPERTY_TYPES,
    LISTING_TYPES,
    PROPERTY_STATUSES,
    HEATING_TYPES,
} from "@/types/property";

/**
 * Tek mülk raporu oluşturur
 */
export function generatePropertyReport(property: Property): void {
    const content = `
        <div class="report-header">
            <div class="report-logo">OPERO</div>
            <div class="report-title">${property.title}</div>
            <div class="report-date">Rapor Tarihi: ${formatReportDate()}</div>
        </div>
        
        <div class="price-box">
            <div class="price-label">${LISTING_TYPES[property.listing_type as keyof typeof LISTING_TYPES] || property.listing_type} Fiyatı</div>
            <div class="price-value">${formatReportPrice(property.price, property.currency)}</div>
        </div>
        
        <div class="section">
            <div class="section-title">Temel Bilgiler</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Mülk Tipi</span>
                    <span class="info-value">${PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES] || property.property_type}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Durum</span>
                    <span class="info-value">${PROPERTY_STATUSES[property.status as keyof typeof PROPERTY_STATUSES] || property.status}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Oda Sayısı</span>
                    <span class="info-value">${property.room_count || "-"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Brüt m²</span>
                    <span class="info-value">${property.gross_area || "-"} m²</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Net m²</span>
                    <span class="info-value">${property.net_area || "-"} m²</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Bina Yaşı</span>
                    <span class="info-value">${property.building_age ? `${property.building_age} yıl` : "-"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Kat</span>
                    <span class="info-value">${property.floor ? `${property.floor} / ${property.total_floors || "?"}` : "-"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Isınma</span>
                    <span class="info-value">${property.heating_type || "-"}</span>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Konum</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Şehir</span>
                    <span class="info-value">${property.city || "-"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">İlçe</span>
                    <span class="info-value">${property.district || "-"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Mahalle</span>
                    <span class="info-value">${property.neighborhood || "-"}</span>
                </div>
            </div>
            ${property.address ? `
                <div style="margin-top: 10px; font-size: 13px; color: #4b5563;">
                    <strong>Adres:</strong> ${property.address}
                </div>
            ` : ""}
        </div>
        
        <div class="section">
            <div class="section-title">Özellikler</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${property.has_elevator ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Asansör</span>' : ""}
                ${property.has_parking ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Otopark</span>' : ""}
                ${property.has_balcony ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Balkon</span>' : ""}
                ${property.is_in_complex ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Site İçi</span>' : ""}
                ${property.is_furnished ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Eşyalı</span>' : ""}
                ${property.is_credit_eligible ? '<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px;">✓ Krediye Uygun</span>' : ""}
            </div>
        </div>
        
        ${property.description ? `
            <div class="section">
                <div class="section-title">Açıklama</div>
                <div class="description">${property.description}</div>
            </div>
        ` : ""}
        
        <div class="footer">
            <p>Bu rapor OPERO CRM tarafından oluşturulmuştur.</p>
            <p>www.opero.tr</p>
        </div>
    `;

    printContent({
        title: `${property.title} - Mülk Raporu`,
        content,
    });
}

/**
 * Çoklu mülk listesi raporu
 */
export function generatePortfolioReport(properties: Property[], title: string = "Portföy Raporu"): void {
    const rows = properties.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <strong>${p.title}</strong><br>
                <small style="color: #6b7280;">${p.city || ""} ${p.district ? `/ ${p.district}` : ""}</small>
            </td>
            <td>${PROPERTY_TYPES[p.property_type as keyof typeof PROPERTY_TYPES] || p.property_type}</td>
            <td>${p.room_count || "-"}</td>
            <td>${p.gross_area || "-"} m²</td>
            <td style="text-align: right; font-weight: 600; color: #0284c7;">
                ${formatReportPrice(p.price, p.currency)}
            </td>
            <td>${PROPERTY_STATUSES[p.status as keyof typeof PROPERTY_STATUSES] || p.status}</td>
        </tr>
    `).join("");

    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

    const content = `
        <div class="report-header">
            <div class="report-logo">OPERO</div>
            <div class="report-title">${title}</div>
            <div class="report-date">Rapor Tarihi: ${formatReportDate()}</div>
        </div>
        
        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 1; background: #f0f9ff; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-size: 12px; color: #0369a1;">Toplam Mülk</div>
                <div style="font-size: 24px; font-weight: 700; color: #0284c7;">${properties.length}</div>
            </div>
            <div style="flex: 1; background: #f0fdf4; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-size: 12px; color: #166534;">Aktif</div>
                <div style="font-size: 24px; font-weight: 700; color: #16a34a;">${properties.filter(p => p.status === "aktif").length}</div>
            </div>
            <div style="flex: 1; background: #fef3c7; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-size: 12px; color: #92400e;">Toplam Değer</div>
                <div style="font-size: 24px; font-weight: 700; color: #d97706;">${formatReportPrice(totalValue, "TRY")}</div>
            </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #f3f4f6;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">#</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Mülk</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Tip</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Oda</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Alan</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Fiyat</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Durum</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        
        <div class="footer">
            <p>Bu rapor OPERO CRM tarafından oluşturulmuştur.</p>
            <p>www.opero.tr</p>
        </div>
    `;

    printContent({
        title: `${title} - OPERO`,
        content,
        styles: `
            table tr:nth-child(even) { background: #f9fafb; }
            table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        `,
    });
}
