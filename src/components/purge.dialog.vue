<template>
  <v-dialog ref="dialog" :value="open" persistent max-width="290" @input="onDialogInput">
    <v-card dark>
      <v-toolbar dark flat>
        <v-toolbar-title data-test="purge-dialog.title.toolbar-title">{{ $t("purgeDialog.title") }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text data-test="purge-dialog.content.card-text">{{ $t("purgeDialog.content", {type: itemName}) }}</v-card-text>
      <v-card-actions>
        <v-spacer data-test="purge-dialog.actions.spacer"></v-spacer>
        <v-btn data-test="purge-dialog.actions-remove.button" color="primary" round @click="confirm">{{ $t("purgeDialog.actions.remove") }}</v-btn>
        <v-btn data-test="purge-dialog.actions-cancel.button" color="warning" round @click="cancel">{{ $t("purgeDialog.actions.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Dialog from '../lib/dialog.class';

@Component({
    name: 'purge-dialog',
})
export default class PurgeDialog extends Dialog {
    @Prop({ default: false }) open!: boolean;
    @Prop({ default: '' }) itemName!: string;

    public onDialogInput(value: boolean): void {
        if (!value) {
            this.cancel();
        }
    }
}
</script>

<style scoped>
</style>
