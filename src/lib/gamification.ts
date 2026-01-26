export interface LevelInfo {
    level: number;
    title: string;
    nextLevelXp: number;
    progress: number;
}

export function calculateLevel(xp: number): LevelInfo {
    const levels = [
        { min: 0, max: 100, level: 1, title: "Çaylak" },
        { min: 100, max: 300, level: 2, title: "Asistan" },
        { min: 300, max: 600, level: 3, title: "Danışman" },
        { min: 600, max: 1000, level: 4, title: "Kıdemli Danışman" },
        { min: 1000, max: 1500, level: 5, title: "Uzman Danışman" },
        { min: 1500, max: 2500, level: 6, title: "Baş Danışman" },
        { min: 2500, max: 4000, level: 7, title: "Takım Lideri" },
        { min: 4000, max: 6000, level: 8, title: "Bölge Müdürü" },
        { min: 6000, max: 10000, level: 9, title: "Direktör" },
        { min: 10000, max: Infinity, level: 10, title: "Efsane" },
    ];

    const currentLevel = levels.find((l) => xp >= l.min && xp < l.max) || levels[levels.length - 1];
    const progress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        nextLevelXp: currentLevel.max,
        progress: Math.min(progress, 100),
    };
}
