<template>
    <v-dialog :value="open" persistent max-width="290" @input="onDialogInput">
        <v-card dark>
            <v-toolbar dark flat>
                <v-toolbar-title
                    data-test="save-as-dialog.title.toolbar-title"
                    >{{ $t('saveAsDialog.title') }}</v-toolbar-title
                >
            </v-toolbar>
            <v-text-field
                data-test="save-as-dialog.profile.text-field"
                dark
                type="text"
                ref="profile"
                tab=""
                v-model="profile"
                :placeholder="$t('saveAsDialog.profile.placeholder')"
                :label="$t('saveAsDialog.profile.label')"
            >
            </v-text-field>
            <v-card-actions>
                <v-btn
                    data-test="save-as-dialog.actions-remove.button"
                    color="primary"
                    round
                    @click="submit"
                    >{{ $t('saveAsDialog.actions.saveAs') }}</v-btn
                >
                <v-btn
                    data-test="save-as-dialog.actions-cancel.button"
                    color="warning"
                    round
                    @click="cancel"
                    >{{ $t('saveAsDialog.actions.cancel') }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Dialog from '../lib/dialog.class';

@Component({
    name: 'save-as-dialog',
})
export default class SaveAsDialog extends Dialog {
    @Prop({ default: false }) open!: boolean;
    @Prop({ default: '' }) itemName!: string;

    public profile: string = '';

    public submit(): SaveAsDialog {
        this.$emit('saveAs', this.profile);
        this.profile = '';
        return this;
    }

    public onDialogInput(value: boolean): void {
        if (!value) {
            this.cancel();
        }
    }
}
</script>

<style scoped></style>
