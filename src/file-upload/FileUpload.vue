<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    :customRequest="uploadFile"

    
  >

    <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 100%; height: 125px" />

    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
<script setup>
import { UPLOADFILE } from "@/plugins/api";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import {  ref , onMounted, watch} from "vue";

const emit = defineEmits(['imageLink'])// eslint-disable-line
const props = defineProps(['picture'])// eslint-disable-line
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


    const fileList = ref([]);
    const loading = ref(false);
    const imageUrl = ref("");
    
    const imageLink = ref("");

    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }

      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }

      if (info.file.status === "error") {
        loading.value = false;
        message.error(t('fail'));
      }
    };

    //Custom upload file
    const uploadFile = async (data) => {
      const formData = new FormData();
      formData.append("file", data.file);
      let res = await UPLOADFILE(formData);
    
      if (res.code == 200) {
        message.success(t('success'), 0.4);
        imageUrl.value = res.obj;
        imageLink.value = res.obj;
         emit('imageLink',{
          link: imageLink.value
         });
      }
    };

    // const imageLinkUrl = (value)=>{
    //   console.log(value);
    // emit(['imageLink',imageLink.value]);
    // }

    const beforeUpload = (file) => {
      const isImgOrVideo =
        file.type === "image/jpeg" || file.type === "image/png" ||  file.type=== "video/mp4" ;
      // const max9MB = (1024*1024)*9; 
      const isLt30M = file.size / 1024 / 1024 < 30;

      if (!isLt30M) {
        message.error(t('error_file_size'));
      }
      return isImgOrVideo && isLt30M;
    };
       
       watch(()=>{
           imageUrl.value= props.picture
       })

      
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