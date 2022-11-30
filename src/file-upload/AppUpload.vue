<template>
  <a-upload
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    :customRequest="uploadFile"

    
  >
    <!-- action="https://www.mocky.io/v2/5cc8019d300000980a055e76" -->
    <div v-if="uploadUrl">
   
      <a-typography-text type="success">  <CheckOutlined />Success</a-typography-text>
    </div>
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>

  </a-upload>
</template>
<script setup>
import { UPLOADFILE } from "@/plugins/api";
import { PlusOutlined, LoadingOutlined ,CheckOutlined} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import {  ref , onMounted} from "vue";

const emit = defineEmits(['uploadLink'])// eslint-disable-line

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

import {useI18n} from 'vue-i18n';

const {t}= useI18n({
  inheritLocale: true,
  useScope: "local"
})
 

    const loading = ref(false);
    const uploadUrl = ref("");
    
    const uploadLink = ref("");

    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }

      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          uploadUrl.value = base64Url;
          loading.value = false;
        });
      }

      if (info.file.status === "error") {
        loading.value = false;
        message.error("upload error");
      }
    };

    //Custom upload file
    const uploadFile = async (data) => {
      const formData = new FormData();
      formData.append("file", data.file);
      let res = await UPLOADFILE(formData);
    
      if (res.code == 200) {
        message.success(t('upload_success'), 0.4);
        uploadUrl.value = res.obj;
        uploadLink.value = res.obj;
        // console.log("uploadLink ",uploadLink.value);
         emit('uploadLink',{
          link: uploadLink.value
         });
      }
    };


    const beforeUpload = (file) => {
      
      const isApporIos = file;
        // file.type === "application/vnd.android.package-archive"  || file. ==="";
        // file.type;
        // console.log(""+file.type);
      // const max9MB = (1024*1024)*9; 
      // const isLt30M = file.size / 1024 / 1024 < 30;

      // if (!isLt30M) {
      //   message.error("Image or Video must smaller than 30MB!");
      // }
      return isApporIos;
    };
       
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>    