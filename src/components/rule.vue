<template name="new-rules">
  <div class="rule">
    <b-modal
      header-bg-variant="dark"
      header-border-variant="dark"
      header-text-variant="light"
      ok-only
      ok-title="Close"
      ok-variant="danger"
      id="modal-center"
      v-model="hasError"
      centered
      title="Error Message"
    >
      <p class="my-4">
        <b-alert show variant="warning">
          <strong color=""> {{ this.errorMessage }} </strong>
        </b-alert>
      </p>
    </b-modal>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-card no-body>
        <b-tabs v-model="tab" card>
          <b-tab title="Form">
            <div class="eachRow">
              <b-form-input
                id="swavan-rules-name"
                v-model.trim="form.name"
                required
                placeholder="Enter Name of the Rules"
              >
              </b-form-input>
            </div>
            <div class="eachRow">
              <b-form-textarea
                id="swavan-rules-description"
                v-model.trim="form.description"
                placeholder="Enter rules descriptions"
                rows="3"
                max-rows="6"
              >
              </b-form-textarea>
            </div>
            <div class="eachRow">
              <b-form-select
                id="input-source-type"
                v-model="form.source_type"
                :options="source_types"
                required
              >
              </b-form-select>
            </div>
            <div class="eachRow">
              <b-form-select
                id="input-operator"
                v-model="form.operator"
                :options="operators"
                required
              >
              </b-form-select>
            </div>
            <div class="eachRow">
              <b-form-input
                id="swavan-rules-name"
                v-model="form.source"
                required
                placeholder="e.g http://www.example/api/"
              >
              </b-form-input>
            </div>
            <div
              class="eachRow"
              v-for="(response, responseIndex) in form.responses"
              v-bind:key="responseIndex"
            >
              <b-card
                v-if="!response.mark_for_deletion"
                border-variant="light"
                no-body
                id="add-response-logic"
                class="mb-1 custom-card"
              >
                <b-card-header
                  class="p-1"
                  role="tab"
                  header-border-variant="dark"
                  header-bg-variant="dark"
                  text-variant="white"
                >
                  <b-button
                    v-b-toggle="responseIndex + '-response'"
                    variant="dark"
                  >
                    <b-icon
                      v-if="response.is_logic_enabled"
                      variant="success"
                      scale="0.75"
                      icon="circle-fill"
                    ></b-icon>
                    {{ response.tags || "Response logic" }}
                  </b-button>
                  <b-button
                    v-if="responseDeletionAllowed"
                    style="float: right"
                    @click="removeResponses(responseIndex)"
                    v-b-tooltip.hover
                    title="Remove response logic"
                    variant="dark"
                  >
                    <b-icon icon="trash" scale="1" variant="danger"></b-icon>
                  </b-button>
                  <b-button
                    style="float: right"
                    v-b-toggle="responseIndex + '-response'"
                    variant="dark"
                  >
                    <span class="when-open">
                      <b-icon
                        icon="arrows-collapse"
                        scale="1"
                        variant="light"
                      ></b-icon>
                    </span>
                    <span class="when-closed">
                      <b-icon
                        icon="arrows-expand"
                        scale="1"
                        variant="light"
                      ></b-icon>
                    </span>
                  </b-button>
                </b-card-header>
                <b-collapse
                  :id="responseIndex + '-response'"
                  visible
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-card-body>
                    <b-form-group
                      description="Data source i.e. Redirect to another endpoint, mock data or block"
                    >
                      <b-form-select
                        :disabled="
                          response &&
                          response.data &&
                          response.data.action_perform === 'e'
                        "
                        id="input-data-source-type"
                        v-model="response.data_source_type"
                        :options="data_source_types"
                        required
                      ></b-form-select>
                    </b-form-group>
                    <div
                      v-if="
                        (response.data && response.data.id) ||
                        response.data_source_type === 'r'
                      "
                      class="link-line"
                    >
                      <b-input-group class="mt-3">
                        <b-input-group-prepend>
                          <b-button
                            v-b-tooltip.hover
                            title="Edit Mock Data"
                            @click="
                              load_mocked_response(
                                responseIndex,
                                response.data.id
                              )
                            "
                            v-if="
                              response.data_source_type === 'd' &&
                              response.data &&
                              !response.data.is_mock_loading &&
                              response.data.id &&
                              !response.data.content
                            "
                            variant="primary"
                            type="button"
                          >
                            <b-icon
                              icon="pencil-square"
                              aria-hidden="true"
                            ></b-icon>
                          </b-button>

                          <b-button
                            variant="primary"
                            v-if="
                              response.data && response.data.is_mock_loading
                            "
                          >
                            <b-icon
                              icon="arrow-clockwise"
                              scale="1"
                              animation="spin-pulse"
                            ></b-icon>
                          </b-button>

                          <b-form-input
                            type="url"
                            variant="link"
                            v-model="response.data.link"
                            placeholder="i.e https://example.com"
                            :readonly="response.data_source_type === 'd'"
                            description="Shoule only contain http url"
                          >
                          </b-form-input>
                        </b-input-group-prepend>

                        <b-input-group-append>
                          <b-button
                            v-b-tooltip.hover
                            title="View Mock Data"
                            variant="dark"
                            @click=makeRedirectLink(response)
                            target="_blank"
                          >
                            <b-icon
                              variant="light"
                              scale="1.1"
                              icon="arrow-up-right"
                              font-scale="1"
                            ></b-icon>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </div>

                    <div
                      class="custom-tab-view"
                      v-if="
                        response.data_source_type === 'd' &&
                        (response.data && response.data.id
                          ? response.data.content &&
                            response.data.action_perform !== 'h'
                          : true)
                      "
                    >
                      <b-tabs content-class="mt-3" align="left">
                        <b-tab class="custom-tab-body" title="Data">
                          <div class="eachRow">
                            <b-form-textarea
                              class="mock-editor"
                              id="mock-data"
                              :required="true"
                              v-model="response.data.content"
                              :state="response.data.content.length >= 1"
                              placeholder="Enter mock data here"
                              rows="5"
                            >
                            </b-form-textarea>
                            <b-form-checkbox
                              id="checkbox-1"
                              v-model="response.cloud_store_permission"
                              name="checkbox-1"
                              value="a"
                              unchecked-value="n"
                            >
                              Store mock data in the server
                            </b-form-checkbox>
                          </div>
                          <div
                            v-if="response.cloud_store_permission !== 'a'"
                            class="notification"
                          >
                            <b-alert show>
                              This extension use <code> data: </code> schema to
                              redirect the call and some of the browser does not
                              allow that.
                            </b-alert>
                          </div>
                        </b-tab>
                        <b-tab
                          v-if="response.cloud_store_permission === 'a'"
                          class="custom-tab-body"
                          title="Headers"
                        >
                          <div
                            v-for="(header, headerIndex) in response.data
                              .headers"
                            v-bind:key="headerIndex"
                          >
                            <div class="eachRow">
                              <b-input-group>
                                <b-form-input
                                  id="swavan-header-key"
                                  v-model.trim="header.key"
                                  required
                                  placeholder="Header Field"
                                >
                                </b-form-input>
                                <b-form-input
                                  id="swavan-header-value"
                                  v-model.trim="header.value"
                                  required
                                  placeholder="Value"
                                >
                                </b-form-input>
                                <b-input-group-append>
                                  <b-button
                                    variant="danger"
                                    v-b-tooltip.hover
                                    title="Remove header"
                                    @click="
                                      removeHeader(responseIndex, headerIndex)
                                    "
                                    class="mb-1"
                                  >
                                    <b-icon
                                      icon="trash"
                                      variant="light"
                                      aria-label="Remove header"
                                    >
                                    </b-icon>
                                  </b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </div>
                          </div>
                          <b-button
                            size="md"
                            variant="link"
                            v-b-tooltip.hover
                            title="Add more header"
                            @click="addHeader(responseIndex)"
                            class="mb-1"
                          >
                            <b-icon
                              icon="file-plus-fill"
                              aria-label="Add more header"
                            ></b-icon>
                            Add
                            {{
                              response.data_source_type === "d"
                                ? "Response"
                                : "Request"
                            }}
                            header
                          </b-button>
                        </b-tab>
                        <b-tab
                          v-if="response.cloud_store_permission === 'a'"
                          class="custom-tab-body"
                          title="Status"
                        >
                          <b-form-group
                            description="Status code will be return in response"
                          >
                            <b-form-input
                              type="text"
                              id="swavan-rules-data"
                              v-model="response.data.status"
                              placeholder="Status code"
                            >
                            </b-form-input>
                          </b-form-group>
                        </b-tab>
                        <b-tab
                          v-if="response.cloud_store_permission === 'a'"
                          class="custom-tab-body"
                          title="Content Type"
                        >
                          <!-- Filter section -->
                          <b-form-group
                            description="Content type of the response data"
                          >
                            <b-form-input
                              type="text"
                              id="swavan-rules-data"
                              v-model="response.data.content_type"
                              placeholder="Content Type"
                            >
                            </b-form-input>
                          </b-form-group>
                        </b-tab>
                      </b-tabs>
                    </div>
                    <b-form-group
                      description="Use this response logic for given HTTP method"
                    >
                      <b-form-select
                        id="input-source-http-method"
                        v-model="response.http_method"
                        :options="http_methods"
                      ></b-form-select>
                    </b-form-group>
                    <div
                      class="filter"
                      v-bind:class="[
                        response.filters && response.filters.length > 0
                          ? 'custom-tab-view'
                          : '',
                      ]"
                    >
                      <div
                        v-for="(filter, filterIndex) in response.filters"
                        v-bind:key="filterIndex"
                      >
                        <div class="eachRow">
                          <b-input-group>
                            <b-input-group-prepend>
                              <b-form-select
                                id="input-source-filter-by-option"
                                v-model="filter.filter_by"
                                :options="filter_by_options"
                              >
                              </b-form-select>
                            </b-input-group-prepend>
                            <b-tooltip
                              :target="
                                'filter-key-index' + responseIndex + filterIndex
                              "
                              triggers="hover"
                            >
                              {{ filter.key || "Add Filter Key" }}
                            </b-tooltip>
                            <b-form-input
                              :id="
                                'filter-key-index' + responseIndex + filterIndex
                              "
                              v-model.trim="filter.key"
                              required
                              placeholder="Key"
                            >
                            </b-form-input>
                            <b-tooltip
                              :target="
                                'filter-value-index' +
                                responseIndex +
                                filterIndex
                              "
                              triggers="hover"
                            >
                              {{ filter.value || "Add Filter value" }}
                            </b-tooltip>
                            <b-form-input
                              :id="
                                'filter-value-index' +
                                responseIndex +
                                filterIndex
                              "
                              v-model.trim="filter.value"
                              required
                              placeholder="Value"
                            >
                            </b-form-input>

                            <b-input-group-append>
                              <b-button
                                size="sm"
                                variant="danger"
                                v-b-tooltip.hover
                                title="Remove filter logic"
                                @click="
                                  removeFilters(responseIndex, filterIndex)
                                "
                              >
                                <b-icon
                                  icon="trash"
                                  variant="light"
                                  aria-label="Remove filter logic"
                                ></b-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </div>
                      </div>

                      <b-button
                        size="md"
                        variant="light"
                        v-b-tooltip.hover
                        title="Add more filter logic"
                        @click="addFilters(responseIndex)"
                        class="mb-1"
                      >
                        <b-icon
                          icon="file-plus-fill"
                          aria-label="Add more and logic"
                        ></b-icon>
                        More Filter
                      </b-button>
                    </div>
                    <div class="eachRow">
                      <b-form-group
                        description="Give a name to this response logic i.e. Error Response, Empty data response, block call"
                      >
                        <b-form-input
                          v-model="response.tags"
                          placeholder="Give a name to this response logic"
                        >
                        </b-form-input>
                      </b-form-group>
                    </div>
                    <div v-if="response.data_source_type === 'd'" class="eachRow">
                      <b-form-group description="Maximum allowed response delay is 60 sec">
                        <b-input-group prepend="Delay" >
                        <b-input v-model="response.delay" type="number" placeholder="Add response delay duration"></b-input>
                        <b-input-group-append text>
                            <b-input-group-text>
                                sec
                            </b-input-group-text>
                        </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </div>
                    <div>
                      <b-form-checkbox
                        switch
                        v-model="response.is_logic_enabled"
                        size="lg"
                      >
                        {{ response.is_logic_enabled ? "Enable" : "Disable" }}
                      </b-form-checkbox>
                    </div>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
            <div class="eachRow">
              <b-button
                @click="addResponses()"
                v-b-tooltip.hover
                title="Add more response logic"
                variant="dark"
              >
                <b-icon
                  icon="plus-circle-fill"
                  scale="1"
                  variant="light"
                ></b-icon>
                Add Response
              </b-button>
            </div>
            <div class="eachRow">
              <b-form-checkbox v-model="form.is_enabled">
                <span v-if="isCreateRule"> Activate rule on create </span>
                <span v-if="!isCreateRule">
                  Rule is
                  <span v-if="!form.is_enabled"> Disabled </span>
                  <span v-if="form.is_enabled"> Enabled </span>
                </span>
              </b-form-checkbox>
            </div>
          </b-tab>
          <b-tab lazy  title="JSON">
            <b-card-text>
            <b-form-group
                :disabled="!isPaste"
                :label="isPaste ? 'Paste Rule Here' : ''"
                :description=JSONRulesTextAreaDesc>
              
              <b-form-textarea
                id="json-rule-data"
                :required="true"
                :formatter="jsonValidate"
                v-model="raw"
                :state="isFormValid"
                placeholder="Paste rule here"
                rows="10"
              >
              </b-form-textarea>
            </b-form-group>
            </b-card-text>
          </b-tab>
        </b-tabs>
        <b-card-footer v-if="isSubmitVisibility">
          <div>
            <b-button
              size="md"
              :disabled="!isSubmitable || isSaving"
              variant="primary"
              type="submit"
            >
              <b-icon
                v-if="!isSaving"
                icon="download"
                aria-hidden="true"
              ></b-icon>
              <b-icon
                v-if="isSaving"
                icon="arrow-clockwise"
                animation="spin-pulse"
                font-scale="1"
              ></b-icon>
              <span> Sav</span>
              <span v-if="isSaving">ing</span>
              <span v-if="!isSaving">e</span>
            </b-button>
            &nbsp;
            <b-button
              size="sl"
              variant="danger"
              type="button"
              @click="cancelRule"
            >
              <b-icon icon="x-circle-fill" aria-hidden="true"></b-icon>
              Close
            </b-button>
          </div>
        </b-card-footer>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import {
  RuleModel,
  ResponseModel,
  FilterModel,
  HeaderModel,
  isValid,
  DataModel,
  OPERATORS,
  SOURCE_TYPES_OPTION,
  DATA_SOURCE_TYPES_OPTION,
  FILTER_BY_OPTIONS,
  HTTP_METHODS_OPTIONS,
} from "../models";

