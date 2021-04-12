<template>
  <div class="simulation-vuer">
    <el-container class="main">
      <el-aside v-for="(model, index) in entry" width="212px" :key="index">
        <div :key="index">
          <p class="header input-parameters">Model {{model.id+1}}</p>
          <p class="header input-parameters">{{model.info.title}}</p>
          <div class="params">
            <div class="params-left">
              Input Parameters
              <div v-for="(input, i) in model.info.inputs" :key="i">
                <span class="input-grid">
                  <div class="rad-label">{{input}}</div>
                  <staged-radio :stage="radios[index].inputy[i]" :color="i" :label="input" @click.native="radioInClick(index, 'inputy', i)" :key="i"/>
                </span>
              </div>
            </div>
            <div class="params-right">
              Output Parameters
              <div v-for="(output, i) in model.info.outputs" :key="'out'+i">
                <span class="input-grid">
                  <div class="rad-label">{{output}}</div>
                  <staged-radio :stage="radios[index].outputy[i]" :color="i" @click.native="radioInClick(index, 'outputy', i)"/>
                </span>
              </div>
            </div>
          </div>
  
          
          <staged-radio v-if="index === 0"  class="sim-radio" :stage="uiStage" :color="uiRadioColor" @click.native="uiRadio"/>
          
          <div v-if="index === 0" class="sim-controls" v-bind:class="{ 'disabled': uiStage < 3 }">
            <p class="header simulation-mode">
              Simulation mode
            </p>
            <el-select class="mode" popper-class="mode-popper" :popper-append-to-body="false" v-model="mode" size="mini" @change="modeChanged()">
              <el-option v-for="mode in modes" :key="mode.value" :label="mode.label" :value="mode.value" />
            </el-select>
            <p class="header simulation-level">Stimulation level</p>
            <div class="slider">
              <el-slider v-model="level" :max="10" :show-tooltip="false" :show-input="false" :disabled="mode == 0" />
              <el-input-number v-model="level" size="mini" :controls="false" :min="0" :max="10" :disabled="mode == 0" />
            </div>
            
          </div>
          <div v-if="index === 0"  class="run-simulation" ref="run">
              <el-button type="primary" size="mini" @click="runSimulation()">Run simulation</el-button>
            </div>  
            <div v-if="index === 0"  class="run-on-osparc">
              <el-button size="mini" @click="goToOsparc()">Run on oSPARC</el-button>
            </div>
         </div>
      </el-aside>
      <el-container class="plot-vuer" ref="plot">
          <Running :active.sync="runningActive" :is-full-page="runningFullPage" :color="runningColor" />
          <PlotVuer class="plot-vuer" :dataInput="data" plotType="plotly-only" />
          
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Vue from "vue";
import StagedRadio from "./StagedRadio.vue"
import Running from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { PlotVuer } from "@abi-software/plotvuer";
import "@abi-software/plotvuer/dist/plotvuer.css";
import { Aside, Button, Container, InputNumber, Main, Option, Select, Slider, Row, Col, Radio} from "element-ui";
import SinusData from "@/../data/sinus.json";
import Stellate_00_Data from "@/../data/stellate_00.json";
import Stellate_01_Data from "@/../data/stellate_01.json";
import Stellate_02_Data from "@/../data/stellate_02.json";
import Stellate_03_Data from "@/../data/stellate_03.json";
import Stellate_04_Data from "@/../data/stellate_04.json";
import Stellate_05_Data from "@/../data/stellate_05.json";
import Stellate_06_Data from "@/../data/stellate_06.json";
import Stellate_07_Data from "@/../data/stellate_07.json";
import Stellate_08_Data from "@/../data/stellate_08.json";
import Stellate_09_Data from "@/../data/stellate_09.json";
import Stellate_10_Data from "@/../data/stellate_10.json";
import Vagal_00_Data from "@/../data/vagal_00.json";
import Vagal_01_Data from "@/../data/vagal_01.json";
import Vagal_02_Data from "@/../data/vagal_02.json";
import Vagal_03_Data from "@/../data/vagal_03.json";
import Vagal_04_Data from "@/../data/vagal_04.json";
import Vagal_05_Data from "@/../data/vagal_05.json";
import Vagal_06_Data from "@/../data/vagal_06.json";
import Vagal_07_Data from "@/../data/vagal_07.json";
import Vagal_08_Data from "@/../data/vagal_08.json";
import Vagal_09_Data from "@/../data/vagal_09.json";
import Vagal_10_Data from "@/../data/vagal_10.json";

