"use client";

import { useEffect, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { DASHBOARD_STEPS, PORTFOLIO_STEPS } from "@/lib/onboarding-steps";

const CHECKED_KEY = "opero_onboarding_completed";

export function useOnboarding() {

    const startTour = useCallback((steps: any[]) => {
        const driverObj = driver({
            showProgress: true,
            steps: steps,
            nextBtnText: "İleri",
            prevBtnText: "Geri",
            doneBtnText: "Tamamla",
            allowClose: true,
            onDestroyStarted: () => {
                if (!driverObj.hasNextStep() || confirm("Turu sonlandırmak istiyor musunuz?")) {
                    driverObj.destroy();
                    localStorage.setItem(CHECKED_KEY, "true");
                }
            },
        });

        driverObj.drive();
    }, []);

    const checkAndStartTour = useCallback((page: "dashboard" | "portfolio") => {
        // Daha önce tamamlandıysa gösterme
        // if (localStorage.getItem(CHECKED_KEY)) return;

        // Şimdilik her refresh'te göstermeyelim, sadece manuel tetiklensin veya localStorage kontrolü açılsın
        // Gerçek kullanımda yukarıdaki satırı açmalıyız.

        // Demo amaçlı bekletip başlatalım
        setTimeout(() => {
            if (page === "dashboard") startTour(DASHBOARD_STEPS);
            if (page === "portfolio") startTour(PORTFOLIO_STEPS);
        }, 1000);
    }, [startTour]);

    return {
        startDashboardTour: () => startTour(DASHBOARD_STEPS),
        startPortfolioTour: () => startTour(PORTFOLIO_STEPS),
        checkAndStartTour
    };
}
