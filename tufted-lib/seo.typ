#let seo-tags(
  title: "",
  author: none,
  description: none,
  site-url: none,
  page-path: none,
  image-path: none,
) = {
  // Process Canonical URL
  let canonical = if site-url != none and page-path != none {
    let clean-site-url = site-url.trim("/", at: end)
    let clean-path = page-path.trim("/")
    if clean-path == "" {
      clean-site-url + "/"
    } else {
      clean-site-url + "/" + clean-path + "/"
    }
  } else {
    none
  }

  // Process Absolute image path
  let og-image = if image-path == none {
    none
  } else if image-path.starts-with("http") {
    image-path
  } else if site-url != none {
    site-url.trim("/", at: end) + "/" + image-path.trim("/", at: start)
  } else {
    none
  }

  // Process OG type
  let auto-og-type = if page-path == none or page-path == "" or page-path == "/" {
    "website"
  } else {
    "article"
  }

  // Open Graph
  html.elem("meta", attrs: (property: "og:title", content: title))
  html.elem("meta", attrs: (property: "og:type", content: auto-og-type))

  if description != none {
    html.meta(name: "description", content: description)
    html.elem("meta", attrs: (property: "og:description", content: description))
  }

  if canonical != none {
    html.link(rel: "canonical", href: canonical)
    html.elem("meta", attrs: (property: "og:url", content: canonical))
  }

  if author != none {
    html.meta(name: "author", content: author)
    if auto-og-type == "article" {
      html.elem("meta", attrs: (property: "article:author", content: author))
    }
  }

  if og-image != none {
    html.elem("meta", attrs: (property: "og:image", content: og-image))
    html.meta(name: "twitter:card", content: "summary_large_image")
    html.meta(name: "twitter:image", content: og-image)
  } else {
    html.meta(name: "twitter:card", content: "summary")
  }
}
