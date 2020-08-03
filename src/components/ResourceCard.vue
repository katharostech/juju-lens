<template>
  <q-card>
    <q-card-section>
      <!-- Card Heading -->
      <div class="row items-center">
        <div class="col-grow" style="flex: 1 1 0%">
          <!-- Controller name -->
          <div class="text-h6">
            <q-icon :name="headingIcon" class="on-left" />
            <router-link v-if="headingLink" :to="headingLink" style="text-decoration: none">
              {{ heading }}
            </router-link>
            <span v-else>{{ heading }}</span>
          </div>
          <div class="text-subtitle2 row">
            <!-- Info items -->
            <div v-for="(infoItem, i) in infoItems" :key="i" class="q-mr-sm">
              <q-icon :name="infoItem.icon" size="1em" class="q-ma-xs" />
              <q-tooltip v-if="infoItem.tooltip">{{
                infoItem.tooltip
              }}</q-tooltip>
              {{ infoItem.label }}
            </div>
          </div>
        </div>
        <div class="col-auto">
          <q-btn flat round icon="more_vert">
            <!-- Card action menu -->
            <q-menu
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
              style="font-size: 1em"
            >
              <q-item
                clickable
                v-close-popup
                class="bg-primary text-white"
                @click="$emit('edit')"
              >
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="bg-negative text-white"
                @click="$emit('delete')"
              >
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-separator v-if="showContentSection" />
    <q-card-section v-if="showContentSection">
      <slot name="default" />
    </q-card-section>
    <juju-loading :loading="loading" />
  </q-card>
</template>

<script lang="ts">
import JujuLoading from 'components/JujuLoading.vue';

import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    JujuLoading
  }
})
export default class ResourceCard extends Vue {
  @Prop({ type: String, default: '' }) readonly heading!: string;
  @Prop({ default: null }) readonly headingLink!: string | object | null;
  @Prop({ type: String, default: null }) readonly headingIcon!: string | null;
  @Prop({ type: Array, default: [] }) readonly infoItems!: {
    icon: string;
    label: string;
  }[];
  @Prop({ type: Boolean, default: false }) readonly loading!: boolean;
  @Prop({ type: Boolean, default: false })
  readonly showContentSection!: boolean;
}
</script>
