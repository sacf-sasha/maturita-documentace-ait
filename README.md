# SACF Gaming Website - Aliksandr Zaharouski

## O projektu
SACF Gaming Website je moderní webová stránka pro hráče, vyvinutá pomocí pokročilých webových technologií. Projekt byl vytvořen jako součást maturitní práce pro AIT.

## Instalace a spuštění projektu

### Požadavky
Před instalací se ujistěte, že máte na svém počítači nainstalovaný následující software:
- Node.js (verze 18 nebo vyšší) - [stáhnout z oficiálních stránek](https://nodejs.org/)
- Git - [stáhnout z oficiálních stránek](https://git-scm.com/downloads)

### Podrobný návod k instalaci

1. Otevřete terminál (příkazový řádek) na vašem počítači

2. Naklonujte repozitář:
```bash
git clone https://github.com/sacf-sasha/React-maturita-ait.git
```

3. Přejděte do adresáře projektu:
```bash
cd React-maturita-ait/project
```

4. Nainstalujte všechny potřebné závislosti:
```bash
npm install
```

5. Spusťte projekt v vývojovém režimu:
```bash
npm run dev
```

6. Otevřete prohlížeč a přejděte na adresu:
```
http://localhost:5173
```

### Struktura projektu
```
project/
├── src/               # Zdrojový kód
│   ├── components/    # React komponenty
│   ├── pages/         # Stránky aplikace
│   ├── lib/          # Knihovny a utility
│   └── assets/       # Obrázky a další zdroje
├── public/           # Statické soubory
└── ...
```

### Použité technologie
- React 18.2.0 - knihovna pro tvorbu uživatelského rozhraní
- TypeScript - typovaný JavaScript
- Vite - moderní build nástroj
- Supabase - databáze a autentizace
- Three.js - knihovna pro 3D grafiku
- Tailwind CSS - utilární CSS framework