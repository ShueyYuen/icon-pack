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
    camelCase(`${props.config.family}-${props.demo?.class}`.replace('--', '-').replace(/^-/, ''))
  )
);
</script>

<template>
  <details open class="soft--box code-card">
    <summary>App.vue</summary>
    <div class="editor">
      <ol class="line-count">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
      </ol>
      <pre class="code" data-code="javascript">
<code>&lt;<span class="identify">script</span> <span class="object">setup</span> <span class="object">lang</span>=<span class="string">"ts"</span>&gt;
<span class="key">import</span> <span class="bracket">{</span> <span class="object">{{name}}</span> <span class="bracket">}</span> <span class="key">from</span> <span class="string">'{{ group }}/{{ config.family }}'</span>;
&lt;/<span class="identify">script</span>&gt;

&lt;<span class="identify">template</span>&gt;
  &lt;<span class="component">{{name}} </span>/&gt;
&lt;/<span class="identify">template</span>&gt;</code>
</pre>
    </div>
  </details>
</template>
