<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        v-show="!imageCaptured"
        ref="video"
        class="full-width camera-video"
        autoplay
      />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width camera-canvas"
      />
    </div>
    <div class="text-center  q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        round
        color="grey-10"
        icon="eva-camera"
        syze="lg"
        round
      />
      <q-file
        v-else
        outlined
        label="Choose an image"
        accept="image/*"
        v-model="imageUpload"
        @input="captureImageFallback"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.caption"
          class="col col-sm-8"
          label="Caption"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.location"
          class="col col-sm-8"
          label="Location"
          dense
          :loading="locationLoading"
        >
          <template v-slot:append>
            <q-btn
              v-if="!locationLoading && locationSupported"
              round
              dense
              flat
              icon="eva-navigation-2-outline"
              @click="getLocation"
            />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-center q-mt-lg">
      <q-btn unelevated rounded color="primary" label="Post Image"/>
    </div>
  </q-page>
</template>

<script>
import {uid} from 'quasar';
import 'md-gum-polyfill';

export default {
  name: 'PageCamera',
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      cameraStream: null,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
    }
  },
  computed: {
    locationSupported() {
      return !!navigator.geolocation
    }
  },
  methods: {
    initCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then(stream => {
        this.$refs.video.srcObject = stream;
        this.cameraStream = stream;
      }).catch(error => {
        this.hasCameraSupport = false;
      })
    },
    captureImage() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;

      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true
       canvas.toBlob(blob => {
         this.post.photo = blob;
         this.stopStream();
       }, 'image/jpg');
    },
    stopStream() {
      if (!this.cameraStream) {
        return;
      }
      this.cameraStream.getTracks().forEach(function(track) {
        track.stop();
      });
    },
    captureImageFallback(file) {
      this.post.photo = file

      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');

      const reader = new FileReader()
      reader.onload = event => {
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img, 0, 0);
          this.imageCaptured = true
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);
    },
    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position);
      }, err => {
        this.locationError()
      }, { timeout: 7000})
    },
    getCityAndCountry({ coords }) {
      let apiUrl = `https://geocode.xyz/${coords.latitude},${coords.longitude}?json=1&lang=en`
      this.$axios.get(apiUrl).then(result => {
        this.locationSuccess(result.data);
      }).catch(err => {
        this.locationError()
      })
    },
    locationSuccess({ city, country }) {
      this.post.location = city;
      if (country) {
        this.post.location += `, ${country}`
      }
      this.locationLoading = false;
    },
    locationError() {
      this.$q.dialog({
        title: 'Error',
        message: 'Could not find location'
      });
      this.locationLoading = false;
    }
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.stopStream()
    }
  }
}
</script>

<style lang="scss">
.camera-frame {
  border: 2px solid $grey-10;
  border-radius: 8px;
}

.camera-video, .camera-canvas {
  aspect-ratio: 530 / 400;
}
</style>
