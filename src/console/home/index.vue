<template>
  <div id="charts-div">
  {{message}}
  </div>
</template>

<script>
 import Cookies from 'js-cookie';
  export default {
    name: 'dataSourcePie',
    data () {
      return {
       message: '欢迎来到我的地图'
      };
    },
    methods: {
    },
    mounted () {

    }
 }
 </script>

 <style>
    .chart-border {
        border: 1px solid #e5e5e5;
    }

    .chart-border:hover {
        border: 1px solid #2d90e6;
        box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, .1);
    }
 </style>
