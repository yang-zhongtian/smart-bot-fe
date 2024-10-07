<script setup lang="ts">
import BuildingData from '@/assets/unity/Building.data?url'
import BuildingFramework from '@/assets/unity/Building.framework.js?url'
import BuildingLoader from '@/assets/unity/Building.loader.js?url'
import BuildingWasm from '@/assets/unity/Building.wasm?url'
import UnityWebgl from 'unity-webgl'
import VueUnity from 'unity-webgl/vue'

const unityContext = new UnityWebgl({
  loaderUrl: BuildingLoader,
  dataUrl: BuildingData,
  frameworkUrl: BuildingFramework,
  codeUrl: BuildingWasm,
})

// send message to unity
function test() {
  unityContext.send('objectName', 'methodName', {
    id: 0,
    angle: 90,
  })
}

// unityContext.on('device', () => alert('click device ...'))
</script>

<template>
  <VueUnity :unity="unityContext" width="800" height="600" />
  <button @click="test" />
</template>
