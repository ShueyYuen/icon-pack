<template>
  <NuxtLayout>
    <template #header>
      <h1>图标说明</h1>
    </template>
    <HelperIcon class="help-img"></HelperIcon>
    <ClientOnly>
      <ol>
        <li class="order-item">
          <h2 class="title">
            <span>下载原文件</span>
            <a href="/template.ai" class="soft--link">图标制作模板.ai</a>
          </h2>
          <div class="content">
            <i class="soft--icon"><HelperTemplate></HelperTemplate></i>
            <div class="description">
              图标在绘制时均以标准图标大小1024x1024px绘制，因为在制作成字体时文件需要设置较高的清晰度，所以图标路径也需要等比例放大。
            </div>
          </div>
        </li>
        <li class="order-item">
          <h2 class="title">设置图标大小</h2>
          <div class="content">
            <i class="soft--icon"><HelperSize></HelperSize></i>
            <div class="description">
              设计师可以直接将画好的图标路径复制到模版里，根据模板的辅助线，对图标
              进行位置的调节，居中，四周等距，保证图标的统一。
            </div>
          </div>
        </li>
        <li class="order-item">
          <h2 class="title">
            存储为svg格式（建议使用存储为svg，不要使用导出为svg）
          </h2>
          <div class="content">
            <HelperExport></HelperExport>
          </div>
        </li>
        <li class="order-item">
          <h2 class="title">上传图标并修改展示名称和图标名称</h2>
          <ul class="rule-list">
            <li>
              <b>有意义:</b>不过于具体，也不过于抽象
              <div class="example">
                <div class="example-item">
                  <span class="worse">a-layout_v_l5x</span>
                  <span class="better">layout-vertical</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-layout_v_b5x</span>
                  <span class="better">layout-vertical-bottom</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-desc_accessionnumber5x</span>
                  <span class="better">accession-number</span>
                </div>
              </div>
            </li>
            <li><b>简短:</b>1到3个单词</li>
            <li>
              <b>可读性:</b>便于沟通交流
              <div class="example">
                <div class="example-item">
                  <span class="worse">a-3d_viewF5x</span>
                  <span class="better">cube-front</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-rotationbeifen65x</span>
                  <span class="better">rotate-north</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-rotationbeifen35x</span>
                  <span class="better">rotate-northeast</span>
                </div>
              </div>
            </li>
            <li>
              <b>连词符分割单词:</b>
              <div class="example">
                <div class="example-item">
                  <span class="worse">a-add_fill5x</span>
                  <span class="better">add-fill</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-correct_fill</span>
                  <span class="better">correct-fill</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-changepassword</span>
                  <span class="better">change-password</span>
                </div>
              </div>
            </li>
            <li>
              <b>统一前缀:</b>
              作为命名空间，方便项目间隔离（即配置项目的组件前缀和字体前缀）
            </li>
            <li>
              <b>禁止拼音、中文、大写、除连词符以外的符号:</b>不方便编写代码
              <div class="example">
                <div class="example-item">
                  <span class="worse">ico_keshiguanli</span>
                  <span class="better">depart-manage</span>
                </div>
                <div class="example-item">
                  <span class="worse">a-3d_viewF5x</span>
                  <span class="better">cube-front</span>
                </div>
                <div class="example-item">
                  <span class="worse">brush-</span>
                  <span class="better">brush-minus</span>
                </div>
              </div>
            </li>
            <li>
              <b>描述性的修饰词放在结尾:</b>
              <div class="example">
                <div class="example-item">
                  <span class="worse">fill-add</span>
                  <span class="better">add-fill</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li class="order-item">
          <h2 class="title">检查是否是多色图标</h2>
          <div class="content">
            <IconContent
              :icon="nonColorIcon"
              font=""
              component=""
            ></IconContent>
            <IconContent :icon="coloredIcon" font="" component=""></IconContent>
            <IconContent
              :icon="colorfulIcon"
              font=""
              component=""
            ></IconContent>
          </div>
          <div class="content">
            <div class="description" style="max-width: unset; margin-top: 20px">
              <p>
                可以鼠标悬停到左边俩个图标上或底部切换主题，对比图标去色后的表现。
              </p>
              <p>
                如果不是不允许修改颜色（包括渐变）的图标，建议将图标去色。如仅透明度上不同，使用<code>fill-opacity</code>属性而不是<code>fill</code>。
              </p>
            </div>
          </div>
        </li>
        <li class="order-item">
          <h2 class="title">更新图标包版本</h2>
        </li>
      </ol>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
