<template>
    <div class="ds-planType">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>预案列表</h2>
            </div>
            <div class="ds-search-left">
                <Input icon="ios-search" @on-click="" @on-enter="" style="width: 210px"></Input>
                <Button type="ghost" size="small" @click="" style="background: #fff;"><Icon type="android-add" size="20"></Icon></Button>
            </div>
            <div class="ds-tree-left ds-resources-listBox">
                <Tree :data="planTypeTree" @on-select-change="" ref="tree"></Tree>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return  {
                planTypeTree: [
                    {
                        id: 1,
                        parent: true,
                        title: '紧急预案',
                        expand: true,
                        children: [
                            {
                                id: 10,
                                title: '紧急预案1'
                            },
                            {
                                id: 11,
                                title: '紧急预案2'
                            }
                        ]
                    },
                    {
                        id: 2,
                        parent: true,
                        title: '一般预案',
                        expand: true,
                        children: [
                            {
                                id: 20,
                                title: '一般预案1'
                            },
                            {
                                id: 21,
                                title: '一般预案2'
                            }
                        ]
                    },
                ]
            }
        }
    }
</script>

<style>

</style>
