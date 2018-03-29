import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import app from './modules/app'
import user from './modules/user'
import userCode from './userCode'

/** tree弹窗组件*/
import treeModal from './treeModal'
/** 流程图组件 */
import processArrow from './processArrow'
/**预案内容信息 */
import planContent from './planContent'
/**类型类型信息 */
import types from './types'
/**select 节点弹框 */
import selectFlow from './selectFlow'
/**弹框 */
import dialogs from './dialogs'
/**table查询弹框 */
import tableSearch from './tableSearchModal'
/** scd协同指挥 */
import scd from '@/console/scd/centerWork/store/centerWork'
/** eduty应急值守 */
import eduty from '@/console/eduty/store/eduty'
/** startPlan弹窗组件*/
import startPlan from './startPlan'
/*websocket message*/
import websocket from  './websocket'

// import chemical from '../console/knowledge/chemical/store/chemical'
import laws from '../console/knowledge/laws/store/laws'
import emergency from '../console/knowledge/emergencyKnowledge/store/emergency'
import classify from '../console/knowledge/classify/store/classify'
import risk from '../console/risk/risks/store/risk'
import riskProtect from '../console/risk/protect/store/riskProtect'
import hiddenDanger from '../console/risk/hiddenDanger/store/hiddenDanger'
import chemical from '../console/knowledge/chemical/store/chemical'

// 资源
/** 应急避险场所*/
import refuge from './refuge'
/** 资源类型*/
import resourceType from './resourceType'
/**应急物资 */
import material from './material'
/**专家 */
import expert from './expert'
/**车辆 */
import vehicle from './vehicle'
/**装备 */
import equipment from './equipment'
/**队伍 */
import team from './team'
/**设置高度 */
import heightTable from './height'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    userCode,
    app,
    user,
    treeModal,
    dialogs,
    laws,
    classify,
    risk,
    tableSearch,
    processArrow,
    planContent,
    types,
    selectFlow,
    emergency,
    team,
    equipment,
    vehicle,
    expert,
    material,
    resourceType,
    refuge,
    scd,
    chemical,
    riskProtect,
    hiddenDanger,
    eduty,
    startPlan,
    heightTable,
    websocket
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

