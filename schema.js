const fetch = require('node-fetch');
const util = require('util')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require('graphql')

const partier = {
  'S': { ledamoter: [] },
  'M': { ledamoter: [] },
  'SD': { ledamoter: [] },
  'MP': { ledamoter: [] },
  'C': { ledamoter: [] },
  'V': { ledamoter: [] },
  'L': { ledamoter: [] },
  'KD': { ledamoter: [] }
}
const url = `http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&org=&utformat=json`

const filterLedamoter = (ledamoter, nrOfLedamoter) => {
  for (let parti in partier) {
    partier[parti].ledamoter.push(ledamoter.filter(ledamot => {
      if (ledamot.parti === parti) {
        return ledamot
      }
    }))
  }
  return partier
}

const LedamotType = new GraphQLObjectType({
  name: 'Ledamot',
  fields: () => ({
    sourceid: { type: GraphQLString },
    efternamn: { type: GraphQLString },
    tilltalsnamn: { type: GraphQLString },
    bild_url_max: { type: GraphQLString },
    parti: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    ledamot: {
      type: LedamotType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(_, args) {
        //TODO: Get from unike id
      }
    },
    ledamoter: {
      type: new GraphQLList(LedamotType),
      resolve: (_, args) => {
        return fetch(url).then(u => u.json()).then(result => filterLedamoter(result.personlista.person))

      }
    }
  })
})
module.exports = new GraphQLSchema({
  query: RootQuery
})