export default {
  name: "NewRules",
  props: {
    rule: {},
    activeTab: Number,
  },
  created() {
    this.updateForm(this.rule);
    this.tab = this.activeTab;
  },
  data() {
    return {
      form: { ...JSON.parse(JSON.stringify(RuleModel)) },
      source_types: SOURCE_TYPES_OPTION,
      operators: OPERATORS,
      data_source_types: DATA_SOURCE_TYPES_OPTION,
      http_methods: HTTP_METHODS_OPTIONS,
      filter_by_options: FILTER_BY_OPTIONS,
      show: true,
      isSaving: false,
      hasError: false,
      errorMessage: "",
      tab: 0
    };
  },
  methods: {
    makeRedirectLink(response) {
      let url = response.data.link;
      if(response.data_source_type === 'd' && response.delay > 0)
        url = `${response.data.link}?mocky-delay=${response.delay}s`;
      const win = window.open(url, '_blank');
      win.focus();
    },
    updateForm(rule) {
      for (const key of Object.keys(rule)) {
        if (key === "responses") {
          const _responses = rule[key].map((row) => {
            const rw = row ? row : {};
            const _result = { ...ResponseModel, ...rw };
            if (!_result.data)
                _result.data = { ...DataModel };
            if(rule.id)
                _result.data["action_perform"] = "e";
            return _result;
          });
          this.$set(this.form, "responses", _responses);
        } else {
          this.$set(this.form, key, rule[key]);
        }
      }
    },
    async onSubmit(evt) {
      this.isSaving = true;
      evt.preventDefault();
      const save_data = { ...this.form };
      save_data.responses.forEach((row) => {
        if (row.data && row.data.content && !row.data.action_perform) {
          row.data.action_perform = "a";
        }
      });
      try {
        await this.$store.dispatch("saveRule", { ...save_data });
        this.isSaving = false;
        this.form.name = "";
        this.form.description = "";
        this.$emit("saved");
        this.form = JSON.parse(JSON.stringify(this.form));
      } catch {
        this.errorMessage = `
                    Oops something went wrong,
                    unable to save data
                    please try again later`;
        this.isSaving = false;
        this.hasError = true;
      }
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.name = "";
      this.form.description = "";
      this.show = false;
      this.form = JSON.parse(JSON.stringify(this.form));
      this.$nextTick(() => {
        this.show = true;
      });
    },
    cancelRule() {
      this.$emit("close");
    },
    addResponses() {
      const responses = { ...ResponseModel };
      responses.data = { ...DataModel };
      responses.data.key = uuidv4();
      responses.filters = [];
      this.form.responses.push({ ...responses });
    },
    addHeader(responseIndex) {
      const dataSource = this.form.responses[responseIndex].data_source_type;
      this.form.responses[responseIndex].data.headers.push({
        ...HeaderModel,
        type: dataSource === "r" ? "q" : "s",
      });
    },
    removeHeader(responseIndex, headerIndex) {
      this.form.responses[responseIndex].data.headers.splice(headerIndex, 1);
    },
    addFilters(responseIndex) {
      this.form.responses[responseIndex].filters.push({ ...FilterModel });
    },
    removeFilters(responseIndex, filterIndex) {
      this.form.responses[responseIndex].filters.splice(filterIndex, 1);
    },
    removeResponses(responseIndex) {
      if (this.responseDeletionAllowed) {
        if(this.form.responses[responseIndex].data.action_perform === 'c') {
            this.form.responses.splice(responseIndex, 1)
            return
        }
        this.$set(
          this.form.responses[responseIndex],
          "mark_for_deletion",
          true
        );
        this.$set(
          this.form.responses[responseIndex].data,
          "action_perform",
          "d"
        );
      }
    },
    jsonValidate(value) {
      try {
        return this.action && this.action === 'paste' ? "" : JSON.stringify(JSON.parse(value), null, "\t");
      } catch (e) {
        return value;
      }
    },
    async load_mocked_response(responseIndex, response_data_id) {
      this.$set(
        this.form.responses[responseIndex].data,
        "is_mock_loading",
        true
      );
      try {
        const mock = await this.$store.dispatch(
          "getResponseByID",
          response_data_id
        );
        if (mock.status === 200) {
          Object.keys(mock.data).forEach((key) => {
            if (key === "content") {
              const content = mock.data[key];
              try {
                mock.data[key] = content;
              } catch {
                mock.data[key] = content;
              }
            }
            this.$set(
              this.form.responses[responseIndex].data,
              key,
              mock.data[key]
            );
          });

          if(this.form.responses[responseIndex].data['action_perform'] === 'c') {
              this.$set(this.form.responses[responseIndex].data, "id", null);
              this.$set(this.form.responses[responseIndex].data, "action_perform", 'a');
              this.$set(this.form.responses[responseIndex].data, "link", null);
          } else {
              this.$set(this.form.responses[responseIndex].data, "action_perform", 'e');
          }
        }
      } catch {
        this.errorMessage = `
                    Oops something went wrong,
                    Unable to fetch the data at this time 
                    please try again later`;
        this.hasError = true;
      }
      this.$set(
        this.form.responses[responseIndex].data,
        "is_mock_loading",
        false
      );
    },
  },
  filters: {
    accordianIdMaker(prefix, index) {
      return `${prefix}-${index}`;
    },
  },
  computed: {
    JSONRulesTextAreaDesc() {
        if (this.isFormValid) {
            return 'Valid Rule';
        }
        return 'Invalid Rule'
    },
    isSubmitVisibility() {
        if (this.isPaste && this.tab === 1) {
            return true
        }
        if (!this.isPaste && this.tab === 0) {
            return true
        }
        return false
    },
    isSubmitable() {
        return this.isFormValid && (( this.isPaste && this.tab === 1 ) || this.tab === 0 )
    },
    isPaste() {
       return this.activeTab === 1;
    },
    isFormValid() {
      return isValid(this.form);
    },
    responseDeletionAllowed() {
      return (
        this.form.responses.filter((row) => !row.mark_for_deletion).length > 1
      );
    },
    isCreateRule() {
      return !this.form["id"];
    },
    raw: {
      get: function () {
        return JSON.stringify(this.form, null, "\t");
      },
      set: function (val) {
        try {
          const rule = JSON.parse(val);
          this.updateForm(rule);
        } catch {
          return;
        }
      },
    },
  },
};
</script>

