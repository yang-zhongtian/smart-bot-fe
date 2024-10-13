<script setup lang="ts">
import BuildingData from '@/assets/unity/Bot.data?url'
import BuildingFramework from '@/assets/unity/Bot.framework.js?url'
import BuildingLoader from '@/assets/unity/Bot.loader.js?url'
import BuildingWasm from '@/assets/unity/Bot.wasm?url'
import UnityWebgl from 'unity-webgl'
import VueUnity from 'unity-webgl/vue'

const unityContext = new UnityWebgl({
  loaderUrl: BuildingLoader,
  dataUrl: BuildingData,
  frameworkUrl: BuildingFramework,
  codeUrl: BuildingWasm,
})

function setAngle(angle: number[]) {
  unityContext.send('Robot', 'SetAngle', angle.join('|'))
}

defineExpose({
  setAngle,
})
</script>

<template>
  <VueUnity :unity="unityContext" />
</template>
