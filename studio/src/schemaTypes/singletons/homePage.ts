import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Removes create/delete actions
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'This will be used as the browser tab title'
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        /*
        {
          name: 'headline',
          title: 'Headline',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3
        },
        */
        /*
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }
        */
        {
          name: 'images',
          title: 'Hero Images (Slideshow)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Desktop Image',
                  type: 'image',
                  options: { hotspot: true }
                },
                {
                  name: 'mobileImage',
                  title: 'Mobile Image',
                  type: 'image',
                  description: 'Optional smaller / cropped image for mobile screens (under 900px)',
                  options: { hotspot: true }
                }
              ]
            }
          ],
          description: 'Optional set of images to cycle through in the hero (supports a separate mobile image per slide)'
        },
        {
          name: 'logo',
          title: 'Logo (Desktop)',
          type: 'image',
          description: 'Optional logo to show in the hero instead of text',
          options: {
            hotspot: true
          }
        },
        {
          name: 'mobileLogo',
          title: 'Logo (Mobile)',
          type: 'image',
          description: 'Optional separate logo for mobile screens (under 900px)',
          options: {
            hotspot: true
          }
        }
      ]
    },
    /*
    {
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        { type: 'infoSection' },
        { type: 'callToAction' }
      ]
    },
    */
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image'
        }
      ]
    }
  ]
})
