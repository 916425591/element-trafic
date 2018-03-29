<template>
    <div>
        <Row>
            <i-col span="5">
                <incident-list @select-row="queryIncidentInfo" ref="incidentList"></incident-list>
            </i-col>
            <i-col span="19">
                <incident-info ref="incidentInfo" @start-sucess="planSart" @end-success="endPlan" @add-incident="addIncident"></incident-info>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import incidentList from './incidentList'
    import incidentInfo from './incidentInfo'

    export default {
        components: {
            incidentList,
            incidentInfo
        },
        name: 'centerWork_index',
        data () {
            return {
            }
        },
        methods: {
            queryIncidentInfo (data) {
                this.$refs.incidentInfo.queryIncident(data);
                this.$refs.incidentInfo.queryMemberOrg(data);
            },
            planSart () {
                this.$refs.incidentList.startPlanSucess();
            },
            endPlan () {
                this.$refs.incidentList.queryIncidentList();
            },
            addIncident () {
                this.$refs.incidentList.queryIncidentList();
            }
        }
    }
</script>

<style scoped>

</style>


