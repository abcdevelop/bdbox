<template>
  <div id="app">
    <!--<h1>{{ msg }}</h1>-->

    <v-layout row>
      <v-flex xs4>
        <v-container>
          <v-card>
            <v-container>
              <v-text-field
                name="input-1"
                placeholder="Rechercher"
                id="testing"
                @keyup="inputKeyUp" v-model="searchText">
              </v-text-field>
            </v-container>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <v-layout row>

      <v-flex xs4>
        <v-container>
          <v-card>
            <v-btn @click="openChildren" title="Ouvrir le noeud">
              <v-icon>fas fa-search-plus</v-icon>
            </v-btn>
            <v-btn @click="closeChildren" title="Fermer le noeud">
              <v-icon>fas fa-search-minus</v-icon>
            </v-btn>
            <v-btn-toggle v-model="selection">
              <v-btn color="info" value="dataBase" @click="dataTree=dataBase">DATA-SOURCES</v-btn>
              <v-btn color="info" value="dataSgbd" @click="dataTree=dataSgbd">SGBDS</v-btn>
              <v-btn color="info" value="dataEnv" @click="dataTree=dataEnv">ENVIRONNEMENTS</v-btn>
            </v-btn-toggle>
          </v-card>
        </v-container>
      </v-flex>

      <v-flex xs8>
        <v-container>
          <v-card>
            <v-btn @click="addBeforeNode" title="Ajouter un noeud avant">
              <v-icon>fas fa-plus-square</v-icon>
            </v-btn>
            <v-btn @click="addAfterNode" title="Ajouter un noeud après">
              <v-icon>fas fa-plus-circle</v-icon>
            </v-btn>
            <v-btn @click="addChildNode" title="Ajouter un noeud">
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
            <v-btn @click="removeNode" title="Supprimer le noeud">
              <v-icon>fas fa-minus</v-icon>
            </v-btn>
          </v-card>
        </v-container>
      </v-flex>

    </v-layout>


    <v-layout row>
      <v-flex xs4>
        <v-container>
          <v-card>
            <!--show-checkbox-->
            <!--draggable-->
            <!--multiple-->
            <!--allow-batch-->
            <!--whole-row-->
            <v-jstree :data="dataTree"
                      text-field-name="text"
                      @item-click="itemClick"
                      @item-toggle="itemToggle"
                      ref="tree"
            ></v-jstree>
          </v-card>
        </v-container>
      </v-flex>

      <v-flex xs8>
        <v-container>
          <v-card>
            <v-container>
              <h2>Edit Tree Item</h2>
              <p>click the node for edit</p>
              <v-text-field
                label="text"
                v-model="editingItem.text"
              ></v-text-field>
              <v-text-field
                label="value"
                v-model="editingItem.value"
              ></v-text-field>
              <v-text-field
                label="icon"
                v-model="editingItem.icon"
              ></v-text-field>
              <v-checkbox
                label="opened"
                v-model="editingItem.opened"
              ></v-checkbox>
              <v-checkbox
                label="selected"
                v-model="editingItem.selected"
              ></v-checkbox>
              <v-checkbox
                label="disabled"
                v-model="editingItem.disabled"
              ></v-checkbox>
            </v-container>
          </v-card>
        </v-container>
      </v-flex>

    </v-layout>

    <v-container>
      <v-card>
        <h2>Data Tree</h2>
        <div style="width:33%; display:inline-block;">
          <textarea style="height:600px; width:100%;">
            {{dataTree}}
          </textarea>
        </div>
      </v-card>
    </v-container>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        msg: 'DataSources TreeView',
        searchText: '',
        editingItem: {},
        editingNode: null,
        selection: 'dataBase',
        dataTree: this.dataBase
      }
    },
    mounted() {
      setTimeout(() => this.dataTree = this.dataBase, 1000)
    },
    computed: {
      ...
        mapGetters([
          'dataSources',
          'dataBase',
          'dataEnv',
          'dataSgbd'
        ]),
    },

    methods: {
      ...mapActions({
          setDataSources: 'setDataSources'
      })
      ,
      itemClick(node) {
        this.editingNode = node
        this.editingItem = node.model
        //console.log(node.model, ' clicked !')
      }
      ,
      itemToggle(node) {
        //console.log(node.model, ' toggled !')
        //node.model.icon = node.model.opened ? "fa fa-folder-open" : "fa fa-folder"
        //const icon=node.model.opened ? "fa fa-folder-open" : "fa fa-folder"
        //node.model.icon = icon
        // this.editingNode = node
        // this.editingItem = node.model
        // const icon = this.editingItem.opened ? "fa fa-folder-open" : "fa fa-folder"
        // this.editingItem.icon = icon
      }
      ,
      inputKeyUp: function () {
        var text = this.searchText
        const patt = new RegExp(text);
        this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function (node) {
          if (text !== '') {
            const str = node.model.text
            if (patt.test(str)) {
              node.$el.querySelector('.tree-anchor').style.color = 'red'
            } else {
              node.$el.querySelector('.tree-anchor').style.color = '#000'
            } // or other operations
          } else {
            node.$el.querySelector('.tree-anchor').style.color = '#000'
          }
        })
      }
      ,
      addChildNode: function () {
        if (this.editingItem.id !== undefined) {
          this.editingItem.addChild({
            text: "newNode",
            value: "newNode"
          })
        }
      }
      ,
      removeNode: function () {
        if (this.editingItem.id !== undefined) {
          var index = this.editingNode.parentItem.indexOf(this.editingItem)
          this.editingNode.parentItem.splice(index, 1)
        }
      }
      ,
      addBeforeNode: function () {
        if (this.editingItem.id !== undefined) {
          this.editingItem.addBefore({
            text: "newNode",
            value: "newNode"
          }, this.editingNode)
        }
      }
      ,
      addAfterNode: function () {
        if (this.editingItem.id !== undefined) {
          this.editingItem.addAfter({
            text: "newNode",
            value: "newNode"
          }, this.editingNode)
        }
      }
      ,
      openChildren: function () {
        if (this.editingItem.id !== undefined) {
          this.editingItem.openChildren()
        }
      }
      ,
      closeChildren: function () {
        if (this.editingItem.id !== undefined) {
          this.editingItem.closeChildren()
        }
      }
    }
  }
</script>

<style scoped>
  /*#app {*/
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  /*}*/

  /*h1, h2 {*/
  /*font-weight: normal;*/
  /*}*/

  /*ul {*/
  /*list-style-type: none;*/
  /*padding: 0;*/
  /*}*/

  /*li {*/
  /*display: inline-block;*/
  /*margin: 0 10px;*/
  /*}*/

  /*a {*/
  /*color: #42b983;*/
  /*}*/

  /*div {*/
  /*display: block;*/
  /*}*/

  /*table {*/
  /*width: 100%;*/
  /*border-collapse: collapse;*/
  /*border: 1px solid #EEE;*/
  /*font-size: 14px;*/
  /*}*/

  /*table th {*/
  /*background: #EEE;*/
  /*border-bottom: 1px solid #CCC;*/
  /*padding: 4px;*/
  /*}*/

  /*table td {*/
  /*border: 1px solid #EEE;*/
  /*padding: 4px;*/
  /*}*/
</style>
