import Vue from 'vue'
import Vuex from 'vuex'
import {firebaseMutations, firebaseAction} from 'vuexfire'
import {dataSourcesRef} from '@/firebase.config'
import _ from 'lodash'

Vue.use(Vuex)

const state = {
  dataSources: {}
}


const getters = {
  dataSources: state => state.dataSources,

  dataBase: state => {
    const dsDatabases = _.filter(state.dataSources, (ds) => ds.database)
    const databaseChildren = _.map(dsDatabases, (ds) => ({
          "text": ds.name,
          "icon": "fa fa-database",
          "opened": true,
          "selected": false,
          "disabled": false,
          "loading": false,
          "children": []
        }
      )
    )
    return [{
      "text": "DATA-SOURCES",
      "icon": "fa fa-folder-open",
      "opened": true,
      "selected": false,
      "disabled": false,
      "loading": false,
      "children": databaseChildren
    }]
  },

  dataEnv: () => {
    //env
    const dsEnvs = _.filter(state.dataSources, (ds) => ds.env)
    const envList = _.uniq(_.map(dsEnvs, (ds) => ds.env))
    const envChildren = _.map(envList, (env) => {

        //sgbd
        const dsSgbd = _.filter(state.dataSources, (ds) => ds.sgbd && ds.env == env)
        const sgbdList = _.uniq(_.map(dsSgbd, (ds) => ds.sgbd))
        const sgbdChildren = _.map(sgbdList, (sgbd) => {

            //database
            const dsDatabases = _.filter(dsSgbd, (ds) => ds.database && ds.sgbd == sgbd)
            const databaseList = _.uniq(_.map(dsDatabases, (ds) => ds.database))
            const databaseChildren = _.map(databaseList, (database) => {

                //dataSource
                const dsDataSource = _.filter(dsDatabases, (ds) => ds.name && ds.database == database)
                const dataSourceChildren = _.map(dsDataSource, (ds) => {
                  return {
                    "text": ds.name,
                    "icon": "fa fa-database",
                    "opened": false,
                    "selected": false,
                    "disabled": false,
                    "loading": false,
                    "children": []
                  }
                })

                return {
                  "text": database,
                  "opened": false,
                  "selected": false,
                  "disabled": false,
                  "loading": false,
                  "children": dataSourceChildren
                }
              }
            )

            return {
              "text": sgbd,
              "opened": false,
              "selected": false,
              "disabled": false,
              "loading": false,
              "children": databaseChildren
            }
          }
        )


        return {
          "text": env,
          "opened": true,
          "selected": false,
          "disabled": false,
          "loading": false,
          "children": sgbdChildren
        }
      }
    )

    return [{
      "text": "ENVIRONNEMENTS",
      "icon": "fa fa-folder-open",
      "opened": true,
      "selected": false,
      "disabled": false,
      "loading": false,
      "children": envChildren
    }]
  },
  dataSgbd: () => {
    //sgbd
    const dsSgbd = _.filter(state.dataSources, (ds) => ds.sgbd)
    const sgbdList = _.uniq(_.map(dsSgbd, (ds) => ds.sgbd))
    const sgbdChildren = _.map(sgbdList, (sgbd) => {

        //env
        const dsEnvs = _.filter(state.dataSources, (ds) => ds.env && ds.sgbd == sgbd)
        const envList = _.uniq(_.map(dsEnvs, (ds) => ds.env))
        const envChildren = _.map(envList, (env) => {

            //database
            const dsDatabases = _.filter(dsSgbd, (ds) => ds.database && ds.env == env)
            const databaseList = _.uniq(_.map(dsDatabases, (ds) => ds.database))
            const databaseChildren = _.map(databaseList, (database) => {

                //dataSource
                const dsDataSource = _.filter(dsDatabases, (ds) => ds.name && ds.database == database)
                const dataSourceChildren = _.map(dsDataSource, (ds) => {
                  return {
                    "text": ds.name,
                    "icon": "fa fa-database",
                    "opened": false,
                    "selected": false,
                    "disabled": false,
                    "loading": false,
                    "children": []
                  }
                })

                return {
                  "text": database,
                  "opened": false,
                  "selected": false,
                  "disabled": false,
                  "loading": false,
                  "children": dataSourceChildren
                }
              }
            )

            return {
              "text": env,
              "opened": false,
              "selected": false,
              "disabled": false,
              "loading": false,
              "children": databaseChildren
            }
          }
        )

        return {
          "text": sgbd,
          "opened": true,
          "selected": false,
          "disabled": false,
          "loading": false,
          "children": envChildren
        }
      }
    )

    return [{
      "text": "SGBDS",
      "icon": "fa fa-folder-open",
      "opened": true,
      "selected": false,
      "disabled": false,
      "loading": false,
      "children": sgbdChildren
    }]
  },
}

const mutations = {
  ...firebaseMutations
}

