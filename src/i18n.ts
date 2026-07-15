/* ═══════════════════ i18n ═══════════════════ */

export type Lang = 'pl' | 'en' | 'de' | 'fr' | 'it' | 'sk' | 'cs'

export const LANGS: { code: Lang; flag: string; name: string }[] = [
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'sk', flag: '🇸🇰', name: 'Slovenčina' },
  { code: 'cs', flag: '🇨🇿', name: 'Čeština' },
]

/* full dictionary shape is inferred from the Polish base */
const pl = {
  brandHome: 'Strona główna',
  nav: { how: 'Jak to działa', features: 'Funkcje', pricing: 'Cennik', faq: 'FAQ', cta: 'Utwórz kod QR' },
  steps: { s1: 'Wybierz typ', s2: 'Wprowadź dane', s3: 'Dostosuj i pobierz' },

  types: {
    website: { title: 'Strona WWW', desc: 'Otwórz stronę lub landing page' },
    text: { title: 'Tekst', desc: 'Dowolna wiadomość tekstowa' },
    wifi: { title: 'Wi-Fi', desc: 'Połącz z siecią bez wpisywania hasła' },
    email: { title: 'E-mail', desc: 'Otwórz gotową wiadomość e-mail' },
    sms: { title: 'SMS', desc: 'Wyślij gotowego SMS-a' },
    phone: { title: 'Telefon', desc: 'Zadzwoń pod wskazany numer' },
    vcard: { title: 'Wizytówka', desc: 'Zapisz kontakt jednym skanem' },
    whatsapp: { title: 'WhatsApp', desc: 'Rozpocznij czat na WhatsApp' },
    location: { title: 'Lokalizacja', desc: 'Otwórz miejsce w mapach' },
  },

  step1: { title: 'Jaki kod QR chcesz utworzyć?', sub: 'Wybierz typ — w następnym kroku uzupełnisz dane, a na końcu dopasujesz wygląd.' },

  forms: {
    website: { url: 'Adres strony', urlPh: 'https://twojastrona.pl' },
    text: { label: 'Tekst', ph: 'Wpisz dowolną treść…' },
    wifi: { ssid: 'Nazwa sieci (SSID)', ssidPh: 'MojaSiec', pass: 'Hasło', security: 'Zabezpieczenie', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Brak' },
    email: { to: 'Adres e-mail odbiorcy', subject: 'Temat', subjectPh: 'Temat wiadomości', body: 'Treść', bodyPh: 'Treść wiadomości…' },
    sms: { number: 'Numer telefonu', message: 'Wiadomość', messagePh: 'Treść SMS-a…' },
    phone: { number: 'Numer telefonu' },
    whatsapp: { number: 'Numer telefonu', message: 'Wiadomość powitalna', messagePh: 'Cześć! Piszę w sprawie…' },
    location: { query: 'Adres lub nazwa miejsca', queryPh: 'np. Rynek Główny, Kraków', or: '…albo podaj dokładne współrzędne:', lat: 'Szerokość (lat)', lng: 'Długość (lng)' },
    vcard: { first: 'Imię', firstPh: 'Jan', last: 'Nazwisko', lastPh: 'Kowalski', org: 'Firma', orgPh: 'Moja Firma', title: 'Stanowisko', phone: 'Telefon', email: 'E-mail', url: 'Strona WWW' },
  },

  step2: { livePreview: 'Podgląd na żywo', fillPrompt: 'Uzupełnij wymagane pola, aby zobaczyć podgląd kodu.', back: '‹ Wstecz', next: 'Dalej ›' },

  step3: {
    modTitle: 'Modyfikacja', modDesc: 'Kształty, kolory i tekst kodu QR',
    moduleStyle: 'Styl modułów', cornerShape: 'Kształt narożników',
    qrColor: 'Kod QR', bgColor: 'Tło', labelText: 'Tekst pod kodem', labelPh: 'np. Scan me!', labelColor: 'Kolor tekstu',
    logoTitle: 'Logo', logoDesc: 'Umieść własne logo w środku kodu QR',
    logoUpload: 'Kliknij, aby przesłać logo', logoHint: 'PNG, JPG lub SVG · maks. 5 MB',
    change: 'Zmień', remove: 'Usuń', logoScale: 'Skala logo', logoNote: 'Przy logo korekcja błędów została podniesiona do H.',
    paramsTitle: 'Parametry', paramsDesc: 'Korekcja błędów, marginesy i rozmiar pliku',
    errorLevel: 'Korekcja błędów',
    errL: 'Niski (7%) — najmniejszy kod', errM: 'Średni (15%) — zalecany na co dzień',
    errQ: 'Wysoki (25%) — dobre pod logo', errH: 'Maksymalny (30%) — wymagany przy logo',
    margin: 'Marginesy', exportSize: 'Rozmiar eksportu',
    tipTitle: 'Czy wiesz, że?', tipBefore: 'Kody QR z kolorem, logo lub własnym kształtem są skanowane', tipBold: 'częściej', tipAfter: 'niż zwykłe czarno-białe. Wyróżnij swój.',
    download: 'Pobierz kod QR', copy: 'Kopiuj', copied: '✓ Skopiowano', resetStyle: 'Reset stylu', backToData: '‹ Wróć do danych',
  },

  landing: {
    badge: 'Darmowy · bez rejestracji · offline',
    h1: 'Stwórz kod QR w kilka sekund',
    sub: 'Trzy proste kroki od pomysłu do gotowego kodu: wybierz format, wpisz dane i dopasuj wygląd do swojej marki.',
    ctaMain: 'Utwórz kod QR', ctaGhost: 'Zobacz cennik',
    p1: '9 formatów danych', p2: 'Eksport PNG / SVG', p3: 'Własne logo i kolory',

    howTitle: 'Trzy kroki do gotowego kodu', howSub: 'Od wyboru do pobrania — przejrzyście na każdym etapie.',
    how1t: 'Wybierz typ kodu', how1d: 'Strona, Wi-Fi, wizytówka, e-mail, SMS i więcej — każdy format ma gotowy formularz.',
    how2t: 'Wprowadź dane', how2d: 'Uzupełnij pola i obserwuj podgląd kodu aktualizujący się na żywo.',
    how3t: 'Dostosuj i pobierz', how3d: 'Kolory, kształty, logo i podpis. Pobierz PNG w wysokiej jakości lub wektor SVG.',

    featTitle: 'Wszystko, czego potrzebujesz', featSub: 'Kompletny generator — bez kont, limitów i znaków wodnych.',
    f1t: 'Pełna personalizacja', f1d: 'Zmieniaj kształty modułów i narożników, kolory oraz dodaj podpis pod kodem — wszystko z podglądem na żywo.',
    f2t: 'Własne logo', f2d: 'Wstaw logo firmy lub avatar w środek kodu. Korekcja błędów podnosi się automatycznie, aby kod pozostał czytelny.',
    f3t: '9 gotowych formatów', f3d: 'Strona WWW, Wi-Fi, wizytówka vCard, e-mail, SMS, telefon, WhatsApp, lokalizacja i dowolny tekst.',
    f4t: 'Eksport PNG i SVG', f4d: 'Pobierz kod w wysokiej rozdzielczości do 2048 px albo jako wektor SVG do druku. Możesz też skopiować go do schowka.',
    f5t: 'Pełna prywatność', f5d: 'Kody generowane są w całości w Twojej przeglądarce. Żadne dane nie opuszczają Twojego komputera.',
    f6t: 'Bez rejestracji', f6d: 'Zero kont, zero limitów, zero znaków wodnych. Otwierasz, tworzysz, pobierasz.',

    priceTitle: 'Cennik', priceSub: 'Prosty jak sama aplikacja.',
    popular: 'Najpopularniejszy',
    planPersonal: 'Osobisty', perForever: '/ na zawsze',
    planHobby: 'Hobby', perMonth: '/ miesiąc',
    planPro: 'Pro (żartujemy)', perYear: '/ rok',
    startNow: 'Zacznij teraz',
    pp1: 'Wszystkie 9 formatów', pp2: 'Pełna personalizacja', pp3: 'Eksport PNG i SVG', pp4: 'Bez limitów i rejestracji',
    ph1: 'Wszystko z planu Osobisty', ph2: 'Własne logo w kodzie', ph3: 'Rozdzielczość do 2048 px', ph4: 'Kopiowanie do schowka',
    pr1: 'Wszystko z planu Hobby', pr2: 'Kod działa bezterminowo', pr3: '100% prywatności — offline', pr4: 'Dobre samopoczucie gratis',
    priceNote: 'Aplikacja do użytku własnego — wszystkie funkcje są i pozostaną darmowe.',

    faqTitle: 'Częste pytania',
    faq1q: 'Czy wygenerowane kody QR wygasają?', faq1a: 'Nie. Kody są statyczne — dane zapisane są bezpośrednio w kodzie, więc działają bezterminowo i nie zależą od żadnego serwera.',
    faq2q: 'Czy mogę używać kodów komercyjnie?', faq2a: 'Tak, wygenerowane kody możesz wykorzystywać bez ograniczeń — na wizytówkach, plakatach, opakowaniach czy w menu restauracji.',
    faq3q: 'Jak działa kod Wi-Fi?', faq3a: 'Po zeskanowaniu telefon proponuje automatyczne połączenie z siecią — gość nie musi przepisywać hasła.',
    faq4q: 'Który format pobrania wybrać?', faq4a: 'PNG sprawdzi się w internecie i dokumentach. SVG to wektor — wybierz go do druku w dużym formacie, nigdy nie traci jakości.',
    faq5q: 'Czy kolorowy kod QR zawsze zadziała?', faq5a: 'Zadbaj o kontrast: ciemny kod na jasnym tle. Po zmianie kolorów zeskanuj podgląd telefonem, aby mieć pewność.',

    bottomTitle: 'Gotowy na swój pierwszy kod?',
    footer1: 'QR Studio — generator kodów QR do użytku własnego',
    footer2: 'Działa w 100% w Twojej przeglądarce',
  },
}

export type Dict = typeof pl

const en: Dict = {
  brandHome: 'Home',
  nav: { how: 'How it works', features: 'Features', pricing: 'Pricing', faq: 'FAQ', cta: 'Create QR code' },
  steps: { s1: 'Choose type', s2: 'Enter data', s3: 'Customize & download' },

  types: {
    website: { title: 'Website', desc: 'Open a website or landing page' },
    text: { title: 'Text', desc: 'Any plain text message' },
    wifi: { title: 'Wi-Fi', desc: 'Connect without typing the password' },
    email: { title: 'Email', desc: 'Open a ready-made email' },
    sms: { title: 'SMS', desc: 'Send a pre-filled text message' },
    phone: { title: 'Phone', desc: 'Call the given number' },
    vcard: { title: 'Business card', desc: 'Save a contact with one scan' },
    whatsapp: { title: 'WhatsApp', desc: 'Start a WhatsApp chat' },
    location: { title: 'Location', desc: 'Open a place in maps' },
  },

  step1: { title: 'What QR code do you want to create?', sub: 'Pick a type — next you fill in the data, then you customize the look.' },

  forms: {
    website: { url: 'Website address', urlPh: 'https://yoursite.com' },
    text: { label: 'Text', ph: 'Type any content…' },
    wifi: { ssid: 'Network name (SSID)', ssidPh: 'MyNetwork', pass: 'Password', security: 'Security', wpa: 'WPA/WPA2', wep: 'WEP', none: 'None' },
    email: { to: 'Recipient email address', subject: 'Subject', subjectPh: 'Message subject', body: 'Message', bodyPh: 'Message body…' },
    sms: { number: 'Phone number', message: 'Message', messagePh: 'SMS text…' },
    phone: { number: 'Phone number' },
    whatsapp: { number: 'Phone number', message: 'Welcome message', messagePh: 'Hi! I’m writing about…' },
    location: { query: 'Address or place name', queryPh: 'e.g. Times Square, New York', or: '…or enter exact coordinates:', lat: 'Latitude (lat)', lng: 'Longitude (lng)' },
    vcard: { first: 'First name', firstPh: 'John', last: 'Last name', lastPh: 'Smith', org: 'Company', orgPh: 'My Company', title: 'Job title', phone: 'Phone', email: 'Email', url: 'Website' },
  },

  step2: { livePreview: 'Live preview', fillPrompt: 'Fill in the required fields to see the code preview.', back: '‹ Back', next: 'Next ›' },

  step3: {
    modTitle: 'Design', modDesc: 'Shapes, colors and code text',
    moduleStyle: 'Module style', cornerShape: 'Corner shape',
    qrColor: 'QR code', bgColor: 'Background', labelText: 'Text under the code', labelPh: 'e.g. Scan me!', labelColor: 'Text color',
    logoTitle: 'Logo', logoDesc: 'Place your own logo in the center of the code',
    logoUpload: 'Click to upload a logo', logoHint: 'PNG, JPG or SVG · max 5 MB',
    change: 'Change', remove: 'Remove', logoScale: 'Logo scale', logoNote: 'With a logo, error correction was raised to H.',
    paramsTitle: 'Parameters', paramsDesc: 'Error correction, margins and file size',
    errorLevel: 'Error correction',
    errL: 'Low (7%) — smallest code', errM: 'Medium (15%) — recommended',
    errQ: 'High (25%) — good with a logo', errH: 'Maximum (30%) — required with a logo',
    margin: 'Margins', exportSize: 'Export size',
    tipTitle: 'Did you know?', tipBefore: 'QR codes with color, a logo or a custom shape are scanned', tipBold: 'more often', tipAfter: 'than plain black-and-white ones. Make yours stand out.',
    download: 'Download QR code', copy: 'Copy', copied: '✓ Copied', resetStyle: 'Reset style', backToData: '‹ Back to data',
  },

  landing: {
    badge: 'Free · no sign-up · offline',
    h1: 'Create a QR code in seconds',
    sub: 'Three simple steps from idea to finished code: pick a format, enter the data and match the look to your brand.',
    ctaMain: 'Create QR code', ctaGhost: 'See pricing',
    p1: '9 data formats', p2: 'PNG / SVG export', p3: 'Custom logo & colors',

    howTitle: 'Three steps to a finished code', howSub: 'From choice to download — clear at every stage.',
    how1t: 'Choose the code type', how1d: 'Website, Wi-Fi, business card, email, SMS and more — each format has a ready form.',
    how2t: 'Enter the data', how2d: 'Fill in the fields and watch the code preview update live.',
    how3t: 'Customize & download', how3d: 'Colors, shapes, logo and caption. Download a high-quality PNG or an SVG vector.',

    featTitle: 'Everything you need', featSub: 'A complete generator — no accounts, limits or watermarks.',
    f1t: 'Full customization', f1d: 'Change module and corner shapes, colors and add a caption under the code — all with a live preview.',
    f2t: 'Custom logo', f2d: 'Drop a company logo or avatar in the center. Error correction rises automatically so the code stays readable.',
    f3t: '9 ready formats', f3d: 'Website, Wi-Fi, vCard business card, email, SMS, phone, WhatsApp, location and any text.',
    f4t: 'PNG & SVG export', f4d: 'Download the code in high resolution up to 2048 px or as an SVG vector for print. You can also copy it to the clipboard.',
    f5t: 'Full privacy', f5d: 'Codes are generated entirely in your browser. No data ever leaves your computer.',
    f6t: 'No sign-up', f6d: 'No accounts, no limits, no watermarks. Open, create, download.',

    priceTitle: 'Pricing', priceSub: 'As simple as the app itself.',
    popular: 'Most popular',
    planPersonal: 'Personal', perForever: '/ forever',
    planHobby: 'Hobby', perMonth: '/ month',
    planPro: 'Pro (just kidding)', perYear: '/ year',
    startNow: 'Start now',
    pp1: 'All 9 formats', pp2: 'Full customization', pp3: 'PNG & SVG export', pp4: 'No limits or sign-up',
    ph1: 'Everything in Personal', ph2: 'Custom logo in the code', ph3: 'Resolution up to 2048 px', ph4: 'Copy to clipboard',
    pr1: 'Everything in Hobby', pr2: 'Code works forever', pr3: '100% privacy — offline', pr4: 'Good mood included',
    priceNote: 'A personal-use app — all features are and will stay free.',

    faqTitle: 'Frequently asked questions',
    faq1q: 'Do generated QR codes expire?', faq1a: 'No. The codes are static — the data is stored directly in the code, so they work indefinitely and don’t depend on any server.',
    faq2q: 'Can I use the codes commercially?', faq2a: 'Yes, you can use the generated codes without limits — on business cards, posters, packaging or restaurant menus.',
    faq3q: 'How does a Wi-Fi code work?', faq3a: 'After scanning, the phone offers to connect to the network automatically — the guest doesn’t have to retype the password.',
    faq4q: 'Which download format should I pick?', faq4a: 'PNG works for the web and documents. SVG is a vector — pick it for large-format print, it never loses quality.',
    faq5q: 'Will a colored QR code always work?', faq5a: 'Keep the contrast: a dark code on a light background. After changing colors, scan the preview with your phone to be sure.',

    bottomTitle: 'Ready for your first code?',
    footer1: 'QR Studio — a personal-use QR code generator',
    footer2: 'Runs 100% in your browser',
  },
}

const de: Dict = {
  brandHome: 'Startseite',
  nav: { how: 'So funktioniert’s', features: 'Funktionen', pricing: 'Preise', faq: 'FAQ', cta: 'QR-Code erstellen' },
  steps: { s1: 'Typ wählen', s2: 'Daten eingeben', s3: 'Anpassen & herunterladen' },

  types: {
    website: { title: 'Webseite', desc: 'Eine Website oder Landingpage öffnen' },
    text: { title: 'Text', desc: 'Eine beliebige Textnachricht' },
    wifi: { title: 'WLAN', desc: 'Ohne Passworteingabe verbinden' },
    email: { title: 'E-Mail', desc: 'Vorausgefüllte E-Mail öffnen' },
    sms: { title: 'SMS', desc: 'Vorgefertigte SMS senden' },
    phone: { title: 'Telefon', desc: 'Die angegebene Nummer anrufen' },
    vcard: { title: 'Visitenkarte', desc: 'Kontakt mit einem Scan speichern' },
    whatsapp: { title: 'WhatsApp', desc: 'Einen WhatsApp-Chat starten' },
    location: { title: 'Standort', desc: 'Einen Ort in Karten öffnen' },
  },

  step1: { title: 'Welchen QR-Code möchtest du erstellen?', sub: 'Wähle einen Typ — im nächsten Schritt gibst du die Daten ein, danach passt du das Aussehen an.' },

  forms: {
    website: { url: 'Webadresse', urlPh: 'https://deine-seite.de' },
    text: { label: 'Text', ph: 'Beliebigen Inhalt eingeben…' },
    wifi: { ssid: 'Netzwerkname (SSID)', ssidPh: 'MeinNetzwerk', pass: 'Passwort', security: 'Sicherheit', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Keine' },
    email: { to: 'E-Mail-Adresse des Empfängers', subject: 'Betreff', subjectPh: 'Betreff der Nachricht', body: 'Nachricht', bodyPh: 'Nachrichtentext…' },
    sms: { number: 'Telefonnummer', message: 'Nachricht', messagePh: 'SMS-Text…' },
    phone: { number: 'Telefonnummer' },
    whatsapp: { number: 'Telefonnummer', message: 'Begrüßungsnachricht', messagePh: 'Hallo! Ich schreibe wegen…' },
    location: { query: 'Adresse oder Ortsname', queryPh: 'z. B. Marienplatz, München', or: '…oder gib genaue Koordinaten ein:', lat: 'Breite (lat)', lng: 'Länge (lng)' },
    vcard: { first: 'Vorname', firstPh: 'Max', last: 'Nachname', lastPh: 'Mustermann', org: 'Firma', orgPh: 'Meine Firma', title: 'Position', phone: 'Telefon', email: 'E-Mail', url: 'Webseite' },
  },

  step2: { livePreview: 'Live-Vorschau', fillPrompt: 'Fülle die Pflichtfelder aus, um die Code-Vorschau zu sehen.', back: '‹ Zurück', next: 'Weiter ›' },

  step3: {
    modTitle: 'Anpassung', modDesc: 'Formen, Farben und Text des QR-Codes',
    moduleStyle: 'Modul-Stil', cornerShape: 'Eckenform',
    qrColor: 'QR-Code', bgColor: 'Hintergrund', labelText: 'Text unter dem Code', labelPh: 'z. B. Scan me!', labelColor: 'Textfarbe',
    logoTitle: 'Logo', logoDesc: 'Platziere dein eigenes Logo in der Mitte des Codes',
    logoUpload: 'Klicken, um ein Logo hochzuladen', logoHint: 'PNG, JPG oder SVG · max. 5 MB',
    change: 'Ändern', remove: 'Entfernen', logoScale: 'Logo-Größe', logoNote: 'Mit Logo wurde die Fehlerkorrektur auf H erhöht.',
    paramsTitle: 'Parameter', paramsDesc: 'Fehlerkorrektur, Ränder und Dateigröße',
    errorLevel: 'Fehlerkorrektur',
    errL: 'Niedrig (7%) — kleinster Code', errM: 'Mittel (15%) — empfohlen',
    errQ: 'Hoch (25%) — gut mit Logo', errH: 'Maximal (30%) — mit Logo erforderlich',
    margin: 'Ränder', exportSize: 'Exportgröße',
    tipTitle: 'Wusstest du schon?', tipBefore: 'QR-Codes mit Farbe, Logo oder eigener Form werden', tipBold: 'häufiger', tipAfter: 'gescannt als einfache Schwarz-Weiß-Codes. Hebe deinen hervor.',
    download: 'QR-Code herunterladen', copy: 'Kopieren', copied: '✓ Kopiert', resetStyle: 'Stil zurücksetzen', backToData: '‹ Zurück zu den Daten',
  },

  landing: {
    badge: 'Kostenlos · ohne Anmeldung · offline',
    h1: 'Erstelle einen QR-Code in Sekunden',
    sub: 'Drei einfache Schritte von der Idee zum fertigen Code: Format wählen, Daten eingeben und das Aussehen an deine Marke anpassen.',
    ctaMain: 'QR-Code erstellen', ctaGhost: 'Preise ansehen',
    p1: '9 Datenformate', p2: 'PNG-/SVG-Export', p3: 'Eigenes Logo & Farben',

    howTitle: 'Drei Schritte zum fertigen Code', howSub: 'Von der Auswahl bis zum Download — bei jedem Schritt transparent.',
    how1t: 'Code-Typ wählen', how1d: 'Website, WLAN, Visitenkarte, E-Mail, SMS und mehr — jedes Format hat ein fertiges Formular.',
    how2t: 'Daten eingeben', how2d: 'Fülle die Felder aus und beobachte die Live-Vorschau des Codes.',
    how3t: 'Anpassen & herunterladen', how3d: 'Farben, Formen, Logo und Beschriftung. Lade ein hochwertiges PNG oder eine SVG-Vektordatei herunter.',

    featTitle: 'Alles, was du brauchst', featSub: 'Ein vollständiger Generator — ohne Konten, Limits und Wasserzeichen.',
    f1t: 'Volle Anpassung', f1d: 'Ändere Modul- und Eckenformen, Farben und füge eine Beschriftung unter dem Code hinzu — alles mit Live-Vorschau.',
    f2t: 'Eigenes Logo', f2d: 'Setze ein Firmenlogo oder Avatar in die Mitte. Die Fehlerkorrektur steigt automatisch, damit der Code lesbar bleibt.',
    f3t: '9 fertige Formate', f3d: 'Website, WLAN, vCard-Visitenkarte, E-Mail, SMS, Telefon, WhatsApp, Standort und beliebiger Text.',
    f4t: 'PNG- & SVG-Export', f4d: 'Lade den Code in hoher Auflösung bis 2048 px oder als SVG-Vektor für den Druck herunter. Du kannst ihn auch kopieren.',
    f5t: 'Volle Privatsphäre', f5d: 'Codes werden vollständig in deinem Browser erzeugt. Keine Daten verlassen deinen Computer.',
    f6t: 'Ohne Anmeldung', f6d: 'Keine Konten, keine Limits, keine Wasserzeichen. Öffnen, erstellen, herunterladen.',

    priceTitle: 'Preise', priceSub: 'So einfach wie die App selbst.',
    popular: 'Am beliebtesten',
    planPersonal: 'Persönlich', perForever: '/ für immer',
    planHobby: 'Hobby', perMonth: '/ Monat',
    planPro: 'Pro (Spaß)', perYear: '/ Jahr',
    startNow: 'Jetzt starten',
    pp1: 'Alle 9 Formate', pp2: 'Volle Anpassung', pp3: 'PNG- & SVG-Export', pp4: 'Ohne Limits und Anmeldung',
    ph1: 'Alles aus Persönlich', ph2: 'Eigenes Logo im Code', ph3: 'Auflösung bis 2048 px', ph4: 'In Zwischenablage kopieren',
    pr1: 'Alles aus Hobby', pr2: 'Code funktioniert unbegrenzt', pr3: '100% Privatsphäre — offline', pr4: 'Gute Laune gratis',
    priceNote: 'Eine App für den Eigenbedarf — alle Funktionen sind und bleiben kostenlos.',

    faqTitle: 'Häufige Fragen',
    faq1q: 'Verfallen erstellte QR-Codes?', faq1a: 'Nein. Die Codes sind statisch — die Daten stehen direkt im Code, sie funktionieren also unbegrenzt und hängen von keinem Server ab.',
    faq2q: 'Darf ich die Codes kommerziell nutzen?', faq2a: 'Ja, du kannst die erstellten Codes unbegrenzt nutzen — auf Visitenkarten, Plakaten, Verpackungen oder in Restaurantmenüs.',
    faq3q: 'Wie funktioniert ein WLAN-Code?', faq3a: 'Nach dem Scannen bietet das Telefon eine automatische Verbindung an — der Gast muss das Passwort nicht abtippen.',
    faq4q: 'Welches Download-Format soll ich wählen?', faq4a: 'PNG eignet sich für Web und Dokumente. SVG ist ein Vektor — wähle es für den Großformatdruck, es verliert nie an Qualität.',
    faq5q: 'Funktioniert ein farbiger QR-Code immer?', faq5a: 'Achte auf Kontrast: dunkler Code auf hellem Hintergrund. Scanne nach Farbänderungen die Vorschau mit dem Handy, um sicherzugehen.',

    bottomTitle: 'Bereit für deinen ersten Code?',
    footer1: 'QR Studio — QR-Code-Generator für den Eigenbedarf',
    footer2: 'Läuft zu 100% in deinem Browser',
  },
}

const fr: Dict = {
  brandHome: 'Accueil',
  nav: { how: 'Comment ça marche', features: 'Fonctions', pricing: 'Tarifs', faq: 'FAQ', cta: 'Créer un QR code' },
  steps: { s1: 'Choisir le type', s2: 'Saisir les données', s3: 'Personnaliser & télécharger' },

  types: {
    website: { title: 'Site web', desc: 'Ouvrir un site ou une landing page' },
    text: { title: 'Texte', desc: 'N’importe quel message texte' },
    wifi: { title: 'Wi-Fi', desc: 'Se connecter sans saisir le mot de passe' },
    email: { title: 'E-mail', desc: 'Ouvrir un e-mail prérempli' },
    sms: { title: 'SMS', desc: 'Envoyer un SMS prérempli' },
    phone: { title: 'Téléphone', desc: 'Appeler le numéro indiqué' },
    vcard: { title: 'Carte de visite', desc: 'Enregistrer un contact en un scan' },
    whatsapp: { title: 'WhatsApp', desc: 'Démarrer une discussion WhatsApp' },
    location: { title: 'Localisation', desc: 'Ouvrir un lieu dans les cartes' },
  },

  step1: { title: 'Quel QR code voulez-vous créer ?', sub: 'Choisissez un type — ensuite vous saisissez les données, puis vous personnalisez l’apparence.' },

  forms: {
    website: { url: 'Adresse du site', urlPh: 'https://votre-site.fr' },
    text: { label: 'Texte', ph: 'Saisissez n’importe quel contenu…' },
    wifi: { ssid: 'Nom du réseau (SSID)', ssidPh: 'MonReseau', pass: 'Mot de passe', security: 'Sécurité', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Aucune' },
    email: { to: 'Adresse e-mail du destinataire', subject: 'Objet', subjectPh: 'Objet du message', body: 'Message', bodyPh: 'Corps du message…' },
    sms: { number: 'Numéro de téléphone', message: 'Message', messagePh: 'Texte du SMS…' },
    phone: { number: 'Numéro de téléphone' },
    whatsapp: { number: 'Numéro de téléphone', message: 'Message d’accueil', messagePh: 'Bonjour ! Je vous écris au sujet de…' },
    location: { query: 'Adresse ou nom du lieu', queryPh: 'ex. Place de la Concorde, Paris', or: '…ou saisissez les coordonnées exactes :', lat: 'Latitude (lat)', lng: 'Longitude (lng)' },
    vcard: { first: 'Prénom', firstPh: 'Jean', last: 'Nom', lastPh: 'Dupont', org: 'Entreprise', orgPh: 'Mon entreprise', title: 'Poste', phone: 'Téléphone', email: 'E-mail', url: 'Site web' },
  },

  step2: { livePreview: 'Aperçu en direct', fillPrompt: 'Remplissez les champs requis pour voir l’aperçu du code.', back: '‹ Retour', next: 'Suivant ›' },

  step3: {
    modTitle: 'Personnalisation', modDesc: 'Formes, couleurs et texte du QR code',
    moduleStyle: 'Style des modules', cornerShape: 'Forme des coins',
    qrColor: 'QR code', bgColor: 'Fond', labelText: 'Texte sous le code', labelPh: 'ex. Scan me!', labelColor: 'Couleur du texte',
    logoTitle: 'Logo', logoDesc: 'Placez votre logo au centre du code',
    logoUpload: 'Cliquez pour importer un logo', logoHint: 'PNG, JPG ou SVG · max. 5 Mo',
    change: 'Changer', remove: 'Supprimer', logoScale: 'Taille du logo', logoNote: 'Avec un logo, la correction d’erreur a été portée à H.',
    paramsTitle: 'Paramètres', paramsDesc: 'Correction d’erreur, marges et taille du fichier',
    errorLevel: 'Correction d’erreur',
    errL: 'Faible (7%) — code le plus petit', errM: 'Moyenne (15%) — recommandée',
    errQ: 'Élevée (25%) — bien avec un logo', errH: 'Maximale (30%) — requise avec un logo',
    margin: 'Marges', exportSize: 'Taille d’export',
    tipTitle: 'Le saviez-vous ?', tipBefore: 'Les QR codes avec couleur, logo ou forme personnalisée sont scannés', tipBold: 'plus souvent', tipAfter: 'que les codes noir et blanc classiques. Faites ressortir le vôtre.',
    download: 'Télécharger le QR code', copy: 'Copier', copied: '✓ Copié', resetStyle: 'Réinitialiser le style', backToData: '‹ Retour aux données',
  },

  landing: {
    badge: 'Gratuit · sans inscription · hors ligne',
    h1: 'Créez un QR code en quelques secondes',
    sub: 'Trois étapes simples de l’idée au code final : choisissez un format, saisissez les données et adaptez l’apparence à votre marque.',
    ctaMain: 'Créer un QR code', ctaGhost: 'Voir les tarifs',
    p1: '9 formats de données', p2: 'Export PNG / SVG', p3: 'Logo & couleurs perso',

    howTitle: 'Trois étapes vers un code fini', howSub: 'Du choix au téléchargement — clair à chaque étape.',
    how1t: 'Choisir le type de code', how1d: 'Site, Wi-Fi, carte de visite, e-mail, SMS et plus — chaque format a un formulaire prêt.',
    how2t: 'Saisir les données', how2d: 'Remplissez les champs et observez l’aperçu du code se mettre à jour en direct.',
    how3t: 'Personnaliser & télécharger', how3d: 'Couleurs, formes, logo et légende. Téléchargez un PNG de haute qualité ou un vecteur SVG.',

    featTitle: 'Tout ce dont vous avez besoin', featSub: 'Un générateur complet — sans comptes, limites ni filigranes.',
    f1t: 'Personnalisation totale', f1d: 'Changez la forme des modules et des coins, les couleurs et ajoutez une légende sous le code — le tout en direct.',
    f2t: 'Logo personnalisé', f2d: 'Placez un logo d’entreprise ou un avatar au centre. La correction d’erreur augmente automatiquement pour rester lisible.',
    f3t: '9 formats prêts', f3d: 'Site web, Wi-Fi, carte de visite vCard, e-mail, SMS, téléphone, WhatsApp, localisation et tout texte.',
    f4t: 'Export PNG & SVG', f4d: 'Téléchargez le code en haute résolution jusqu’à 2048 px ou en vecteur SVG pour l’impression. Vous pouvez aussi le copier.',
    f5t: 'Confidentialité totale', f5d: 'Les codes sont générés entièrement dans votre navigateur. Aucune donnée ne quitte votre ordinateur.',
    f6t: 'Sans inscription', f6d: 'Aucun compte, aucune limite, aucun filigrane. Ouvrez, créez, téléchargez.',

    priceTitle: 'Tarifs', priceSub: 'Aussi simple que l’application elle-même.',
    popular: 'Le plus populaire',
    planPersonal: 'Personnel', perForever: '/ pour toujours',
    planHobby: 'Loisir', perMonth: '/ mois',
    planPro: 'Pro (pour rire)', perYear: '/ an',
    startNow: 'Commencer',
    pp1: 'Les 9 formats', pp2: 'Personnalisation totale', pp3: 'Export PNG & SVG', pp4: 'Sans limites ni inscription',
    ph1: 'Tout du plan Personnel', ph2: 'Logo personnalisé dans le code', ph3: 'Résolution jusqu’à 2048 px', ph4: 'Copie dans le presse-papiers',
    pr1: 'Tout du plan Loisir', pr2: 'Le code fonctionne indéfiniment', pr3: '100% de confidentialité — hors ligne', pr4: 'Bonne humeur offerte',
    priceNote: 'Une application à usage personnel — toutes les fonctions sont et resteront gratuites.',

    faqTitle: 'Questions fréquentes',
    faq1q: 'Les QR codes générés expirent-ils ?', faq1a: 'Non. Les codes sont statiques — les données sont stockées directement dans le code, ils fonctionnent donc indéfiniment sans dépendre d’un serveur.',
    faq2q: 'Puis-je utiliser les codes commercialement ?', faq2a: 'Oui, vous pouvez utiliser les codes générés sans limites — sur des cartes de visite, affiches, emballages ou menus de restaurant.',
    faq3q: 'Comment fonctionne un code Wi-Fi ?', faq3a: 'Après le scan, le téléphone propose de se connecter automatiquement — l’invité n’a pas à retaper le mot de passe.',
    faq4q: 'Quel format de téléchargement choisir ?', faq4a: 'Le PNG convient au web et aux documents. Le SVG est un vecteur — choisissez-le pour l’impression grand format, il ne perd jamais en qualité.',
    faq5q: 'Un QR code coloré fonctionne-t-il toujours ?', faq5a: 'Gardez le contraste : un code foncé sur fond clair. Après avoir changé les couleurs, scannez l’aperçu avec votre téléphone pour être sûr.',

    bottomTitle: 'Prêt pour votre premier code ?',
    footer1: 'QR Studio — générateur de QR codes à usage personnel',
    footer2: 'Fonctionne à 100% dans votre navigateur',
  },
}

const it: Dict = {
  brandHome: 'Home',
  nav: { how: 'Come funziona', features: 'Funzioni', pricing: 'Prezzi', faq: 'FAQ', cta: 'Crea codice QR' },
  steps: { s1: 'Scegli il tipo', s2: 'Inserisci i dati', s3: 'Personalizza e scarica' },

  types: {
    website: { title: 'Sito web', desc: 'Apri un sito o una landing page' },
    text: { title: 'Testo', desc: 'Qualsiasi messaggio di testo' },
    wifi: { title: 'Wi-Fi', desc: 'Connetti senza digitare la password' },
    email: { title: 'E-mail', desc: 'Apri un’e-mail già pronta' },
    sms: { title: 'SMS', desc: 'Invia un SMS precompilato' },
    phone: { title: 'Telefono', desc: 'Chiama il numero indicato' },
    vcard: { title: 'Biglietto da visita', desc: 'Salva un contatto con una scansione' },
    whatsapp: { title: 'WhatsApp', desc: 'Avvia una chat WhatsApp' },
    location: { title: 'Posizione', desc: 'Apri un luogo nelle mappe' },
  },

  step1: { title: 'Quale codice QR vuoi creare?', sub: 'Scegli un tipo — poi inserisci i dati e infine personalizzi l’aspetto.' },

  forms: {
    website: { url: 'Indirizzo del sito', urlPh: 'https://iltuosito.it' },
    text: { label: 'Testo', ph: 'Inserisci qualsiasi contenuto…' },
    wifi: { ssid: 'Nome rete (SSID)', ssidPh: 'MiaRete', pass: 'Password', security: 'Sicurezza', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Nessuna' },
    email: { to: 'Indirizzo e-mail del destinatario', subject: 'Oggetto', subjectPh: 'Oggetto del messaggio', body: 'Messaggio', bodyPh: 'Testo del messaggio…' },
    sms: { number: 'Numero di telefono', message: 'Messaggio', messagePh: 'Testo dell’SMS…' },
    phone: { number: 'Numero di telefono' },
    whatsapp: { number: 'Numero di telefono', message: 'Messaggio di benvenuto', messagePh: 'Ciao! Ti scrivo per…' },
    location: { query: 'Indirizzo o nome del luogo', queryPh: 'es. Piazza del Duomo, Milano', or: '…oppure inserisci le coordinate esatte:', lat: 'Latitudine (lat)', lng: 'Longitudine (lng)' },
    vcard: { first: 'Nome', firstPh: 'Mario', last: 'Cognome', lastPh: 'Rossi', org: 'Azienda', orgPh: 'La mia azienda', title: 'Ruolo', phone: 'Telefono', email: 'E-mail', url: 'Sito web' },
  },

  step2: { livePreview: 'Anteprima live', fillPrompt: 'Compila i campi obbligatori per vedere l’anteprima del codice.', back: '‹ Indietro', next: 'Avanti ›' },

  step3: {
    modTitle: 'Personalizzazione', modDesc: 'Forme, colori e testo del codice QR',
    moduleStyle: 'Stile dei moduli', cornerShape: 'Forma degli angoli',
    qrColor: 'Codice QR', bgColor: 'Sfondo', labelText: 'Testo sotto il codice', labelPh: 'es. Scan me!', labelColor: 'Colore del testo',
    logoTitle: 'Logo', logoDesc: 'Inserisci il tuo logo al centro del codice',
    logoUpload: 'Clicca per caricare un logo', logoHint: 'PNG, JPG o SVG · max 5 MB',
    change: 'Cambia', remove: 'Rimuovi', logoScale: 'Dimensione logo', logoNote: 'Con il logo la correzione degli errori è stata alzata a H.',
    paramsTitle: 'Parametri', paramsDesc: 'Correzione errori, margini e dimensione del file',
    errorLevel: 'Correzione errori',
    errL: 'Bassa (7%) — codice più piccolo', errM: 'Media (15%) — consigliata',
    errQ: 'Alta (25%) — buona con il logo', errH: 'Massima (30%) — richiesta con il logo',
    margin: 'Margini', exportSize: 'Dimensione di esportazione',
    tipTitle: 'Lo sapevi?', tipBefore: 'I codici QR con colore, logo o forma personalizzata vengono scansionati', tipBold: 'più spesso', tipAfter: 'di quelli in bianco e nero. Fai risaltare il tuo.',
    download: 'Scarica codice QR', copy: 'Copia', copied: '✓ Copiato', resetStyle: 'Ripristina stile', backToData: '‹ Torna ai dati',
  },

  landing: {
    badge: 'Gratis · senza registrazione · offline',
    h1: 'Crea un codice QR in pochi secondi',
    sub: 'Tre semplici passi dall’idea al codice finito: scegli un formato, inserisci i dati e adatta l’aspetto al tuo brand.',
    ctaMain: 'Crea codice QR', ctaGhost: 'Vedi i prezzi',
    p1: '9 formati di dati', p2: 'Esporta PNG / SVG', p3: 'Logo e colori personali',

    howTitle: 'Tre passi verso il codice finito', howSub: 'Dalla scelta al download — chiaro a ogni passaggio.',
    how1t: 'Scegli il tipo di codice', how1d: 'Sito, Wi-Fi, biglietto da visita, e-mail, SMS e altro — ogni formato ha un modulo pronto.',
    how2t: 'Inserisci i dati', how2d: 'Compila i campi e osserva l’anteprima del codice aggiornarsi in tempo reale.',
    how3t: 'Personalizza e scarica', how3d: 'Colori, forme, logo e didascalia. Scarica un PNG di alta qualità o un vettore SVG.',

    featTitle: 'Tutto ciò che ti serve', featSub: 'Un generatore completo — senza account, limiti o filigrane.',
    f1t: 'Personalizzazione totale', f1d: 'Cambia le forme di moduli e angoli, i colori e aggiungi una didascalia sotto il codice — tutto in tempo reale.',
    f2t: 'Logo personalizzato', f2d: 'Metti il logo aziendale o un avatar al centro. La correzione errori aumenta in automatico per restare leggibile.',
    f3t: '9 formati pronti', f3d: 'Sito web, Wi-Fi, biglietto vCard, e-mail, SMS, telefono, WhatsApp, posizione e qualsiasi testo.',
    f4t: 'Esportazione PNG e SVG', f4d: 'Scarica il codice in alta risoluzione fino a 2048 px o come vettore SVG per la stampa. Puoi anche copiarlo negli appunti.',
    f5t: 'Privacy totale', f5d: 'I codici sono generati interamente nel tuo browser. Nessun dato lascia il tuo computer.',
    f6t: 'Senza registrazione', f6d: 'Nessun account, nessun limite, nessuna filigrana. Apri, crea, scarica.',

    priceTitle: 'Prezzi', priceSub: 'Semplice come l’app stessa.',
    popular: 'Più popolare',
    planPersonal: 'Personale', perForever: '/ per sempre',
    planHobby: 'Hobby', perMonth: '/ mese',
    planPro: 'Pro (scherziamo)', perYear: '/ anno',
    startNow: 'Inizia ora',
    pp1: 'Tutti i 9 formati', pp2: 'Personalizzazione totale', pp3: 'Esportazione PNG e SVG', pp4: 'Senza limiti né registrazione',
    ph1: 'Tutto del piano Personale', ph2: 'Logo personalizzato nel codice', ph3: 'Risoluzione fino a 2048 px', ph4: 'Copia negli appunti',
    pr1: 'Tutto del piano Hobby', pr2: 'Il codice funziona per sempre', pr3: '100% privacy — offline', pr4: 'Buonumore incluso',
    priceNote: 'App per uso personale — tutte le funzioni sono e resteranno gratuite.',

    faqTitle: 'Domande frequenti',
    faq1q: 'I codici QR generati scadono?', faq1a: 'No. I codici sono statici — i dati sono salvati direttamente nel codice, quindi funzionano a tempo indeterminato senza dipendere da alcun server.',
    faq2q: 'Posso usare i codici a scopo commerciale?', faq2a: 'Sì, puoi usare i codici generati senza limiti — su biglietti da visita, poster, imballaggi o menu dei ristoranti.',
    faq3q: 'Come funziona un codice Wi-Fi?', faq3a: 'Dopo la scansione, il telefono propone di connettersi automaticamente — l’ospite non deve ridigitare la password.',
    faq4q: 'Quale formato di download scegliere?', faq4a: 'Il PNG va bene per web e documenti. L’SVG è un vettore — scegli lui per la stampa in grande formato, non perde mai qualità.',
    faq5q: 'Un codice QR colorato funziona sempre?', faq5a: 'Mantieni il contrasto: codice scuro su sfondo chiaro. Dopo aver cambiato i colori, scansiona l’anteprima col telefono per sicurezza.',

    bottomTitle: 'Pronto per il tuo primo codice?',
    footer1: 'QR Studio — generatore di codici QR per uso personale',
    footer2: 'Funziona al 100% nel tuo browser',
  },
}

const sk: Dict = {
  brandHome: 'Domov',
  nav: { how: 'Ako to funguje', features: 'Funkcie', pricing: 'Cenník', faq: 'FAQ', cta: 'Vytvoriť QR kód' },
  steps: { s1: 'Vyber typ', s2: 'Zadaj údaje', s3: 'Prispôsob a stiahni' },

  types: {
    website: { title: 'Webstránka', desc: 'Otvor web alebo landing page' },
    text: { title: 'Text', desc: 'Ľubovoľná textová správa' },
    wifi: { title: 'Wi-Fi', desc: 'Pripoj sa bez zadávania hesla' },
    email: { title: 'E-mail', desc: 'Otvor pripravený e-mail' },
    sms: { title: 'SMS', desc: 'Pošli predvyplnenú SMS' },
    phone: { title: 'Telefón', desc: 'Zavolaj na uvedené číslo' },
    vcard: { title: 'Vizitka', desc: 'Ulož kontakt jedným skenom' },
    whatsapp: { title: 'WhatsApp', desc: 'Začni WhatsApp chat' },
    location: { title: 'Poloha', desc: 'Otvor miesto v mapách' },
  },

  step1: { title: 'Aký QR kód chceš vytvoriť?', sub: 'Vyber typ — v ďalšom kroku doplníš údaje a nakoniec prispôsobíš vzhľad.' },

  forms: {
    website: { url: 'Adresa stránky', urlPh: 'https://tvojastranka.sk' },
    text: { label: 'Text', ph: 'Zadaj ľubovoľný obsah…' },
    wifi: { ssid: 'Názov siete (SSID)', ssidPh: 'MojaSiet', pass: 'Heslo', security: 'Zabezpečenie', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Žiadne' },
    email: { to: 'E-mailová adresa príjemcu', subject: 'Predmet', subjectPh: 'Predmet správy', body: 'Správa', bodyPh: 'Text správy…' },
    sms: { number: 'Telefónne číslo', message: 'Správa', messagePh: 'Text SMS…' },
    phone: { number: 'Telefónne číslo' },
    whatsapp: { number: 'Telefónne číslo', message: 'Uvítacia správa', messagePh: 'Ahoj! Píšem ohľadom…' },
    location: { query: 'Adresa alebo názov miesta', queryPh: 'napr. Hlavné námestie, Bratislava', or: '…alebo zadaj presné súradnice:', lat: 'Šírka (lat)', lng: 'Dĺžka (lng)' },
    vcard: { first: 'Meno', firstPh: 'Ján', last: 'Priezvisko', lastPh: 'Novák', org: 'Firma', orgPh: 'Moja firma', title: 'Pozícia', phone: 'Telefón', email: 'E-mail', url: 'Webstránka' },
  },

  step2: { livePreview: 'Živý náhľad', fillPrompt: 'Vyplň povinné polia, aby si videl náhľad kódu.', back: '‹ Späť', next: 'Ďalej ›' },

  step3: {
    modTitle: 'Úpravy', modDesc: 'Tvary, farby a text QR kódu',
    moduleStyle: 'Štýl modulov', cornerShape: 'Tvar rohov',
    qrColor: 'QR kód', bgColor: 'Pozadie', labelText: 'Text pod kódom', labelPh: 'napr. Scan me!', labelColor: 'Farba textu',
    logoTitle: 'Logo', logoDesc: 'Umiestni vlastné logo do stredu kódu',
    logoUpload: 'Klikni na nahranie loga', logoHint: 'PNG, JPG alebo SVG · max. 5 MB',
    change: 'Zmeniť', remove: 'Odstrániť', logoScale: 'Veľkosť loga', logoNote: 'Pri logu bola korekcia chýb zvýšená na H.',
    paramsTitle: 'Parametre', paramsDesc: 'Korekcia chýb, okraje a veľkosť súboru',
    errorLevel: 'Korekcia chýb',
    errL: 'Nízka (7%) — najmenší kód', errM: 'Stredná (15%) — odporúčaná',
    errQ: 'Vysoká (25%) — vhodná s logom', errH: 'Maximálna (30%) — nutná pri logu',
    margin: 'Okraje', exportSize: 'Veľkosť exportu',
    tipTitle: 'Vedel si, že?', tipBefore: 'QR kódy s farbou, logom alebo vlastným tvarom sa skenujú', tipBold: 'častejšie', tipAfter: 'než bežné čierno-biele. Odlíš ten svoj.',
    download: 'Stiahnuť QR kód', copy: 'Kopírovať', copied: '✓ Skopírované', resetStyle: 'Obnoviť štýl', backToData: '‹ Späť na údaje',
  },

  landing: {
    badge: 'Zadarmo · bez registrácie · offline',
    h1: 'Vytvor QR kód za pár sekúnd',
    sub: 'Tri jednoduché kroky od nápadu k hotovému kódu: vyber formát, zadaj údaje a prispôsob vzhľad svojej značke.',
    ctaMain: 'Vytvoriť QR kód', ctaGhost: 'Pozrieť cenník',
    p1: '9 formátov údajov', p2: 'Export PNG / SVG', p3: 'Vlastné logo a farby',

    howTitle: 'Tri kroky k hotovému kódu', howSub: 'Od výberu po stiahnutie — prehľadne v každom kroku.',
    how1t: 'Vyber typ kódu', how1d: 'Web, Wi-Fi, vizitka, e-mail, SMS a viac — každý formát má pripravený formulár.',
    how2t: 'Zadaj údaje', how2d: 'Vyplň polia a sleduj náhľad kódu, ktorý sa aktualizuje naživo.',
    how3t: 'Prispôsob a stiahni', how3d: 'Farby, tvary, logo a popis. Stiahni kvalitné PNG alebo vektor SVG.',

    featTitle: 'Všetko, čo potrebuješ', featSub: 'Kompletný generátor — bez účtov, limitov a vodoznakov.',
    f1t: 'Úplné prispôsobenie', f1d: 'Meň tvary modulov a rohov, farby a pridaj popis pod kód — všetko so živým náhľadom.',
    f2t: 'Vlastné logo', f2d: 'Vlož firemné logo alebo avatar do stredu. Korekcia chýb sa zvýši automaticky, aby kód zostal čitateľný.',
    f3t: '9 hotových formátov', f3d: 'Webstránka, Wi-Fi, vizitka vCard, e-mail, SMS, telefón, WhatsApp, poloha a ľubovoľný text.',
    f4t: 'Export PNG a SVG', f4d: 'Stiahni kód vo vysokom rozlíšení až do 2048 px alebo ako vektor SVG na tlač. Môžeš ho aj skopírovať do schránky.',
    f5t: 'Úplné súkromie', f5d: 'Kódy sa generujú výhradne v tvojom prehliadači. Žiadne dáta neopustia tvoj počítač.',
    f6t: 'Bez registrácie', f6d: 'Žiadne účty, žiadne limity, žiadne vodoznaky. Otvor, vytvor, stiahni.',

    priceTitle: 'Cenník', priceSub: 'Jednoduchý ako samotná aplikácia.',
    popular: 'Najobľúbenejší',
    planPersonal: 'Osobný', perForever: '/ navždy',
    planHobby: 'Hobby', perMonth: '/ mesiac',
    planPro: 'Pro (žartujeme)', perYear: '/ rok',
    startNow: 'Začni teraz',
    pp1: 'Všetkých 9 formátov', pp2: 'Úplné prispôsobenie', pp3: 'Export PNG a SVG', pp4: 'Bez limitov a registrácie',
    ph1: 'Všetko z plánu Osobný', ph2: 'Vlastné logo v kóde', ph3: 'Rozlíšenie až 2048 px', ph4: 'Kopírovanie do schránky',
    pr1: 'Všetko z plánu Hobby', pr2: 'Kód funguje navždy', pr3: '100% súkromie — offline', pr4: 'Dobrá nálada zdarma',
    priceNote: 'Aplikácia na osobné použitie — všetky funkcie sú a zostanú zadarmo.',

    faqTitle: 'Časté otázky',
    faq1q: 'Vypršia vygenerované QR kódy?', faq1a: 'Nie. Kódy sú statické — údaje sú uložené priamo v kóde, takže fungujú neobmedzene a nezávisia od žiadneho servera.',
    faq2q: 'Môžem kódy použiť komerčne?', faq2a: 'Áno, vygenerované kódy môžeš používať bez obmedzení — na vizitkách, plagátoch, obaloch či v menu reštaurácie.',
    faq3q: 'Ako funguje Wi-Fi kód?', faq3a: 'Po naskenovaní telefón ponúkne automatické pripojenie k sieti — hosť nemusí prepisovať heslo.',
    faq4q: 'Ktorý formát stiahnutia zvoliť?', faq4a: 'PNG sa hodí na web a dokumenty. SVG je vektor — vyber ho na veľkoformátovú tlač, nikdy nestratí kvalitu.',
    faq5q: 'Bude farebný QR kód vždy fungovať?', faq5a: 'Dbaj na kontrast: tmavý kód na svetlom pozadí. Po zmene farieb naskenuj náhľad telefónom pre istotu.',

    bottomTitle: 'Pripravený na svoj prvý kód?',
    footer1: 'QR Studio — generátor QR kódov na osobné použitie',
    footer2: 'Funguje na 100% vo tvojom prehliadači',
  },
}

const cs: Dict = {
  brandHome: 'Domů',
  nav: { how: 'Jak to funguje', features: 'Funkce', pricing: 'Ceník', faq: 'FAQ', cta: 'Vytvořit QR kód' },
  steps: { s1: 'Vyber typ', s2: 'Zadej údaje', s3: 'Přizpůsob a stáhni' },

  types: {
    website: { title: 'Web', desc: 'Otevři web nebo landing page' },
    text: { title: 'Text', desc: 'Libovolná textová zpráva' },
    wifi: { title: 'Wi-Fi', desc: 'Připoj se bez zadávání hesla' },
    email: { title: 'E-mail', desc: 'Otevři připravený e-mail' },
    sms: { title: 'SMS', desc: 'Pošli předvyplněnou SMS' },
    phone: { title: 'Telefon', desc: 'Zavolej na uvedené číslo' },
    vcard: { title: 'Vizitka', desc: 'Ulož kontakt jedním skenem' },
    whatsapp: { title: 'WhatsApp', desc: 'Zahaj WhatsApp chat' },
    location: { title: 'Poloha', desc: 'Otevři místo v mapách' },
  },

  step1: { title: 'Jaký QR kód chceš vytvořit?', sub: 'Vyber typ — v dalším kroku doplníš údaje a nakonec přizpůsobíš vzhled.' },

  forms: {
    website: { url: 'Adresa stránky', urlPh: 'https://tvojestranka.cz' },
    text: { label: 'Text', ph: 'Zadej libovolný obsah…' },
    wifi: { ssid: 'Název sítě (SSID)', ssidPh: 'MojeSit', pass: 'Heslo', security: 'Zabezpečení', wpa: 'WPA/WPA2', wep: 'WEP', none: 'Žádné' },
    email: { to: 'E-mailová adresa příjemce', subject: 'Předmět', subjectPh: 'Předmět zprávy', body: 'Zpráva', bodyPh: 'Text zprávy…' },
    sms: { number: 'Telefonní číslo', message: 'Zpráva', messagePh: 'Text SMS…' },
    phone: { number: 'Telefonní číslo' },
    whatsapp: { number: 'Telefonní číslo', message: 'Uvítací zpráva', messagePh: 'Ahoj! Píšu ohledně…' },
    location: { query: 'Adresa nebo název místa', queryPh: 'např. Staroměstské náměstí, Praha', or: '…nebo zadej přesné souřadnice:', lat: 'Šířka (lat)', lng: 'Délka (lng)' },
    vcard: { first: 'Jméno', firstPh: 'Jan', last: 'Příjmení', lastPh: 'Novák', org: 'Firma', orgPh: 'Moje firma', title: 'Pozice', phone: 'Telefon', email: 'E-mail', url: 'Web' },
  },

  step2: { livePreview: 'Živý náhled', fillPrompt: 'Vyplň povinná pole, aby ses viděl náhled kódu.', back: '‹ Zpět', next: 'Dále ›' },

  step3: {
    modTitle: 'Úpravy', modDesc: 'Tvary, barvy a text QR kódu',
    moduleStyle: 'Styl modulů', cornerShape: 'Tvar rohů',
    qrColor: 'QR kód', bgColor: 'Pozadí', labelText: 'Text pod kódem', labelPh: 'např. Scan me!', labelColor: 'Barva textu',
    logoTitle: 'Logo', logoDesc: 'Umísti vlastní logo do středu kódu',
    logoUpload: 'Klikni pro nahrání loga', logoHint: 'PNG, JPG nebo SVG · max. 5 MB',
    change: 'Změnit', remove: 'Odebrat', logoScale: 'Velikost loga', logoNote: 'S logem byla korekce chyb zvýšena na H.',
    paramsTitle: 'Parametry', paramsDesc: 'Korekce chyb, okraje a velikost souboru',
    errorLevel: 'Korekce chyb',
    errL: 'Nízká (7%) — nejmenší kód', errM: 'Střední (15%) — doporučená',
    errQ: 'Vysoká (25%) — vhodná s logem', errH: 'Maximální (30%) — nutná u loga',
    margin: 'Okraje', exportSize: 'Velikost exportu',
    tipTitle: 'Věděl jsi, že?', tipBefore: 'QR kódy s barvou, logem nebo vlastním tvarem se skenují', tipBold: 'častěji', tipAfter: 'než běžné černobílé. Odliš ten svůj.',
    download: 'Stáhnout QR kód', copy: 'Kopírovat', copied: '✓ Zkopírováno', resetStyle: 'Obnovit styl', backToData: '‹ Zpět na údaje',
  },

  landing: {
    badge: 'Zdarma · bez registrace · offline',
    h1: 'Vytvoř QR kód během pár sekund',
    sub: 'Tři jednoduché kroky od nápadu k hotovému kódu: vyber formát, zadej údaje a přizpůsob vzhled své značce.',
    ctaMain: 'Vytvořit QR kód', ctaGhost: 'Zobrazit ceník',
    p1: '9 formátů dat', p2: 'Export PNG / SVG', p3: 'Vlastní logo a barvy',

    howTitle: 'Tři kroky k hotovému kódu', howSub: 'Od výběru po stažení — přehledně v každém kroku.',
    how1t: 'Vyber typ kódu', how1d: 'Web, Wi-Fi, vizitka, e-mail, SMS a další — každý formát má připravený formulář.',
    how2t: 'Zadej údaje', how2d: 'Vyplň pole a sleduj náhled kódu, který se aktualizuje živě.',
    how3t: 'Přizpůsob a stáhni', how3d: 'Barvy, tvary, logo a popisek. Stáhni kvalitní PNG nebo vektor SVG.',

    featTitle: 'Vše, co potřebuješ', featSub: 'Kompletní generátor — bez účtů, limitů a vodoznaků.',
    f1t: 'Plné přizpůsobení', f1d: 'Měň tvary modulů a rohů, barvy a přidej popisek pod kód — vše s živým náhledem.',
    f2t: 'Vlastní logo', f2d: 'Vlož firemní logo nebo avatar doprostřed. Korekce chyb se zvýší automaticky, aby kód zůstal čitelný.',
    f3t: '9 hotových formátů', f3d: 'Web, Wi-Fi, vizitka vCard, e-mail, SMS, telefon, WhatsApp, poloha a libovolný text.',
    f4t: 'Export PNG a SVG', f4d: 'Stáhni kód ve vysokém rozlišení až 2048 px nebo jako vektor SVG pro tisk. Můžeš ho také zkopírovat do schránky.',
    f5t: 'Plné soukromí', f5d: 'Kódy se generují výhradně ve tvém prohlížeči. Žádná data neopustí tvůj počítač.',
    f6t: 'Bez registrace', f6d: 'Žádné účty, žádné limity, žádné vodoznaky. Otevři, vytvoř, stáhni.',

    priceTitle: 'Ceník', priceSub: 'Jednoduchý jako samotná aplikace.',
    popular: 'Nejoblíbenější',
    planPersonal: 'Osobní', perForever: '/ navždy',
    planHobby: 'Hobby', perMonth: '/ měsíc',
    planPro: 'Pro (děláme si legraci)', perYear: '/ rok',
    startNow: 'Začni teď',
    pp1: 'Všech 9 formátů', pp2: 'Plné přizpůsobení', pp3: 'Export PNG a SVG', pp4: 'Bez limitů a registrace',
    ph1: 'Vše z plánu Osobní', ph2: 'Vlastní logo v kódu', ph3: 'Rozlišení až 2048 px', ph4: 'Kopírování do schránky',
    pr1: 'Vše z plánu Hobby', pr2: 'Kód funguje navždy', pr3: '100% soukromí — offline', pr4: 'Dobrá nálada zdarma',
    priceNote: 'Aplikace pro osobní použití — všechny funkce jsou a zůstanou zdarma.',

    faqTitle: 'Časté dotazy',
    faq1q: 'Vyprší vygenerované QR kódy?', faq1a: 'Ne. Kódy jsou statické — data jsou uložena přímo v kódu, takže fungují neomezeně a nezávisí na žádném serveru.',
    faq2q: 'Můžu kódy použít komerčně?', faq2a: 'Ano, vygenerované kódy můžeš používat bez omezení — na vizitkách, plakátech, obalech či v menu restaurace.',
    faq3q: 'Jak funguje Wi-Fi kód?', faq3a: 'Po naskenování telefon nabídne automatické připojení k síti — host nemusí přepisovat heslo.',
    faq4q: 'Který formát stažení zvolit?', faq4a: 'PNG se hodí na web a dokumenty. SVG je vektor — vyber ho pro velkoformátový tisk, nikdy neztratí kvalitu.',
    faq5q: 'Bude barevný QR kód vždy fungovat?', faq5a: 'Dbej na kontrast: tmavý kód na světlém pozadí. Po změně barev naskenuj náhled telefonem pro jistotu.',

    bottomTitle: 'Připraven na svůj první kód?',
    footer1: 'QR Studio — generátor QR kódů pro osobní použití',
    footer2: 'Funguje ze 100% ve tvém prohlížeči',
  },
}

export const DICTS: Record<Lang, Dict> = { pl, en, de, fr, it, sk, cs }

/** Language from the URL path prefix, e.g. "/de" or "/fr/…". */
export function langFromPath(): Lang | null {
  if (typeof location === 'undefined') return null
  const seg = location.pathname.split('/')[1]?.toLowerCase()
  return seg && (DICTS as Record<string, Dict>)[seg] ? (seg as Lang) : null
}

/** Initial language: URL prefix → saved choice → browser → Polish. */
export function detectLang(): Lang {
  const fromUrl = langFromPath()
  if (fromUrl) return fromUrl
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('qr-lang')) as Lang | null
  if (saved && DICTS[saved]) return saved
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2).toLowerCase() : 'pl'
  return (DICTS as Record<string, Dict>)[nav] ? (nav as Lang) : 'pl'
}
