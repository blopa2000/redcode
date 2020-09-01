<template>
  <div>
    <v-dialog v-model="show">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Upload publication</v-card-title>

        <v-card-text>
          <v-form
            id="form"
            ref="form"
            v-model="valid"
            enctype="multipart/form-data"
            @submit.prevent="uploadPublication"
          >
            <v-file-input required @change="onFileSelected" label="Images"></v-file-input>
            <v-text-field
              v-model="description"
              :rules="descriptionRules"
              label="Description"
              required
            ></v-text-field>
            <v-btn
              type="submit"
              color="accent"
              rounded
              :loading="loading"
              :disabled="loading || !valid"
              :elevation="0"
            >save</v-btn>
          </v-form>
        </v-card-text>

        <v-divider/>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text :disabled="loading" @click="show = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  props: {
    activeModal: Boolean
  },
  data() {
    return {
      loading: false,
      valid: true,
      description: "",
      publication: [],
      descriptionRules: [v => !!v || "Description is required"]
    };
  },
  computed: {
    ...mapState(["token"]),
    show: {
      get() {
        return this.activeModal;
      },
      set(value) {
        this.$emit("close", value);
      }
    }
  },
  methods: {
    async uploadPublication() {
      if (this.$refs.form.validate() && this.publication) {
        this.loading = true;
        //API web FormData
        let data = new FormData();

        data.append("publicData", this.publication);
        data.append("description", this.description);

        const values = await axios.post("/functs/publication", data, {
          headers: { Authorization: this.token }
        });
        if (values.data.success) {
          this.$emit("saveImages", values.data.success);
        } else {
          // this.MessageFloat({
          //   message :values.data.message,
          //   show:true,
          //   value:"warning"
          // })
        }
        this.loading = false;
        this.show = false;
      } else {
        this.MessageFloat({
          message: "Your image is required",
          show: true,
          value: "warning"
        });
      }
    },
    onFileSelected(file) {
      this.publication = file;
    }
  }
};
</script>