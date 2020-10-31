<template name="component-name">
  <div>
    <div>
      <!-- Search Box -->
      <b-card border-variant="light">
        <div class="search-container">
          <b-form-input
            list="my-list-id"
            v-model="search"
            v-on:keyup.enter="searchRules"
            placeholder="Search Rules"
          >
          </b-form-input>
          <b-button-group>
            <b-button
              @click="updateStatusInModal('add')"
              title="Add New Rule"
              variant="light"
            >
              <b-icon
                scale="1.5"
                variant="primary"
                icon="file-plus-fill"
              ></b-icon>
            </b-button>
            <b-button
              scale="0.5"
              @click="updateStatusInModal('paste')"
              title="Paste and Create Rule"
              variant="light"
            >
              <b-icon variant="primary" icon="file-earmark"></b-icon>
            </b-button>
          </b-button-group>
        </div>
      </b-card>

      <b-modal
        :static="true"
        :lazy="true"
        v-b-modal.modal-xl
        size="xl"
        id="modal-edit-rule"
        scrollable
        header-text-variant="light"
        header-bg-variant="dark"
        header-close-variant="danger"
        body-class="p-0"
        hide-footer
        v-model="modalShow"
        :title="modelHeaderText"
      >
        <NewRules
          :rule="selected_rule"
          :activeTab="newRulesTabIndex"
          v-on:saved="refreshRule"
          v-on:close="() => (modalShow = false)"
        />
      </b-modal>

      <!-- List of rules -->
      <div class="table-container">
        <b-table
          :sticky-header="tableHeight"
          hover
          show-empty
          :items="rules"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          tableVariant="dark"
          :sort-null-last="true"
          :fields="fields"
          :busy="isBusy"
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(is_enabled)="data">
            <b-form-checkbox
              switch
              v-model="data.item.is_enabled"
              style="text-align: right"
              @change="toggleStatus({ id: data.item.id, is_enabled: $event })"
              size="lg"
            >
            </b-form-checkbox>
          </template>

          <!-- Title and Descriptions -->
          <!-- Is favorite -->
          <template v-slot:cell(is_favorite)="data">
            <div style="width: 20px">
              <b-dropdown size="sm" right no-caret variant="link">
                <template v-slot:button-content>
                  <b-icon icon="three-dots-vertical"></b-icon>
                </template>

                <b-dropdown-item
                  variant="dark"
                  size="sm"
                  @click="updateStatusInModal('edit', data.item)"
                >
                  <b-icon
                    class="editor"
                    icon="pencil"
                    variant="primary"
                    aria-hidden="true"
                  >
                  </b-icon>
                  <span> Edit </span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item
                  variant="dark"
                  :disabled="data.item.is_favorite"
                  @click="deleteRule(data.item)"
                  size="sm"
                >
                  <b-icon
                    class="editor"
                    icon="trash"
                    variant="primary"
                    aria-hidden="true"
                  ></b-icon>
                  <span> Delete </span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item
                  variant="dark"
                  @click="copy(data.item, 'b-toaster-bottom-center', false)"
                  size="sm"
                >
                  <b-icon
                    class="editor"
                    icon="files"
                    variant="primary"
                    aria-hidden="true"
                  ></b-icon>
                  <span> Copy Rule </span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item-button text title="Favorites">
                  <b-form-checkbox
                    variant="light"
                    v-model="data.item.is_favorite"
                    @change="
                      toggleStatus({ id: data.item.id, is_favorite: $event })
                    "
                  >
                    <span> Favorite </span>
                  </b-form-checkbox>
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
          </template>

          <template v-slot:cell(name)="data">
            <div style="text-align: left">
              <b-icon
                v-if="data.item.is_favorite"
                variant="success"
                scale="0.75"
                icon="heart-fill"
              ></b-icon>
              <strong
                v-b-tooltip
                :title="data.item.description"
                v-on:dblclick="
                  copy(data.item, 'b-toaster-bottom-center', false)
                "
              >
                {{ data.item.name }}
              </strong>
            </div>
          </template>
          <!-- Is enabled -->
          <template v-slot:head(is_enabled)="data">
            <div style="text-align: right">{{ data.label }}</div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  padding: 0 !important;
}
.custom-action {
  padding: 5px 0px;
}

.custom-action > a {
  padding-right: 10px;
}

