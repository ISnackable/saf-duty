import type {StructureBuilder} from 'sanity/desk'
import {UsersIcon, CalendarIcon, ThListIcon, FilterIcon, ClockIcon, CogIcon} from '@sanity/icons'
import {ConfigContext} from 'sanity'

interface CalendarQuery {
  _id: string
  _type: string
  date: Date
}

interface Years {
  [key: string]: string[]
}

export const myStructure = (S: StructureBuilder, context: ConfigContext) => {
  const {getClient} = context
  const client = getClient({apiVersion: '2022-11-17'})

  const calendarStructure = S.listItem()
    .title('Calendar')
    .icon(CalendarIcon)
    .child(
      S.list()
        .title('Calendar')
        .items([
          S.listItem()
            .title('All Calendar')
            .icon(ThListIcon)
            .child(
              S.documentTypeList('calendar')
                .title('All Calendar')
                .child((documentId) => S.document().documentId(documentId).schemaType('calendar'))
            ),
          S.listItem()
            .title('Calendar by year')
            .icon(FilterIcon)
            .child(() => {
              const typeDef = 'calendar'
              return client
                .fetch('*[_type == $type && defined(date)]{_id, _type, date}', {
                  type: typeDef,
                })
                .then((docs: CalendarQuery[]) => {
                  // Create a map of years
                  const years: Years = {}
                  docs.forEach((d) => {
                    const date = new Date(d.date)
                    const year = date.getFullYear()
                    if (!years[year]) {
                      years[year] = []
                    }
                    years[year].push(d._id)
                  })

                  return S.list()
                    .title('Calendar by year')
                    .id('year')
                    .items(
                      Object.keys(years).map((year) => {
                        return S.listItem()
                          .id(year)
                          .title(year)
                          .icon(ClockIcon)
                          .child(
                            S.documentList()
                              .id(typeDef)
                              .title(`Calendar from ${year}`)
                              .filter(`_id in $ids`)
                              .params({ids: years[year]})
                          )
                      })
                    )
                })
            }),
        ])
    )

  const userStructure = S.listItem()
    .title('User')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('User')
        .items([
          S.listItem()
            .title('All Users')
            .icon(UsersIcon)
            .child(
              S.documentTypeList('user')
                .title('All Users')
                .child((documentId) => S.document().documentId(documentId).schemaType('user'))
            ),
          S.listItem()
            .title('User by unit')
            .icon(FilterIcon)
            .child(
              S.documentTypeList('unit')
                .title('Users by unit')
                .child((unitId) =>
                  S.documentList()
                    .title('User')
                    .filter('_type == "user" && $unitId == unit._ref')
                    .params({unitId})
                )
            ),
        ])
    )

  const siteSettingsStructure = S.listItem()
    .title('Site Settings')
    .icon(CogIcon)
    .child(S.document().schemaType('siteSettings').documentId('siteSettings'))

  // The default root list items (except custom ones)
  const defaultListItems = S.documentTypeListItems().filter(
    (listItem) =>
      !['calendar', 'user', 'siteSettings', 'verification-token', 'account'].includes(
        listItem.getId()!
      )
  )

  return S.list()
    .title('Base')
    .items([
      calendarStructure,
      userStructure,
      ...defaultListItems,
      S.divider(),
      siteSettingsStructure,
    ])
}
