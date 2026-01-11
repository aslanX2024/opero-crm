// Türkiye Lokasyon Verileri - Şehir > İlçe > Mahalle

export interface Neighborhood {
    id: string;
    name: string;
}

export interface District {
    id: string;
    name: string;
    neighborhoods: Neighborhood[];
}

export interface City {
    id: string;
    name: string;
    plate: string;
    districts: District[];
}

// Ana şehirler ve ilçeleri
export const TURKEY_LOCATIONS: City[] = [
    {
        id: "istanbul",
        name: "İstanbul",
        plate: "34",
        districts: [
            {
                id: "kadikoy",
                name: "Kadıköy",
                neighborhoods: [
                    { id: "moda", name: "Moda" },
                    { id: "fenerbahce", name: "Fenerbahçe" },
                    { id: "caddebostan", name: "Caddebostan" },
                    { id: "bostanci", name: "Bostancı" },
                    { id: "goztepe", name: "Göztepe" },
                    { id: "kozyatagi", name: "Kozyatağı" },
                    { id: "suadiye", name: "Suadiye" },
                    { id: "erenkoy", name: "Erenköy" },
                ],
            },
            {
                id: "besiktas",
                name: "Beşiktaş",
                neighborhoods: [
                    { id: "bebek", name: "Bebek" },
                    { id: "etiler", name: "Etiler" },
                    { id: "levent", name: "Levent" },
                    { id: "ortakoy", name: "Ortaköy" },
                    { id: "arnavutkoy", name: "Arnavutköy" },
                    { id: "akaretler", name: "Akaretler" },
                    { id: "nisantasi", name: "Nişantaşı" },
                ],
            },
            {
                id: "sisli",
                name: "Şişli",
                neighborhoods: [
                    { id: "mecidiyekoy", name: "Mecidiyeköy" },
                    { id: "gulbahar", name: "Gülbahar" },
                    { id: "bomonti", name: "Bomonti" },
                    { id: "osmanbey", name: "Osmanbey" },
                    { id: "fulya", name: "Fulya" },
                    { id: "halaskargazi", name: "Halaskargazi" },
                ],
            },
            {
                id: "uskudar",
                name: "Üsküdar",
                neighborhoods: [
                    { id: "cengelkoy", name: "Çengelköy" },
                    { id: "kuzguncuk", name: "Kuzguncuk" },
                    { id: "beylerbeyi", name: "Beylerbeyi" },
                    { id: "altunizade", name: "Altunizade" },
                    { id: "acibadem", name: "Acıbadem" },
                    { id: "kisikli", name: "Kısıklı" },
                ],
            },
            {
                id: "bakirkoy",
                name: "Bakırköy",
                neighborhoods: [
                    { id: "yesilkoy", name: "Yeşilköy" },
                    { id: "florya", name: "Florya" },
                    { id: "atakoy", name: "Ataköy" },
                    { id: "zuhuratbaba", name: "Zuhuratbaba" },
                    { id: "osmaniye", name: "Osmaniye" },
                ],
            },
            {
                id: "sariyer",
                name: "Sarıyer",
                neighborhoods: [
                    { id: "tarabya", name: "Tarabya" },
                    { id: "yenikoy", name: "Yeniköy" },
                    { id: "istinye", name: "İstinye" },
                    { id: "emirgan", name: "Emirgan" },
                    { id: "maslak", name: "Maslak" },
                    { id: "rumelihisari", name: "Rumelihisarı" },
                ],
            },
            {
                id: "beyoglu",
                name: "Beyoğlu",
                neighborhoods: [
                    { id: "cihangir", name: "Cihangir" },
                    { id: "galata", name: "Galata" },
                    { id: "taksim", name: "Taksim" },
                    { id: "karakoy", name: "Karaköy" },
                    { id: "tunel", name: "Tünel" },
                    { id: "tepebasi", name: "Tepebaşı" },
                ],
            },
            {
                id: "fatih",
                name: "Fatih",
                neighborhoods: [
                    { id: "sultanahmet", name: "Sultanahmet" },
                    { id: "aksaray", name: "Aksaray" },
                    { id: "laleli", name: "Laleli" },
                    { id: "cemberlitas", name: "Çemberlitaş" },
                    { id: "sirkeci", name: "Sirkeci" },
                    { id: "eminonu", name: "Eminönü" },
                ],
            },
            {
                id: "atasehir",
                name: "Ataşehir",
                neighborhoods: [
                    { id: "barbaros", name: "Barbaros" },
                    { id: "icerenkoy", name: "İçerenköy" },
                    { id: "kucukbakkalkoy", name: "Küçükbakkalköy" },
                    { id: "yenisahra", name: "Yenisahra" },
                    { id: "ataturk", name: "Atatürk" },
                ],
            },
            {
                id: "maltepe",
                name: "Maltepe",
                neighborhoods: [
                    { id: "cevizli", name: "Cevizli" },
                    { id: "altayceşme", name: "Altayçeşme" },
                    { id: "zumrutevler", name: "Zümrütevler" },
                    { id: "idealtepe", name: "İdealtepe" },
                    { id: "kucukyali", name: "Küçükyalı" },
                ],
            },
            {
                id: "kartal",
                name: "Kartal",
                neighborhoods: [
                    { id: "soganlik", name: "Soğanlık" },
                    { id: "yakacik", name: "Yakacık" },
                    { id: "kordonboyu", name: "Kordonboyu" },
                    { id: "cevizli-kartal", name: "Cevizli" },
                    { id: "huzur", name: "Huzur" },
                ],
            },
            {
                id: "pendik",
                name: "Pendik",
                neighborhoods: [
                    { id: "kaynarca", name: "Kaynarca" },
                    { id: "yenisehir", name: "Yenişehir" },
                    { id: "kurtdogmus", name: "Kurtdoğmuş" },
                    { id: "velibaba", name: "Velibaba" },
                    { id: "guzelyali", name: "Güzelyalı" },
                ],
            },
            {
                id: "umraniye",
                name: "Ümraniye",
                neighborhoods: [
                    { id: "atasehir-umraniye", name: "Ataşehir" },
                    { id: "cekmekoy", name: "Çekmeköy" },
                    { id: "yamanevler", name: "Yamanevler" },
                    { id: "ihlamurkuyu", name: "Ihlamurkuyu" },
                    { id: "tantavi", name: "Tantavi" },
                ],
            },
            {
                id: "beylikduzu",
                name: "Beylikdüzü",
                neighborhoods: [
                    { id: "adnan-kahveci", name: "Adnan Kahveci" },
                    { id: "yakuplu", name: "Yakuplu" },
                    { id: "kavakli", name: "Kavaklı" },
                    { id: "gurpinar", name: "Gürpınar" },
                ],
            },
            {
                id: "esenyurt",
                name: "Esenyurt",
                neighborhoods: [
                    { id: "incirtepe", name: "İncirtepe" },
                    { id: "fatih-esenyurt", name: "Fatih" },
                    { id: "ardic", name: "Ardıç" },
                    { id: "saadetdere", name: "Saadetdere" },
                ],
            },
        ],
    },
    {
        id: "ankara",
        name: "Ankara",
        plate: "06",
        districts: [
            {
                id: "cankaya",
                name: "Çankaya",
                neighborhoods: [
                    { id: "kavaklidere", name: "Kavaklıdere" },
                    { id: "gaziosmanpasa", name: "Gaziosmanpaşa" },
                    { id: "kizilay", name: "Kızılay" },
                    { id: "cukurambar", name: "Çukurambar" },
                    { id: "bahcelievler-ankara", name: "Bahçelievler" },
                    { id: "birlik", name: "Birlik" },
                    { id: "oran", name: "Oran" },
                    { id: "balgat", name: "Balgat" },
                ],
            },
            {
                id: "kecioren",
                name: "Keçiören",
                neighborhoods: [
                    { id: "etlik", name: "Etlik" },
                    { id: "kuşcağız", name: "Kuşcağız" },
                    { id: "subayevleri", name: "Subayevleri" },
                    { id: "baskent", name: "Başkent" },
                ],
            },
            {
                id: "yenimahalle",
                name: "Yenimahalle",
                neighborhoods: [
                    { id: "batikent", name: "Batıkent" },
                    { id: "demetevler", name: "Demetevler" },
                    { id: "ostim", name: "OSTİM" },
                    { id: "carsamba", name: "Çarşamba" },
                ],
            },
            {
                id: "etimesgut",
                name: "Etimesgut",
                neighborhoods: [
                    { id: "elvankent", name: "Elvankent" },
                    { id: "eryaman", name: "Eryaman" },
                    { id: "tepebasi-ankara", name: "Tepebaşı" },
                ],
            },
            {
                id: "mamak",
                name: "Mamak",
                neighborhoods: [
                    { id: "natoyolu", name: "Natoyolu" },
                    { id: "misket", name: "Misket" },
                    { id: "safaktepe", name: "Şafaktepe" },
                ],
            },
        ],
    },
    {
        id: "izmir",
        name: "İzmir",
        plate: "35",
        districts: [
            {
                id: "karsiyaka",
                name: "Karşıyaka",
                neighborhoods: [
                    { id: "bostanli", name: "Bostanlı" },
                    { id: "mavişehir", name: "Mavişehir" },
                    { id: "atakent", name: "Atakent" },
                    { id: "alaybey", name: "Alaybey" },
                ],
            },
            {
                id: "konak",
                name: "Konak",
                neighborhoods: [
                    { id: "alsancak", name: "Alsancak" },
                    { id: "goztepe-izmir", name: "Göztepe" },
                    { id: "hatay", name: "Hatay" },
                    { id: "guzelyali-izmir", name: "Güzelyalı" },
                ],
            },
            {
                id: "bornova",
                name: "Bornova",
                neighborhoods: [
                    { id: "kazim-dirik", name: "Kazım Dirik" },
                    { id: "evka-3", name: "Evka 3" },
                    { id: "mansuroglu", name: "Mansuroğlu" },
                    { id: "erzene", name: "Erzene" },
                ],
            },
            {
                id: "bayrakli",
                name: "Bayraklı",
                neighborhoods: [
                    { id: "manavkuyu", name: "Manavkuyu" },
                    { id: "bayrakli-merkez", name: "Bayraklı Merkez" },
                    { id: "adalet", name: "Adalet" },
                ],
            },
            {
                id: "cesme",
                name: "Çeşme",
                neighborhoods: [
                    { id: "alacati", name: "Alaçatı" },
                    { id: "ilica", name: "Ilıca" },
                    { id: "ciftlikkoy", name: "Çiftlikköy" },
                ],
            },
        ],
    },
    {
        id: "antalya",
        name: "Antalya",
        plate: "07",
        districts: [
            {
                id: "muratpasa",
                name: "Muratpaşa",
                neighborhoods: [
                    { id: "lara", name: "Lara" },
                    { id: "konyaalti", name: "Konyaaltı" },
                    { id: "guzeloba", name: "Güzeloba" },
                    { id: "meltem", name: "Meltem" },
                ],
            },
            {
                id: "kepez",
                name: "Kepez",
                neighborhoods: [
                    { id: "fabrikalar", name: "Fabrikalar" },
                    { id: "santral", name: "Santral" },
                    { id: "gulluk", name: "Güllük" },
                ],
            },
            {
                id: "alanya",
                name: "Alanya",
                neighborhoods: [
                    { id: "oba", name: "Oba" },
                    { id: "kestel", name: "Kestel" },
                    { id: "mahmutlar", name: "Mahmutlar" },
                    { id: "tosmur", name: "Tosmur" },
                ],
            },
        ],
    },
    {
        id: "bursa",
        name: "Bursa",
        plate: "16",
        districts: [
            {
                id: "nilufer",
                name: "Nilüfer",
                neighborhoods: [
                    { id: "fethiye", name: "Fethiye" },
                    { id: "ozluce", name: "Özlüce" },
                    { id: "ihsaniye", name: "İhsaniye" },
                    { id: "gorukle", name: "Görükle" },
                ],
            },
            {
                id: "osmangazi",
                name: "Osmangazi",
                neighborhoods: [
                    { id: "heykel", name: "Heykel" },
                    { id: "cekirge", name: "Çekirge" },
                    { id: "demirtas", name: "Demirtaş" },
                ],
            },
        ],
    },
];

// Yardımcı fonksiyonlar
export function getCityById(cityId: string): City | undefined {
    return TURKEY_LOCATIONS.find((c) => c.id === cityId);
}

export function getDistrictById(cityId: string, districtId: string): District | undefined {
    const city = getCityById(cityId);
    return city?.districts.find((d) => d.id === districtId);
}

export function getNeighborhoodById(
    cityId: string,
    districtId: string,
    neighborhoodId: string
): Neighborhood | undefined {
    const district = getDistrictById(cityId, districtId);
    return district?.neighborhoods.find((n) => n.id === neighborhoodId);
}

// Seçili lokasyon tipi
export interface SelectedLocation {
    cityId: string;
    cityName: string;
    districtId?: string;
    districtName?: string;
    neighborhoodId?: string;
    neighborhoodName?: string;
}

// Lokasyon label oluştur
export function formatLocationLabel(location: SelectedLocation): string {
    const parts = [location.cityName];
    if (location.districtName) parts.push(location.districtName);
    if (location.neighborhoodName) parts.push(location.neighborhoodName);
    return parts.join(" / ");
}