.no-rule-found {
  text-align: center;
  font-size: medium;
  font-weight: 600;
  padding: 30px;
}

.add-new {
  padding-bottom: 10px;
  padding-right: 20px;
  width: 100%;
}

.add-new > :first-child {
  float: right;
}

.table-container {
  overflow-y: scroll;
  min-height: 250px;
}
@media only screen and (min-width: 601px) {
  .table-container {
    padding: 0px 20px;
  }
}
.search-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.search-container > :first-child {
  margin-right: 5px;
}

.text-wrap {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mock-editor {
  background: rgb(32, 23, 23);
  color: white;
  font-weight: 300;
  font-size: medium;
  margin-bottom: 10px;
  min-height: 300px;
}
.b-table-sticky-header {
  overflow-y: visible;
}
</style>
<script>
import { v4 as uuidv4 } from "uuid";
import NewRules from "@/components/rule";

export default {
  name: "Rules",
  mounted() {},
  components: { NewRules },
  data() {
    return {
      search: "",
      sortBy: "is_favorite",
      sortDesc: false,
      sortDirection: "desc",
      fields: [
        {
          key: "is_favorite",
          label: "#",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "name", label: "Rule Name", sortable: true },
        { key: "is_enabled", label: "Status", sortable: false },
      ],
      modelHeaderText: "Add rule",
      selected_rule: {},
      currentResponses: [],
      modalShow: false,
      newRulesTabIndex: 0,
      isBusy: false,
    };
  },
  methods: {
    async load() {
      this.$store.dispatch("getRules", this.search);
    },
    async searchRules() {
      await this.load();
    },
    async copy(data, toaster, append = false) {
      const _rule = JSON.parse(
        JSON.stringify(this.$store.getters.rule(data.id))
      );
      _rule["id"] = null;
      _rule.name = `Copied ${_rule.name}`;
      _rule.responses = _rule.responses.map((row) => {
        if (row.data) {
          row.data["key"] = uuidv4();
          row.data["action_perform"] = "c";
        }
        return row;
      });

      const stringified_rule = JSON.stringify(_rule);
      await navigator.clipboard.writeText(stringified_rule);
      this.notifier(
        `!!! Copied`,
        `${data.name} rule copied`,
        "primary",
        append
      );
    },
    notifier(
      title,
      body,
      variant,
      appendToast,
      toaster = "b-toaster-bottom-center"
    ) {
      this.$bvToast.toast(body, {
        title,
        toaster,
        variant,
        appendToast,
        autoHideDelay: "1000",
      });
    },
    sendMessage(message = {}) {
      browser.runtime.sendMessage(message);
    },
    async toggleStatus(payload) {
      await this.$store.dispatch("toggleStatus", payload);
      this.sendMessage({ action: "reload" });
    },
    async deleteRule(_rule) {
      await this.$store.dispatch("removeRule", { ..._rule });
      await this.$store.dispatch("getRules");
      this.sendMessage({ action: "reload" });
    },
    async updateStatusInModal(actionFor, _rule) {
      this.newRulesTabIndex = 0;
      if (actionFor === "add") {
        this.modelHeaderText = "Add Rule";
        this.selected_rule = {};
      } else if (actionFor === "edit") {
        this.modelHeaderText = "Edit Rule";
        this.selected_rule = _rule;
      }
      if (actionFor === "paste") {
        this.modelHeaderText = "Paste Rule";
        this.newRulesTabIndex = 1;
        this.selected_rule = {};
      }
      this.modalShow = !this.modalShow;
    },
    async rulesLoader() {
      try {
        this.isBusy = true;
        await this.$store.dispatch("getRules", this.search);
        this.isBusy = false;
      } catch {
        this.isBusy = false;
      }
    },
    async refreshRule() {
      await this.rulesLoader();
      this.modalShow = false;
      this.sendMessage({ action: "reload" });
    },
  },
  async created() {
    await this.rulesLoader();
  },
  computed: {
    rules() {
      return this.$store.getters.rules;
    },
    tableHeight() {
      const searchURL = "/swavan-rules";
      var url = browser.runtime.getURL(searchURL);
      const _extensionPopup = browser.extension.getViews({ type: "popup" });
      for (const _tab of _extensionPopup) {
        if (_tab.location.origin === url.replace(searchURL, "")) {
          return "380px";
        }
      }
      return "80vh";
    },
  },
};
</script>
