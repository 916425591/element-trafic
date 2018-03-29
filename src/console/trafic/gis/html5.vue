<template>
    <div>
    <div class="container1">
        <div class="left"></div>
        <div class="left"></div>
        <div class="left"></div>
        <div class="right">
            <div class="title">帅舅舅</div>
            <div class="desc vertical-center">
                <span>JavaScript全栈工程师成长中……</span>
            </div>
        </div>
    </div>
    <div class="container2">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
        <div class="item">5</div>
    </div>
    </div>
</template>

<script>
    export default {
        name: 'html5'
    };
</script>

<style scoped>
    .container1{
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        height: 50px;
    }
    .left{
        flex: 0 1 50px;
        background-color: lightblue;
    }
    .right{
        display: flex;
        display: -webkit-flex;
        flex-direction: column; /*水平上*/
        flex: 1 1 auto;
    }
    .title{
        flex: 0 1 20px;
        background-color: lightcyan;
    }
    .desc{
        flex: 1 1 auto;
        background-color: lightgray;
        font-size: 12px;
        color: #666;
    }
    .vertical-center{/*弹性布局实现垂直居中*/
        display: flex;
        display: -webkit-flex;
        flex-direction:column;
        justify-content:center;
    }

    .container2{
        display: flex;
        display: -webkit-flex;
        flex-direction: row;/*决定主轴的方向*/
        flex-wrap:wrap;
    }
    .item{
        height: 100px;
        flex: 0 1 50%;
        background-color: lightcoral;
        color: white;
        font-size: 20px;
        text-align: center;
        line-height: 100px;
        border: 1px solid white;
        box-sizing: border-box;
    }
</style>
