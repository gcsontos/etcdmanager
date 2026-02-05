<template>
    <v-dialog ref="dialog" :value="open" dark scrollable full-width persistent @input="onDialogInput">
        <v-card dark>
            <v-toolbar dark flat>
                <v-toolbar-title
                    data-test="whatsnew-dialog.title.toolbar-title"
                    >{{ $t('whatsNewDialog.title', {version: version}) }}</v-toolbar-title
                >
            </v-toolbar>
            <v-card-text
                data-test="whatsnew-dialog.content.card-text"
                v-html="content"
            ></v-card-text>
            <v-checkbox
                data-test="whatsnew-dialog.dontshow.chechbox"
                :label="$t('whatsNewDialog.dontshow')"
                @change="hideNews()"
                primary
                hide-details
            ></v-checkbox>
            <v-card-actions>
                <v-spacer data-test="whatsnew-dialog.actions.spacer"></v-spacer>
                <v-btn
                    data-test="whatsnew-dialog.actions-cancel.button"
                    color="warning"
                    round
                    @click="cancel"
                    >{{ $t('whatsNewDialog.actions.cancel') }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Dialog from '../lib/dialog.class';
import { LocalStorageService } from '../services/local-storage.service';

const { ipcRenderer } = require('electron');

@Component({
    name: 'whatsnew-dialog',
})
export default class WhatsNewDialog extends Dialog {
    @Prop({ default: false }) open!: boolean;

    public content: string = '';
    private localStorageService: LocalStorageService;

    constructor() {
        super();
        // @ts-ignore
        this.localStorageService = new LocalStorageService(this.$ls);
    }

    get version() {
        return this.$store.state.version;
    }

    hideNews() {
        this.localStorageService.set(`news${this.version}`, true);
    }

    public onDialogInput(value: boolean): void {
        if (!value) {
            this.cancel();
        }
    }

    created() {
        ipcRenderer.send('whatsnew-load');
        ipcRenderer.on('whatsnew-data', (...args: any[]) => {
            this.content = args[1];
        });
    }
}
</script>

<style scoped></style>