var StellateData = [Stellate_00_Data, Stellate_01_Data, Stellate_02_Data, Stellate_03_Data, Stellate_04_Data, Stellate_05_Data, Stellate_06_Data, Stellate_07_Data, Stellate_08_Data, Stellate_09_Data, Stellate_10_Data];
var VagalData = [Vagal_00_Data, Vagal_01_Data, Vagal_02_Data, Vagal_03_Data, Vagal_04_Data, Vagal_05_Data, Vagal_06_Data, Vagal_07_Data, Vagal_08_Data, Vagal_09_Data, Vagal_10_Data];
var NoData = [{}];

Vue.use(Aside);
Vue.use(Button);
Vue.use(Container);
Vue.use(InputNumber);
Vue.use(Main);
Vue.use(Option);
Vue.use(Select);
Vue.use(Slider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Radio)

var flipType = function(type){
  if (type === 'outputy'){
    return 'inputy'
  } else {
    return 'outputy'
  }
}

export default {
  name: "SimulationVuer",
  components: {
    PlotVuer,
    Running,
    StagedRadio
  },
  props:{
    entry: {
      type: Array,
      default:()=>[]
    }
  },
  data: function () {
    return {
      level: 0,
      runningActive: false,
      runningColor: "#8300bf",
      runningFullPage: false,
      runningTimeout: 789,
      radio: 0,
      radios: [{inputy: [0,0,0], outputy: [0,0,0]},{inputy: [0,0,0], outputy: [0,0,0]}],
      uiStage: 0,
      uiRadioColor: 0,
      lastIndex: 0,
      statusTrack: ['single', 'linking', 'linked'],
      modelButtonTextTrack: ["Composite Model", "Ready to link...", "linked!"],
      mode: 0,
      modes: [
        {
          label: "Normal sinus rhythm",
          value: 0,
        },
        {
          label: "Stellate stimulation",
          value: 1,
        },
        {
          label: "Vagal stimulation",
          value: 2,
        },
      ],
      data: NoData,
    };
  },
  methods: {
    goToOsparc() {
      window.open("https://osparc.io/", "_blank");
    },
    modeChanged() {
      this.data = NoData;
    },
    radioInClick(index, type, i){
     
      let len = this.radios.length

      // parameter set for linking
      if (this.radios[index][type][i] === 0){
        Vue.set(this.radios[index][type], i, 1)
        Vue.set(this.radios[(index+1)%len][flipType(type)], i, 2)
        if(type === 'inputy'){
          this.uiStage = 2
          this.uiRadioColor = i
          this.lastIndex = index
        }
      } 

      // link cancelled
      else if (this.radios[index][type][i] === 1){
        Vue.set(this.radios[index][type], i, 0)
        Vue.set(this.radios[(index+1)%len][flipType(type)], i, 0)
        this.uiStage = 0
        this.uiRadioColor = i
      } 

      // paramter linked
      else if (this.radios[index][type][i] === 2){
        Vue.set(this.radios[index][type], i, 3)
        Vue.set(this.radios[(index+1)%len][flipType(type)], i, 3)
      } 

      // paramter removed
      else if (this.radios[index][type][i] === 3){
        Vue.set(this.radios[index][type], i, 0)
        Vue.set(this.radios[(index+1)%len][flipType(type)], i, 0)
        this.uiStage = 0
      }
     
    },
    uiRadio: function(){
      
      let li = this.lastIndex

      // If being linked
      if(this.uiStage === 2){
        this.uiStage = 3
        
        Vue.set(this.radios[li]['inputy'], this.uiRadioColor, 3)
      }

      // if resetting
      else if(this.uiStage === 3){
        this.uiStage = 0
        Vue.set(this.radios[li]['inputy'], this.uiRadioColor, 0)
      }
      this.resetRadio()
    },
    resetRadio: function(){
      for(let i in this.radios){
        for( let j in this.radios[i]){
          for (let k in this.radios[i][j]){
            if (this.radios[i][j][k] === 2){
              Vue.set(this.radios[i][j], k, 0)
            }
          }
        }
      }
    },
    compositeModelButton(){
      // go to next status in track
      let newIndex = (this.statusTrack.indexOf(this.compositeEntry.status)+1)%this.statusTrack.length
      let output = {...this.compositeEntry}
      output.status = this.statusTrack[newIndex]
      this.$emit('compositeOutput', output)
    },
    runSimulation() {
      this.runningActive = true;

      setTimeout(() => {
        this.runningActive = false;

        switch (this.mode) {
          case 1: // Stellate stimulation.
            this.data = StellateData[this.level];

            break;
          case 2: // Vagal stimulation.
            this.data = VagalData[this.level];

            break;
          default:
            // Normal sinus rhythm.
            this.data = SinusData;
        }
      }, this.runningTimeout);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css");

.params {
  padding-top: 18px;
  position: relative;
  display: flex;
}

.params-left{
  flex: 1
}

.params-right {
  flex: 1.3;
  padding-left: 6px;
}

.input-grid{
  display: grid;
  grid-template-columns: 1fr 10fr;
grid-gap: 6px;
}

.sim-controls{
  border: 1px solid #DCDFE6;
  cursor: auto;
  opacity: 1;
}

.disabled{
  opacity: 0.5;
  cursor:not-allowed;
}

>>> .el-aside {
  padding: 12px 20px 12px 12px;
}
>>> .el-button:hover {
  box-shadow: -3px 2px 4px #00000040;
}
>>> .el-container.main {
  height: 100%;
}
>>> .el-container.plot-vuer {
  border: solid #dcdfe6;
  border-width: 0 0 0 1px;
}
>>> .el-input-number {
  top: -12px;
  padding-left: 132px;
}
>>> .el-input-number .el-input {
  width: 48px;
}
>>> .el-input-number .el-input__inner:focus {
  border-color: #8300bf;
}
>>> .el-main {
  margin: -16px 0 8px 0px;
}
>>> .el-slider {
  position: absolute;
  width: 108px;
  top: -16px;
  left: 8px;
  margin-bottom: 32px;
}
>>> .el-slider__bar {
  background-color: #8300bf;
}
>>> .el-slider__button {
  border-color: #8300bf;
}
.mode {
  margin-left: 8px;
}
.mode >>> .el-input__inner {
  font-family: Asap, sans-serif;
}
.mode >>> .el-input__inner:focus,
.mode >>> .el-input.is-focus .el-input__inner {
  border-color: #8300bf;
}
.mode-popper .el-select-dropdown__item {
  font-family: Asap, sans-serif;
}
.mode-popper .el-select-dropdown__item.selected {
  font-weight: normal;
  color: #8300bf;
}
div.plot-vuer {
  width: 100%;
}
div.run-simulation,
div.run-on-osparc {
  display: flex;
  justify-content: flex-end;
}
div.run-simulation {
  margin-top: 48px;
}
div.run-on-osparc {
  margin-top: 8px;
}
div.run-simulation .el-button,
div.run-on-osparc .el-button,
div.run-simulation .el-button:hover,
div.run-on-osparc .el-button:hover {
  width: 121px;
  border-color: #8300bf;
}
div.run-simulation .el-button,
div.run-simulation .el-button:hover {
  background-color: #8300bf;
}
div.run-on-osparc .el-button,
div.run-on-osparc .el-button:hover {
  background-color: #f9f2fc;
  color: #8300bf;
}
div.simulation-vuer {
  height: 100%;
}
div.slider {
  position: absolute;
  margin-top: 4px;
}
p.header {
  font-family: Asap, sans-serif;
  letter-spacing: 0;
  margin: 16px 0;
  text-align: start;
}
p.input-parameters {
  margin-top: 0;
  font-weight: 500 /* Medium */;
}
p.simulation-mode {
  margin-bottom: 4px;
}
p.simulation-level {
  margin-bottom: 8px;
}
</style>
<style scoped src="../styles/purple/aside.css">
</style>
<style scoped src="../styles/purple/button.css">
</style>
<style scoped src="../styles/purple/container.css">
</style>
<style scoped src="../styles/purple/input-number.css">
</style>
<style scoped src="../styles/purple/option.css">
</style>
<style scoped src="../styles/purple/select.css">
</style>
<style scoped src="../styles/purple/slider.css">
</style>
