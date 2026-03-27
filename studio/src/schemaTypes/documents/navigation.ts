import {LinkIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Navigation singleton. Allows editors to manage the site's primary navigation
 * from the Sanity Studio. Each item re-uses the existing `link` object for
 * consistent link handling (url, page, post, openInNewTab).
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Menu',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional internal title for this navigation entity.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Ordered list of navigation items as they will appear in the menu.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navigationItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              description: 'Where this navigation item points to (URL / Page / Post).',
            }),
            defineField({
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              initialValue: true,
              description: 'Uncheck to hide this item from the live menu without deleting it.',
            }),
            defineField({
              name: 'submenu',
              title: 'Submenu',
              type: 'array',
              description: 'Optional dropdown items under this navigation item.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'submenuItem',
                  title: 'Submenu Item',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'link',
                    }),
                    defineField({
                      name: 'visible',
                      title: 'Visible',
                      type: 'boolean',
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: {label: 'label', href: 'link.href'},
                    prepare({label, href}: any) {
                      return {title: label, subtitle: href || ''}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              label: 'label',
              linkType: 'link.linkType',
              href: 'link.href',
              pageTitle: 'link.page.title',
              postTitle: 'link.post.title',
            },
            prepare(selection: any) {
              const {label, linkType, href, pageTitle, postTitle} = selection
              let subtitle = 'No link'
              if (linkType === 'href' && href) subtitle = href
              else if (linkType === 'page' && pageTitle) subtitle = `Page: ${pageTitle}`
              else if (linkType === 'post' && postTitle) subtitle = `Post: ${postTitle}`
              else if (linkType) subtitle = linkType
              return {title: label, subtitle, media: LinkIcon}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare(selection: any) {
      const {title, items} = selection
      const count = Array.isArray(items) ? items.length : 0
      return {title: title || 'Navigation', subtitle: `${count} items`}
    },
  },
})
