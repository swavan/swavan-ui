import Vue from 'vue';
import Vuex from 'vuex';
import db from '../database';
import api from '../Api';

import { Browser } from '../utils';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    swavanRules: [],
    browserName: String,
    urls: [],
    settings: {},
    appData: {},
    requestTypes: {},
  },
  mutations: {
    setTypes(state, payload) {
      state.requestTypes = payload
    },
    setAppInfo(state, payload) {
      state.appData = payload
    },
    setHostUrl(state, payload) {
      state.urls = payload
    },
    setSettings(state, payload) {
      state.settings = { ...payload }
    },
    identifyBrowser(state) {
      state.browserName = Browser.getBrowserName()
    },
    setRules(state, payload){
      state.swavanRules.length = 0;
      state.swavanRules.push(...payload)
    },
  },
  actions: {
    async loadAppInfo(state) {
      const payload = await api.appInfo()
      state.commit('setAppInfo', payload.data)
    },
    async getResponseByID(state, rule_id) {
      return await api.getResponses(rule_id)
    },    
    async saveSettings(state, payload) {
      await api.saveSettings({...payload})
    },
    async saveRule(state, payload){
      await api.saveRule({...payload});
    },
    async removeRule(state, payload){
      await api.deleteRule({...payload});
    },
    async getRules(state, search){
      const _rules = await api.loadRule(search);
      state.commit('setRules', _rules)
    },
    async changeRuleStatus(state, changePayload) {
      await db.rules.update(changePayload.id, { is_enabled: changePayload.is_enabled })
    },
    async updateRules(state, payload) {
      await api.saveRule({...payload})
    },
    async loadSetting(state) {
      const settings = await api.loadSettings()
      if (settings && settings.length > 0)
          state.commit("setSettings", settings[0])
    },   
    async loadHostUrl(state, search) {
      const urls = await api.loadHostURL(search)
      if (urls) {
        state.commit("setHostUrl", urls)
      }
    },
    async addHostUrl(state, url) {
      await api.saveHostURL(url)
    },
    async deleteHostUrl(state, url) {
      await api.deleteHostURL(url)
    },
    async saveRequestFilterTypes(state, payload) {
      await api.saveRequestFilterTypes(payload)
    },
    async loadRequestFilterTypes(state) {
      const payload =  await api.loadRequestFilterTypes();
      state.commit("setTypes", payload)
    },
  },
  modules: {
  },
  getters : {
    hostUrls: (state) => {
      return state.urls;
    },
    browser: (state) => {
      return state.browserName;
    },
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
      return state.settings ? state.settings.isEnabled : true
    },
    isReloadActive: (state) => () => {
      return Object.keys(state.settings).length > 0 ? state.settings.reload : false
    },
    settings: (state) => () => {
      return Object.keys(state.settings).length > 0 ? state.settings : { isEnabled: true,  reload: false }
    },
    info: (state) => {
      return state.appData
    },
    requestTypes: (state) => {
      return state.requestTypes;
    }
  }
})
