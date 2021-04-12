<template>
  <div class="content-container">
    <div v-show="stage === 0" class="color radio-stage-1"/>
    <div v-show="stage === 1" class="color radio-stage-2" :style="{ 'background-color': pallet[color] + '6e'}" />
    <div v-show="stage === 2" class="color blinking radio-stage-2" :style="{ 'background-color': pallet[color] + '6e'}" />
    <div v-show="stage === 3" class="color radio-stage-3" :style="{ 'border': '5px solid ' + pallet[color]}"/>
  </div>
</template>

<script>
/* eslint-disable no-alert, no-console */
import Vue from "vue";
import { Link, Icon, Card, Button, Select } from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

locale.use(lang);
Vue.use(Link);
Vue.use(Icon);
Vue.use(Card);
Vue.use(Button);
Vue.use(Select);


export default {
  name: "StagedRadio",
  props: {
    /**
     * Object containing information for
     * the required viewing.
     */
    stage: {
      type: Number,
      default: 0
    },
    color: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return  {
      pallet:['#E10096', '#FF2F6B', '#FF804A', '#FFC046', '#F9F871', '#00BEA9', '#0059F5']
    }
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.radio-stage-1{
  border: 1px solid #DCDFE6;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  background-color: #FFF;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.radio-stage-2{
  border: 1px solid #DCDFE6;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  /* background-color: #3c62bb6e; */
  cursor: pointer;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.radio-stage-3{
  border: 5px solid #3c62bb;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  background-color: #FFF;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.blinking {
   
animation: opacity 1s ease-in-out infinite;
    opacity: 1;
}

@keyframes opacity {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>