const actions = {
  // nuxtServerInit({dispatch}, context) {
  //   console.log('nuxtServerInit')
  // },
  async nuxtClientInit({dispatch}, context) {
    console.log('nuxtClientInit')
    await this.dispatch('setDataSourcesRef', dataSourcesRef)
  },

  setDataSourcesRef: firebaseAction(({bindFirebaseRef}, {ref}) => bindFirebaseRef('dataSources', ref))
}

const store = () => {
  return new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })
}

export default store


// const execute = (ref, item) => {
//   if (item.text.startsWith('DB2')) {
//     const items=item.text.split(' = ')
//
//     const sgbd = items[0]
//     const name= items[1]
//     const names= name.split('_')
//     const database= names[0]
//     let env=names[1]
//     if (['DEV','TEST','QUALIF','RECETTE','DEV','DIFF','INTEG','EVOL'].includes(env)){
//     }else{
//       env='PROD'
//     }
//
//     ref.child(items[1]).set(
//       {
//         name,
//         sgbd,
//         database,
//         env
//       }
//     ).then(() => console.log('OK!')
//     ).catch(e => console.log(e))
//   }
//   item.children.forEach((child) => execute(ref, child))
//
//
//
//   //
//   // item.children.forEach((child) => {
//   //     if (child.text.startsWith('DB2')) {
//   //       ref.child(child.text).set(
//   //         {
//   //           name: child.text
//   //         }
//   //       ).then(() => {
//   //           console.log('setDataSources OK!')
//   //           //item.children.forEach((child)=>execute(ref.child(item.text),child))
//   //           item.children.forEach((child) => execute(ref, child))
//   //         }
//   //       ).catch(e => console.log(e))
//   //     }
//   //   }
//   // )
// }

// setDataSources() {
//   this.state.data.forEach(item =>
//     execute(dataSourcesRef,item)
//   )
// },

// data: [
//   {
//     "text": "DATA-SOURCES",
//     "icon": "fa fa-folder-open",
//     "opened": true,
//     "selected": false,
//     "disabled": false,
//     "loading": false,
//     "children": [
//       {
//         "text": "APPLI = SIECLE",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": [
//           {
//             "text": "BASE = SCONET",
//             "opened": true,
//             "selected": false,
//             "disabled": false,
//             "loading": false,
//             "children": [
//               {
//                 "text": "ENV = DEV",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_DEV",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_DEV",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = TEST",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_TEST",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_TEST",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = QUALIF",
//                 "selected": false,
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_QUALIF",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_QUALIF",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = RECETTE",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_RECETTE",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_RECETTE",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = EVOLUTION",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_EVOL",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_EVOL",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = INTEGRATION",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_INTEG",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_INTEG",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = DIFFUSION",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "DB2 = SCONET17_DIFF",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   },
//                   {
//                     "text": "DB2 = SCONET18_DIFF",
//                     "icon": "fa fa-database",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": []
//                   }
//                 ]
//               },
//               {
//                 "text": "ENV = PRODUCTION",
//                 "opened": true,
//                 "selected": false,
//                 "disabled": false,
//                 "loading": false,
//                 "children": [
//                   {
//                     "text": "ANNEE = 2017",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": [
//                       {
//                         "text": "DB2 = SCONET17_AIX-MARSEILLE",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET17_AMIEN",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET17_BESANCON",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET17_BORDEAUX",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       }
//                     ]
//                   },
//                   {
//                     "text": "ANNEE = 2018",
//                     "opened": true,
//                     "selected": false,
//                     "disabled": false,
//                     "loading": false,
//                     "children": [
//                       {
//                         "text": "DB2 = SCONET18_AIX-MARSEILLE",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET18_AMIEN",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET18_BESANCON",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       },
//                       {
//                         "text": "DB2 = SCONET18_BORDEAUX",
//                         "icon": "fa fa-database",
//                         "opened": true,
//                         "selected": false,
//                         "disabled": false,
//                         "loading": false,
//                         "children": []
//                       }
//                     ]
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "text": "APPLI = TELESERVICES",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = BE1D",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = AFFELNET",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = SYSCA",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = BEA",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = BCE",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = BCN",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = EPP",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = AGAPE",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       },
//       {
//         "text": "APPLI = AGORA",
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": []
//       }
//     ]
//   }
// ]


// const getDataSourcesByProps = (props) => { //tableau props=[{prop,value},{prop,value}]
//   const dsList=[]
//   for (const key in state.dataSources) {
//     const ds = state.dataSources[key]
//     if(ds[prop] == value){
//       dsList.push(ds)
//     }
//   }
//   return dsList
// }

//const dataSourcesList = Object.keys(state.dataSources).map(key => state.dataSources[key])