<style scoped>
#json-rule-data {
    font-size: 13px;
}
.eachRow {
  padding-bottom: 10px;
}
.rule {
  padding: 0px;
}

.card {
  border: none;
}
.custom-card {
  box-shadow: 0 2px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, -0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 1;
  border-radius: 0px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: color, background-color;
  will-change: color, background-color;
}

.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}

.isa_info,
.isa_success,
.isa_warning,
.isa_error {
  margin: 10px 0px;
  padding: 12px;
}

.isa_info {
  color: #00529b;
  background-color: #bde5f8;
}

.isa_success {
  color: #4f8a10;
  background-color: #dff2bf;
}

.isa_warning {
  color: #9f6000;
  background-color: #feefb3;
}

.isa_error {
  color: #d8000c;
  background-color: #ffd2d2;
}

.custom-select-button {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
}

.custom-select-button > .input-only {
  width: 120px;
}

@media screen and (min-width: 700px) {
  .custom-select-button > * {
    width: 100%;
  }
}

.singleLine {
  margin-right: 5px;
}

.custom-tab-view {
  background: rgb(221, 220, 220, 0.25);
  margin-bottom: 10px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  z-index: 1;
  border-radius: 0px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: color, background-color;
  will-change: color, background-color;
}
.custom-tab-body {
  padding: 10px 10px 0px 10px;
}

.filter {
  padding: 10px;
  margin: 10px 0px;
  border-radius: 5px;
}
.filter:last-child {
  padding-bottom: 0px;
}

.notification {
  padding: 10px 0px;
}

.link-line {
  margin-bottom: 10px;
  display: flex;
  align-items: stretch;
  align-content: center;
}

.link-line :first-child {
  flex-grow: 8;
}

.mock-editor {
  background: rgb(237, 235, 235, 0.5);
  color: rgb(39, 38, 38);
  font-weight: 300;
  font-size: 13px;
  margin-bottom: 10px;
}
</style>