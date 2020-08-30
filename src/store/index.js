import Vue from 'vue'
import Vuex from 'vuex'
import db from '../database'
// import router from '../router'
// import db from '../database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    swavanRules: [],
    toggleStatus : true
  },
  mutations: {
    setRules(state, payload){
      state.swavanRules.length = 0;
      state.swavanRules.push(...payload)
    },
    setRule(state, payload){
      state.swavanRules = payload
    },
    setResponses(state, payload) {
      state.swavanRules.forEach((row) => {
        if(row.id === payload.rule_id) {
          row.responses = payload.responses
          return
        }
      })
      const rules = state.swavanRules
      state.swavanRules = [...rules]
    },
  },
  actions: {
    async saveRedirectRule(state, payload) {
      const rule_id = await db.rules.add({
        name: payload.name,
        description: payload.description,
        source_type: payload.source_type,
        operator: payload.operator,
        source: payload.source,
        is_enabled: payload.is_enabled
      })
      await db.transaction('rw', db.rules, db.responses, async function(){
        await db.responses.bulkAdd(payload.responses.map(res => ({
          rule_id,
          data_source_type: res.data_source_type,
          data: res.data,
          http_method: res.http_method,
          filters: res.filters,
          is_logic_enabled: res.is_logic_enabled
        })))
      })

    },
    async loadRedirectRule(state, search) {
      const rules = await db.rules
        .filter(rule => search ? rule.name.includes(search): rule)
        .toArray();
      
      rules.map(rule => {
          rule['responses'] = [];
          return rule
        })
      state.commit('setRules', rules) 
    },
    async changeRuleStatus(state, changePayload) {
      await db.rules.update(changePayload.id, { is_enabled: changePayload.is_enabled })
    },
    async loadResponses(state, rule_id) {
      const responses = await db.responses
        .filter((row) => row.rule_id === rule_id)
        .toArray()
      if (responses && responses.length > 0) {
        state.commit("setResponses", { rule_id, responses })
      }
    },
    async updateRules(state, payload) {
      await db.transaction('rw', db.rules, db.responses, async function(){
        await db.rules.put({
          id: payload.id,
          name: payload.name,
          description: payload.description,
          source_type: payload.source_type,
          operator: payload.operator,
          source: payload.source,
          is_enabled: payload.is_enabled
        });

        await db.responses.bulkPut(payload.responses
          .filter(row => !row.mark_for_deletion)
          .filter(row => !!row.id)
          .map(res => ({
            id: res.id,
            rule_id: res.rule_id,
            data_source_type: res.data_source_type,
            data: res.data,
            http_method: res.http_method,
            filters: res.filters,
            logic: res.logic,
            is_logic_enabled: res.is_logic_enabled
          })));

          await db.responses.bulkAdd(payload.responses
            .filter(row => !row.mark_for_deletion)
            .filter(row => row.id == null)
            .map(res => ({
              rule_id: res.rule_id,
              data_source_type: res.data_source_type,
              data: res.data,
              http_method: res.http_method,
              filters: res.filters,
              is_logic_enabled: res.is_logic_enabled
            })));
        await db.responses.bulkDelete(payload.responses.filter((row) => row.mark_for_deletion).map((row) => row.id));
      });
    },
    async deleteRule(state, rule_id) {
      await db.transaction('rw', db.rules, db.responses, async function(){
        await db.rules
        .where("id")
        .equals(rule_id)
        .delete();

        await db.responses
        .where("rule_id")
        .equals(rule_id)
        .delete();
      })
    }
  },
  modules: {
  },
  getters : {
    rules : (state) => {
      return state.swavanRules
    },
    activeRules : (state) => {
      return state.swavanRules.filter(row => row.is_enabled)
    },
    rule : (state) => (rule_id) => {
      return state.swavanRules.find(row => row.id === rule_id)
    },
    isActive: (state) => {
      return state.toggleStatus
    },
  }
})
