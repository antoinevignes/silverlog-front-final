import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "movie" | "person" | "profile";
  schemaMarkup?: object;
  noIndex?: boolean;
}

export function Seo({
  title,
  description,
  image,
  type = "website",
  schemaMarkup,
  noIndex = false,
}: SeoProps) {
  const siteUrl = "https://silverlog-front.onrender.com";
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : siteUrl;
  const fullTitle = title ? `${title} - Silverlog` : "Silverlog";

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta key="description" name="description" content={description} />}
      <link rel="canonical" href={currentUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content="Silverlog" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      {image && <meta property="og:image" content={image} />}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      {image && <meta name="twitter:image" content={image} />}

      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
}
