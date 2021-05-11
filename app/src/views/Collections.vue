<template>
    <div>
<table class="table">
  <thead class="thead-light">
    <tr>
      <th style="width:10%; text-align:center" scope="col">#</th>
      <th style="width:70%; text-align:center" scope="col">Nome</th>
      <th style="width:20%; text-align:center" scope="col">Operações</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(col, idx) in getCollections" :key="idx" >
      <th style="width:10%; text-align:center" scope="row">{{idx + 1}}</th>
      <td style="width:70%; text-align:center" >{{col}}</td>
      <td style="width:20%; text-align:center" >
          <button class="btn btn-sm btn-danger" @click="deleteCol(idx)"><font-awesome-icon icon="trash"/> Eliminar</button>
      </td>
    </tr>
  </tbody>
</table>
    </div>
</template>

<script>

import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
    name: 'Collections',
    components: {

    },
    data() {
        return {
            collections: []
        }
    },
    methods: {
        deleteCol(id){
            axios.delete('http://localhost:3000/collection/' + this.collections[id])
                .then(dados => {
                    this.collections.splice(id,1)
                })
                .catch(e => console.log(e))
        }
    },
    computed: {
        getCollections(){
            return this.collections
        }
    },
    mounted() {
        axios.get('http://localhost:3000/collections')
            .then(dados => {
                this.collections = dados.data.ColNames
            })
            .catch(e => console.log(e))
    }
}
</script>

<style scoped>

</style>