![Visitors](https://visitor-badge.laobi.icu/badge?page_id=anonjw.anonjw.github.io&visitor-badge&logo=github)

# Témoins de Jéhovah : proclamateurs, baptêmes et flux, 1914-2050 / Jehovah's Witnesses: publishers, baptisms and flows, 1914-2050

---

## 📑 Sommaire / Table of Contents / Índice
* [🇫🇷 Section Français](#fr)
* [🇬🇧 English Section](#en)
* [🇪🇸 Sección Español](#es)

---

<a id="simplex"></a>
## 🔒 High-Anonymity Support Group (SimpleX Chat)

If you value data privacy and security as much as this project does, you are welcome to join our private support group. 

This group was specifically created for **PIMOs (Physically In, Mentally Out)** and anyone who needs a safe space to connect without leaving a digital footprint. We host this group on **SimpleX Chat** because it is currently the most secure platform available:
* **Zero Identifiers:** No phone number, no email, and no user ID required to register.
* **Maximum Privacy:** It prevents metadata tracking and ensures total anonymity.

To connect with us safely, scan the QR code below or click the invitation link:

[<img src="assets/simplex-qrcode.png" alt="SimpleX QR Code" width="200"/>](https://smp10.simplex.im/g#3Hh8sMnwpASA5TP4J5EeGwwPMIkf2CLghcLsbnc5SVY)

👉 **[Link: Click here to join the group](https://smp10.simplex.im/g#3Hh8sMnwpASA5TP4J5EeGwwPMIkf2CLghcLsbnc5SVY)**

---

# ⚠️ AI GENERATED CONTENT

---

<a id="fr"></a>
## 🇫🇷 Section Français

👉 *[Aller aux informations et liens du groupe de soutien sécurisé (SimpleX Chat)](#simplex)*

**Instructions :** ouvrez `index.html` dans un navigateur (double-clic). Connexion internet non requise à l'ouverture (`js/vendor/chart.umd.js` 4.4.1 est hébergé localement). Boutons drapeaux en haut : français / anglais / espagnol.

### Historique des versions

**Nouveautés de la version 8 :**
- **Restructuration du code :** `index.html` ne contient plus que le balisage (≈ 5 Ko au lieu de 139 Ko). Le CSS, les données, le modèle, les textes (français, anglais, espagnol), la méthodologie et l'interface sont répartis dans des fichiers séparés (voir l'arborescence ci-dessous). Aucun changement de comportement : l'affichage a été vérifié identique à la version 7 (3 langues, modes clair et sombre, mobile, tous les contrôles).
- **Technique :** scripts classiques chargés dans l'ordre (pas de modules ES, pour que le double-clic hors ligne continue de fonctionner). Pour ajouter une langue : créer `js/i18n/<langue>.js` et `docs.<langue>.js`, les déclarer dans `index.html`, et ajouter un drapeau. Pour ajouter une donnée annuelle : `js/data/series.js`.
- **Déplacements :** `chart.umd.js` → `js/vendor/`, `simplex-qrcode.png` → `assets/`.
- **Contenu retiré :** l'événement 2015 (commission royale australienne) et la mention des plaintes dans la note sous le graphique.

**Structure du projet :**

```
index.html              page (balisage uniquement) / markup only / solo el marcado
css/                    base.css (thème, typographie) · components.css (composants)
assets/                 simplex-qrcode.png
js/
  vendor/chart.umd.js   Chart.js 4.4.1 (local)
  lib/                  utils.js (interpolation, accès aux séries, $)
  data/                 series.js (séries officielles) · regions.js · events.js · reddit.js · catalog.js
  model/                params.js · hours.js · history.js · simulation.js · donations.js
  i18n/                 core.js · fr.js · en.js · es.js · docs.fr.js · docs.en.js · docs.es.js
  ui/                   theme.js · format.js · widgets.js · main-chart.js · section-*.js
  app.js                point d'entrée / entry point / punto de entrada
```

**Nouveautés de la version 7 :**
- **Graphique principal :** deux nouvelles données sélectionnables, « Heures de prédication » (total annuel : officiel 1962-2023, estimé ensuite car les proclamateurs ne déclarent plus leurs heures) et « Heures par baptême ». Projection 2026-2050 par modèle, jamais lissées.
- **Nouvel événement 2023 :** fin de la déclaration des heures par les proclamateurs.
- **Technique :** le fichier `chart.umd.js` est désormais hébergé localement.

**Nouveautés de la version 6 :**
- **Traduction complète en espagnol** (interface, graphiques, tableaux, événements, sources et méthodologie) ; nouveau drapeau en haut à droite.
- **Correction :** le lien « Sources and methodology » de la version anglaise pointe désormais vers la section anglaise.

**Nouveautés de la version 5 :**
- **Graphique principal :** nouvelle donnée sélectionnable « Assistance au Mémorial » (personnes présentes, monde officiel 1962-2025 ; répartition régionale avant 2025 et projection 2026-2050 par modèle ; jamais lissée).
- **Congrégations :** série officielle complète 1962-2025 (plus aucune estimation).

**Nouveautés de la version 4 (trois sections sous le graphique principal) :**
- **Nombre total de congrégations dans le monde, 1962-2025** : avec variation annuelle en % et proclamateurs par congrégation (valeurs officielles).
- **Croissance du subreddit r/exjw** : jalons publics datés, valeurs de fin d'année interpolées, variation annuelle en %.
- **Camembert de la part de chaque région dans les dons en dollars** : estimation calée sur les comptes publics du Canada, recoupée avec le Royaume-Uni et l'Australie, pour 2025, 2035 ou 2050 selon le curseur d'intensité.
- *Sources, méthode et limites : section « Sources et méthodologie » en bas de page.*

**Nouveautés de la version 3 :**
- **Décès, exclusions, abandons volontaires et perte nette :** séries annuelles officielles 1962-2025, parties estimées signalées.
- **Affichage des sorties :** correction (plus de plancher à zéro, lissage optionnel sur 3 ans).
- **Interface :** page bilingue.

---

<a id="en"></a>
## 🇬🇧 English Section

👉 *[Go to the secure support group links and info (SimpleX Chat)](#simplex)*

**Instructions:** open `index.html` in a browser (double-click). Internet connection not required on opening (`js/vendor/chart.umd.js` 4.4.1 is hosted locally). Flag buttons at the top: French / English / Spanish.

### Version History

**New in version 8:**
- **Code restructuring:** `index.html` now contains only the markup (≈ 5 KB instead of 139 KB). CSS, data, model, texts (French, English, Spanish), methodology and interface code live in separate files (see the tree below). No change in behaviour: the display was checked to be identical to version 7 (3 languages, light and dark modes, mobile, all controls).
- **Technical:** classic scripts loaded in order (no ES modules, so that offline double-click opening keeps working). To add a language: create `js/i18n/<language>.js` and `docs.<language>.js`, list them in `index.html`, and add a flag. To add an annual data series: `js/data/series.js`.
- **Moves:** `chart.umd.js` → `js/vendor/`, `simplex-qrcode.png` → `assets/`.
- **Content removed:** the 2015 event (Australian Royal Commission) and the mention of complaints in the note under the chart.

**Project structure:**

```
index.html              page (balisage uniquement) / markup only / solo el marcado
css/                    base.css (thème, typographie) · components.css (composants)
assets/                 simplex-qrcode.png
js/
  vendor/chart.umd.js   Chart.js 4.4.1 (local)
  lib/                  utils.js (interpolation, accès aux séries, $)
  data/                 series.js (séries officielles) · regions.js · events.js · reddit.js · catalog.js
  model/                params.js · hours.js · history.js · simulation.js · donations.js
  i18n/                 core.js · fr.js · en.js · es.js · docs.fr.js · docs.en.js · docs.es.js
  ui/                   theme.js · format.js · widgets.js · main-chart.js · section-*.js
  app.js                point d'entrée / entry point / punto de entrada
```

**New in version 7:**
- **Main chart:** two new selectable data types, "Preaching hours" (annual total: official 1962-2023, estimated afterwards because publishers no longer report hours) and "Hours per baptism". 2026-2050 projection by model, never smoothed.
- **New 2023 event:** publishers stop reporting hours.
- **Technical:** the `chart.umd.js` file is now hosted locally.

**New in version 6:**
- **Full Spanish translation** (interface, charts, tables, events, sources and methodology); new flag button at the top right.
- **Fix:** the "Sources and methodology" link in the English version now points to the English section.

**New in version 5:**
- **Main chart:** new selectable data type "Memorial attendance" (people present, official world series 1962-2025; regional split before 2025 and 2026-2050 projection by model; never smoothed).
- **Congregations:** complete official series 1962-2025 (no more estimates).

**New in version 4 (three sections under the main chart):**
- **Total number of congregations worldwide, 1962-2025** : with annual % change and publishers per congregation (official values).
- **Growth of the r/exjw subreddit** : dated public milestones, interpolated year-end values, annual % change.
- **Pie chart of each region's share of donations in dollars** : estimate set on Canada's public accounts, cross-checked with the UK and Australia, for 2025, 2035 or 2050 following the intensity slider.
- *Sources, method and limits: "Sources and methodology" section at the bottom of the page.*

**New in version 3:**
- **Deaths, disfellowshippings, voluntary dissociations and net loss:** official annual series 1962-2025, estimated parts indicated.
- **Display of exits:** correction (no more floor at zero, optional 3-year smoothing).
- **Interface:** bilingual page.

---

<a id="es"></a>
## 🇪🇸 Sección Español

👉 *[Ir a la información y enlaces del grupo de apoyo seguro (SimpleX Chat)](#simplex)*

**Instrucciones:** abra `index.html` en un navegador (doble clic). No se requiere conexión a internet para abrirlo (`js/vendor/chart.umd.js` 4.4.1 está alojado localmente). Botones de banderas en la parte superior: francés / inglés / español.

### Historial de versiones

**Novedades de la versión 8:**
- **Reestructuración del código:** `index.html` ahora solo contiene el marcado (≈ 5 KB en lugar de 139 KB). El CSS, los datos, el modelo, los textos (francés, inglés, español), la metodología y la interfaz están repartidos en archivos separados (véase el árbol más abajo). Ningún cambio de comportamiento: se comprobó que la visualización es idéntica a la de la versión 7 (3 idiomas, modos claro y oscuro, móvil, todos los controles).
- **Técnico:** scripts clásicos cargados en orden (sin módulos ES, para que siga funcionando la apertura sin conexión con doble clic). Para añadir un idioma: crear `js/i18n/<idioma>.js` y `docs.<idioma>.js`, declararlos en `index.html` y añadir una bandera. Para añadir una serie anual: `js/data/series.js`.
- **Cambios de ubicación:** `chart.umd.js` → `js/vendor/`, `simplex-qrcode.png` → `assets/`.
- **Contenido retirado:** el evento de 2015 (comisión real australiana) y la mención de las denuncias en la nota bajo el gráfico.

**Estructura del proyecto:**

```
index.html              page (balisage uniquement) / markup only / solo el marcado
css/                    base.css (thème, typographie) · components.css (composants)
assets/                 simplex-qrcode.png
js/
  vendor/chart.umd.js   Chart.js 4.4.1 (local)
  lib/                  utils.js (interpolation, accès aux séries, $)
  data/                 series.js (séries officielles) · regions.js · events.js · reddit.js · catalog.js
  model/                params.js · hours.js · history.js · simulation.js · donations.js
  i18n/                 core.js · fr.js · en.js · es.js · docs.fr.js · docs.en.js · docs.es.js
  ui/                   theme.js · format.js · widgets.js · main-chart.js · section-*.js
  app.js                point d'entrée / entry point / punto de entrada
```

**Novedades de la versión 7:**
- **Gráfico principal:** dos nuevos datos seleccionables, «Horas de predicación» (total anual: oficial 1962-2023, estimado después porque los publicadores ya no informan sus horas) y «Horas por bautismo». Proyección 2026-2050 por modelo, nunca suavizada.
- **Nuevo evento 2023:** fin del informe de horas por los publicadores.
- **Técnico:** el archivo `chart.umd.js` ahora está alojado localmente.

**Novedades de la versión 6:**
- **Traducción completa al español** (interfaz, gráficos, tablas, eventos, fuentes y metodología); nuevo botón de bandera arriba a la derecha.
- **Corrección:** el enlace «Sources and methodology» de la versión en inglés ahora apunta a la sección en inglés.

**Novedades de la versión 5:**
- **Gráfico principal:** nuevo dato seleccionable «Asistencia a la Conmemoración» (personas presentes, serie mundial oficial 1962-2025; desglose regional antes de 2025 y proyección 2026-2050 por modelo; nunca suavizada).
- **Congregaciones:** serie oficial completa 1962-2025 (sin más estimaciones).

**Novedades de la versión 4 (tres secciones bajo el gráfico principal):**
- **Número total de congregaciones en el mundo, 1962-2025**: con variación anual en % y publicadores por congregación (valores oficiales).
- **Crecimiento del subreddit r/exjw**: hitos públicos fechados, valores de fin de año interpolados, variación anual en %.
- **Gráfico circular de la cuota de donaciones en dólares de cada región**: estimación basada en las cuentas públicas de Canadá, contrastada con el Reino Unido y Australia, para 2025, 2035 o 2050 según el control deslizante de intensidad.
- *Fuentes, método y límites: sección «Fuentes y metodología» al pie de la página.*

**Novedades de la versión 3:**
- **Defunciones, expulsiones, desasociaciones voluntarias y pérdida neta:** series anuales oficiales 1962-2025, partes estimadas indicadas.
- **Visualización de salidas:** corrección (sin límite inferior en cero, suavizado opcional de 3 años).
- **Interfaz:** página bilingüe.

---

## Disclaimer & Legal Notice

1. **Independence:** This project is a purely academic and independent statistical study. It is not affiliated with, authorized, maintained, sponsored, or endorsed by the Watch Tower Bible and Tract Society or any legal entity associated with Jehovah's Witnesses.
2. **Data Accuracy:** Historical data is gathered from publicly available official reports. Future projections (up to 2050) and financial estimates are theoretical mathematical models provided for informational purposes only. They must not be interpreted as definitive facts or official statements.
3. **Data Distinction:** The project explicitly identifies and distinguishes official organization data from the author's estimates, interpolations, or financial deductions through clear labels and visual annotations. 
4. **Limitation of Liability:** The author disclaims any responsibility or liability for the interpretation, use, or consequences of using the data, charts, and models presented on this website.
