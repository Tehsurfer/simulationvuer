<template>
  <div id="app">
    <div class="app">
      <h1>SimulationVuer</h1>
      <h2>composite order: {{compositeOrder}}</h2>
      <p>
        This vuer demonstrates the simulation of the <a href="https://models.physiomeproject.org/e/568">Fabbri <em>et al.</em> (2017)</a> model.
      </p>
    </div>
    <hr />
    <SimulationVuer v-if="compositeEntries[0].open" :compositeEntry="compositeEntries[0]" @compositeOutput="compositeOutput"/>
    <SimulationVuer v-if="compositeEntries[1].open" :compositeEntry="compositeEntries[1]" @compositeOutput="compositeOutput"/>
    <composite-model v-if="!compositeEntries[0].open" :entry="compEntry"/>

  </div>
</template>

<script>
import SimulationVuer from "./components/SimulationVuer.vue";
import CompositeModel from "./components/CompositeModel"

export default {
  name: "App",
  components: {
    SimulationVuer,
    CompositeModel
  },
  data: function () {
    return {
      compositeEntries: [{
        id: 0,
        open: true,
        status: 'single'
      },{
        id: 1,
        open: true,
        status: 'single'
      }],
      compositeOrder: [],
      compositeData: [{},{}],
      compEntry: {}
    }
  },
  methods: {
    compositeOutput: function(output){
      for(let i in this.compositeEntries){
        this.compositeEntries[i].status = output.status
      }
      this.compositeOrder.push(output)
      if(output.status === 'linked'){
        setTimeout(()=>{
          this.switchToComposite()
        }, 1000)
      }
    },
    switchToComposite: function(){
      this.compEntry = this.compositeOrder
      for(let i in this.compositeEntries){
        this.compositeEntries[i].open = false
      }
      //...
      
      this.compositeOrder = []
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
div.app {
  text-align: center;
}
</style>
