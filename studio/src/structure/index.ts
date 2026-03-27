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

// Open the Home Page singleton editor by default instead of the document list.
// This makes the Studio root load the single `homePage` document for quick editing.
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.document().schemaType('homePage').documentId('homePage')
