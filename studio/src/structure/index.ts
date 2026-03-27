import {CogIcon, LinkIcon} from '@sanity/icons'
import {HomeIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'homePage', 'navigation', 'assist.instruction.context', 'page', 'post', 'person']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Home Page Singleton
      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
      /*
      // Navigation Singleton
      S.listItem()
        .title('Navigation')
        .child(S.document().schemaType('navigation').documentId('navigation'))
        .icon(LinkIcon),
      */
      // Divider
      S.divider(),
      // All other document types
      ...S.documentTypeListItems()
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
    ])
