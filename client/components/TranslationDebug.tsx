import { useTranslation } from "../hooks/use-translation";

export function TranslationDebug() {
  const { t, i18n } = useTranslation();

  // Test various keys to debug
  const testKeys = [
    "pages.gallery.title",
    "pages.homepage.styleSelection.styles.realistic",
    "common.buttons.generate",
    "brand.name",
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "10px",
        border: "1px solid white",
        zIndex: 9999,
        fontSize: "12px",
        maxWidth: "300px",
      }}
    >
      <div>Language: {i18n.language}</div>
      <div>Ready: {i18n.isInitialized ? "Yes" : "No"}</div>
      <div>Resource keys: {Object.keys(i18n.store?.data || {}).join(", ")}</div>
      <hr style={{ margin: "5px 0" }} />
      {testKeys.map((key) => (
        <div key={key}>
          {key}: "{t(key)}"
        </div>
      ))}
    </div>
  );
}
