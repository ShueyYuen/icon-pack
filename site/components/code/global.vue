<script setup lang="ts">
import { camelCase, upperFirst } from 'lodash-unified';
import { IIcon, IProject } from '@icon/schema';

const props = defineProps<{
  demo?: IIcon;
  config: Pick<IProject, 'prefix' | 'family'>;
  group: string;
}>();

const name = computed(() =>
  upperFirst(
    camelCase(
      `${props.config.prefix}-${props.config.family}-${props.demo?.class}`
        .replace('--', '-')
        .replace(/^-/, '')
    )
  )
);
</script>

<template>
  <details open class="soft--box code-card">
    <summary>main.ts</summary>
    <div class="editor">
      <ol class="line-count">
        <li>1</li>
        <li>2</li>
      </ol>
      <pre class="code" data-code="javascript">
<code><span class="key">import</span> <span class="object">GlobalIcons</span> <span class="key">from</span> <span class="string">'{{ group }}/{{ config.family }}/global'</span>;</code>
<code><span class="identify">const</span> <span class="object">app</span> = <span class="function">createApp</span><span class="bracket">(</span><span class="object">App</span><span class="bracket">)</span>.<span class="function">use</span><span class="bracket">(</span><span class="object">GlobalIcons</span><span class="bracket">)</span>;</code>
</pre>
    </div>
  </details>
  <details open class="soft--box code-card">
    <summary>App.vue</summary>
    <div class="editor">
      <ol class="line-count">
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ol>
      <pre class="code" data-code="javascript">
<code>&lt;<span class="identify">template</span>&gt;
  &lt;<span class="component">{{name}}</span>/&gt;
&lt;/<span class="identify">template</span>&gt;</code>
</pre>
    </div>
  </details>
</template>
