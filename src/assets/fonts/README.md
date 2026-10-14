# Font sources

The Source Sans Pro WOFF2 files are unmodified copies of the fonts served by
NCBI's PMC viewer, retrieved on 2026-10-14. They are bundled locally so the
interface does not depend on a remote font request. See `Source-Sans-OFL.txt`
for Adobe's SIL Open Font License.

Source directory:
https://cdn.ncbi.nlm.nih.gov/pmc/pd-medc-pmc-cloudpmc-viewer/production/9b1d9d87/var/data/static/fonts/source-sans-pro/

- `source-sans-pro-regular.woff2`: `sourcesanspro-regular-webfont.woff2`
- `source-sans-pro-bold.woff2`: `sourcesanspro-bold-webfont.woff2`
- `source-sans-pro-italic.woff2`: `sourcesanspro-italic-webfont.woff2`

## Article typography reference

Reference page: https://pmc.ncbi.nlm.nih.gov/articles/PMC11446842/

The PMC viewer uses Source Sans Pro for titles, author metadata and interface
text. Its article prose uses the system font stack `Cambria, "Cambria Math",
Charter, "Times New Roman", Times, stixgeneral, serif`, with a 14pt size,
22.5pt line height and `font-size-adjust: 0.465`. On this Mac, Edge renders
the prose in Charter. The matching article rules are scoped to `.pm-article`
in `src/styles/global.css`; question controls and notes remain in the UI font.

Official styles inspected:
https://cdn.ncbi.nlm.nih.gov/pmc/pd-medc-pmc-cloudpmc-viewer/production/9b1d9d87/var/data/static/assets/article_style-B67IZFds.css
https://cdn.ncbi.nlm.nih.gov/pmc/pd-medc-pmc-cloudpmc-viewer/production/9b1d9d87/var/data/static/assets/base_style-BxRs1iOp.css

The same UI and prose font roles apply to the other study sections: collection
results, forms and metadata use Source Sans Pro; English examples, reference
essays and paraphrases use the PMC prose font stack.

The legacy Merriweather TTF files are retained in the source directory but are
not used by the active stylesheet. They came from Google Fonts and use the
SIL Open Font License in `OFL.txt`.
