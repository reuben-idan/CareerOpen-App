import React from "react";
import { Helmet } from "react-helmet-async";
import analytics from "../../services/analytics";

const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  twitterHandle = "@careeropen",
  children,
}) => {
  const siteTitle = "CareerOpen";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription =
    "Connect with professionals, find job opportunities, and grow your career with CareerOpen.";
  const defaultImage = "/images/og-image.jpg";
  const defaultUrl = "https://careeropen.com";

  const seoData = {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: keywords.join(", "),
    image: image || defaultImage,
    url: url || defaultUrl,
    type,
  };

  // Track page view
  React.useEffect(() => {
    analytics.track("page_view", {
      page_title: seoData.title,
      page_description: seoData.description,
    });
  }, [seoData.title, seoData.description]);

  const metaTags = [
    {
      name: "description",
      content: seoData.description,
    },
    {
      name: "keywords",
      content: seoData.keywords,
    },
    // Open Graph
    {
      property: "og:title",
      content: seoData.title,
    },
    {
      property: "og:description",
      content: seoData.description,
    },
    {
      property: "og:type",
      content: seoData.type,
    },
    {
      property: "og:url",
      content: seoData.url,
    },
    {
      property: "og:image",
      content: seoData.image,
    },
    // Twitter
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:creator",
      content: twitterHandle,
    },
    {
      name: "twitter:title",
      content: seoData.title,
    },
    {
      name: "twitter:description",
      content: seoData.description,
    },
    {
      name: "twitter:image",
      content: seoData.image,
    },
    // Additional Meta Tags
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "theme-color",
      content: "#0ea5e9",
    },
    {
      rel: "canonical",
      href: seoData.url,
    },
  ];

  return (
    <Helmet>
      <title>{seoData.title}</title>
      {metaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}

      {/* Favicon */}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Additional Children */}
      {children}
    </Helmet>
  );
};

export default SEO;