// const getDataSourcesByProp = (dataSourcesList,prop, value) => dataSourcesList.filter((ds) => ds[prop] == value)
// //{
// //const dsList = []
// // for (const key in state.dataSources) {
// //   const ds = state.dataSources[key]
// //   if (ds[prop] == value) {
// //     dsList.push(ds)
// //   }
// // }
// //return dsList
// //}
//
// const getDsNodesByProp = (prop, value) => getDataSourcesByProp(prop, value).map((ds) => ({
//   "text": ds.name,
//   "icon": "fa fa-database",
//   "opened": true,
//   "selected": false,
//   "disabled": false,
//   "loading": false,
//   "children": []
// }))
//
// const getEnvNodes = () => {
//   const envList = dataSourcesList.map((ds) => ds.env)
//   return _.uniq(envList).map((env) => ({
//     "text": ds.env,
//     "icon": "fa fa-university",
//     "opened": true,
//     "selected": false,
//     "disabled": false,
//     "loading": false,
//     "children": []
//   }))
// }
//
// const getEnvNodesByProp = (prop, value) => {
//   const dsList = getDataSourcesByProp(prop, value)
//   const envList = dsList.map((ds) => ds.env)
//   return _.uniq(envList).map((env) => ({
//     "text": ds.env,
//     "icon": "fa fa-university",
//     "opened": true,
//     "selected": false,
//     "disabled": false,
//     "loading": false,
//     "children": []
//   }))
// }
// () => rootNode,
//
//     state => {
//   console.log('dataBase')
//   const databases = []
//   for (const key in state.dataSources) {
//     const ds = state.dataSources[key]
//     if (ds.database) {
//
//
//       const databaseChildren = getDsNodesByProp('database', ds.database)
//
//       // const databaseChildren=[]
//       // for (const databaseKey in state.dataSources) {
//       //   const databaseDs = state.dataSources[databaseKey]
//       //   if(databaseDs.database == ds.database){
//       //     databaseChildren.push({
//       //       "text": databaseDs.env + ' : ' + databaseDs.name,
//       //       "icon": "fa fa-database",
//       //       "opened": true,
//       //       "selected": false,
//       //       "disabled": false,
//       //       "loading": false,
//       //       "children": []
//       //     })
//       //   }
//       // }
//
//       if (databases.filter(item => item.text == ds.database).length == 0)
//         databases.push({
//           "text": ds.database,
//           "opened": true,
//           "selected": false,
//           "disabled": false,
//           "loading": false,
//           "children": databaseChildren
//         })
//     }
//   }
//
//   rootNode.children=databases
//   return rootNode
// },

//   state => {
// console.log('dataEnv')
// const envs = []
// for (const key in state.dataSources) {
//   const ds = state.dataSources[key]
//   if (ds.env) {
//
//     const envChildren = getDsNodesByProp('env', ds.env)
//
//     // const envChildren=[]
//     // for (const envKey in state.dataSources) {
//     //   const envDs = state.dataSources[envKey]
//     //   if(envDs.env == ds.env){
//     //     envChildren.push({
//     //       "text": envDs.env + ' : ' + envDs.name,
//     //       "icon": "fa fa-database",
//     //       "opened": true,
//     //       "selected": false,
//     //       "disabled": false,
//     //       "loading": false,
//     //       "children": []
//     //     })
//     //   }
//     // }
//
//     if (envs.filter(item => item.text == ds.env).length == 0) {
//       envs.push({
//         "text": ds.env,
//         "opened": true,
//         "selected": false,
//         "disabled": false,
//         "loading": false,
//         "children": envChildren
//       })
//     }
//   }
// }
// return [
//   {
//     "text": "DATA-SOURCES",
//     "icon": "fa fa-folder-open",
//     "opened": true,
//     "selected": false,
//     "disabled": false,
//     "loading": false,
//     "children": envs
//   }
// ]
// },
//
//     state => {
//   console.log('dataSgbd')
//   const sgbds = []
//   for (const key in state.dataSources) {
//     const ds = state.dataSources[key]
//     if (ds.sgbd) {
//
//       const sgbdChildren = getDsNodesByProp('sgbd', ds.sgbd)
//
//       // const sgbdChildren=[]
//       // for (const sgbdKey in state.dataSources) {
//       //   const sgbdDs = state.dataSources[sgbdKey]
//       //   if(sgbdDs.sgbd == ds.sgbd){
//       //     sgbdChildren.push({
//       //       "text": sgbdDs.env + ' : ' + sgbdDs.name,
//       //       "icon": "fa fa-database",
//       //       "opened": true,
//       //       "selected": false,
//       //       "disabled": false,
//       //       "loading": false,
//       //       "children": []
//       //     })
//       //   }
//       // }
//
//       if (sgbds.filter(item => item.text == ds.sgbd).length == 0)
//         sgbds.push({
//           "text": ds.sgbd,
//           "opened": true,
//           "selected": false,
//           "disabled": false,
//           "loading": false,
//           "children": sgbdChildren
//         })
//     }
//   }
//   return [
//     {
//       "text": "DATA-SOURCES",
//       "icon": "fa fa-folder-open",
//       "opened": true,
//       "selected": false,
//       "disabled": false,
//       "loading": false,
//       "children": sgbds
//     }
//   ]
// }