const colorfulIcon = {
  name: "消息",
  class: "message",
  svg: '<svg viewBox="0 0 1024 1024"><path fill="#73D13D" d="M725.333 128H298.667c-105.814 0-192 86.187-192 192v554.667c0 8.533 5.12 16.213 13.226 19.626 2.56 1.28 5.547 1.707 8.107 1.707 5.547 0 11.093-2.133 14.933-6.4l103.254-102.827C258.133 774.827 274.347 768 291.413 768h433.92c105.814 0 192-86.187 192-192V320c0-105.813-86.186-192-192-192zm-384 373.333a53.333 53.333 0 1 1 0-106.666 53.333 53.333 0 0 1 0 106.666zm170.667 0a53.333 53.333 0 1 1 0-106.666 53.333 53.333 0 0 1 0 106.666zm170.667 0a53.333 53.333 0 1 1 0-106.666 53.333 53.333 0 0 1 0 106.666z"/><path fill="#81D550" d="M797.952 142.25A192.427 192.427 0 0 1 917.333 320v4.523L473.9 768H291.413a63.777 63.777 0 0 0-40.533 14.507l-4.693 4.266L142.933 889.6c-3.84 4.267-9.386 6.4-14.933 6.4-2.56 0-5.547-.427-8.107-1.707a21.29 21.29 0 0 1-13.226-19.626v-41.174l359.04-358.997c8.362 14.507 23.338 24.747 40.832 26.581l5.461.256a53.333 53.333 0 0 0 26.496-99.626zM682.667 394.668a53.333 53.333 0 1 0 0 106.666 53.333 53.333 0 0 0 0-106.666z"/><path fill="#8FDA63" d="M725.333 128c25.686 0 50.176 5.077 72.576 14.25L538.496 401.708a53.333 53.333 0 0 0-72.79 72.789l-359.04 359.04V531.883l403.926-403.926zm-384 266.667a53.333 53.333 0 1 0 0 106.666 53.333 53.333 0 0 0 0-106.666z"/><path fill="#ABE38A" d="m510.507 128-403.84 403.84V320a192.299 192.299 0 0 1 182.997-191.787l9.003-.213h211.84z"/></svg>',
};

const coloredIcon = {
  name: "截图",
  class: "screenshot",
  svg: '<svg viewBox="0 0 1024 1024"><path d="M213.333 256a32 32 0 0 1 0 64h-42.666A10.667 10.667 0 0 0 160 330.667v490.666A10.667 10.667 0 0 0 170.667 832h682.666A10.667 10.667 0 0 0 864 821.333V330.667A10.667 10.667 0 0 0 853.333 320H448a32 32 0 0 1 0-64h416a64 64 0 0 1 64 64v512a64 64 0 0 1-64 64H160a64 64 0 0 1-64-64V320a64 64 0 0 1 64-64h53.333zM512 384c106.037 0 192 85.963 192 192s-85.963 192-192 192-192-85.963-192-192 85.963-192 192-192zm0 64c-70.688 0-128 57.312-128 128s57.312 128 128 128 128-57.312 128-128-57.312-128-128-128zm277.333-96a42.667 42.667 0 1 1 0 85.333 42.667 42.667 0 0 1 0-85.333zm-544-202.667H416a32 32 0 0 1 0 64H245.333a32 32 0 0 1 0-64z" fill="#000000"></path></svg>',
};

const nonColorIcon = {
  name: "截图",
  class: "screenshot",
  svg: '<svg viewBox="0 0 1024 1024"><path d="M213.333 256a32 32 0 0 1 0 64h-42.666A10.667 10.667 0 0 0 160 330.667v490.666A10.667 10.667 0 0 0 170.667 832h682.666A10.667 10.667 0 0 0 864 821.333V330.667A10.667 10.667 0 0 0 853.333 320H448a32 32 0 0 1 0-64h416a64 64 0 0 1 64 64v512a64 64 0 0 1-64 64H160a64 64 0 0 1-64-64V320a64 64 0 0 1 64-64h53.333zM512 384c106.037 0 192 85.963 192 192s-85.963 192-192 192-192-85.963-192-192 85.963-192 192-192zm0 64c-70.688 0-128 57.312-128 128s57.312 128 128 128 128-57.312 128-128-57.312-128-128-128zm277.333-96a42.667 42.667 0 1 1 0 85.333 42.667 42.667 0 0 1 0-85.333zm-544-202.667H416a32 32 0 0 1 0 64H245.333a32 32 0 0 1 0-64z"/></svg>',
};
</script>

<style lang="less" scoped>
.help-img {
  width: 100%;
  flex-shrink: 0;
}
.title {
  line-height: 32px;
  font-size: 18px;
}
.content {
  display: flex;
  align-items: center;
  column-gap: 60px;
  .soft--icon {
    font-size: 192px;
    height: 194px;
  }
  .description {
    color: var(--theme-text-low);
    line-height: 28px;
    max-width: 450px;
  }
}
.rule-list {
  line-height: 28px;
  margin-left: 15px;
  margin-top: 10px;
  li {
    list-style-type: circle;
    b {
      font-weight: bold;
      margin-right: 25px;
    }
    .example {
      span {
        padding: 0 5px;
      }
    }
    .worse {
      color: #de625c;
      text-decoration: line-through;
    }
    .better {
      color: #94bc4e;
    }
  }
}
ol {
  list-style-type: decimal;
  li.order-item {
    margin-top: 50px;
  }
}
</style>
