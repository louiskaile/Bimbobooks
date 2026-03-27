import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  title,
  hero{
    headline,
    subtitle,
    image{
      asset->{
        _id,
        url
      },
      alt,
      hotspot
    },
    logo{
      asset->{
        _id,
        url
      },
      alt,
      hotspot
    },
    mobileLogo{
      asset->{
        _id,
        url
      },
      alt,
      hotspot
    }
  },
  pageBuilder[]{
    _type,
    _key,
    _type == "infoSection" => {
      title,
      content,
      image{
        asset->{
          _id,
          url
        },
        alt,
        hotspot
      }
    },
    _type == "callToAction" => {
      title,
      content,
      button{
        text,
        ${linkReference}
      }
    }
  },
  seo{
    metaDescription,
    ogImage{
      asset->{
        _id,
        url
      }
    }
  }
}`);

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const navigationQuery = defineQuery(`*[_type == "navigation" && _id == "navigation"][0]{
  _id,
  title,
  items[]{
    _key,
    label,
    visible,
    link{
      _type,
      linkType,
      href,
      openInNewTab,
      "page": page->slug.current,
      "post": post->slug.current
    },
    submenu[]{
      _key,
      label,
      visible,
      link{
        _type,
        linkType,
        href,
        openInNewTab,
        "page": page->slug.current,
        "post": post->slug.current
      }
    }
  }
}`);
