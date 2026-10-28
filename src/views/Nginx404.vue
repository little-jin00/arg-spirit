<template>
  <div class="nginx404">
    <div class="box">
      <h1>404 Not Found</h1>
      <hr />
      <p>nginx/1.18.0</p>
      <p class="back"><a href="#" @click.prevent="$router.back()">返回</a></p>
    </div>
  </div>
</template>

<style scoped>
.nginx404 {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #fff; color: #000;
  font-family: "Times New Roman", serif;
}
.box { width: 480px; }
h1 { font-size: 28px; font-weight: normal; }
hr { border: none; border-top: 1px solid #000; margin: 12px 0; }
p { font-size: 15px; }
.back { margin-top: 40px; }
.back a { color: #0000cc; }
</style>
