export const useVersionHook = (v = '0.0.1') => {
  const base = ref(v);
  const versionList = computed(() => base.value.split('.').map((v) => parseInt(v)));

  const segments = ref({
    major: 0,
    minor: 0,
    patch: 0,
  });

  const limit = computed(() => {
    let [major, minor, patch] = versionList.value;
    const limit = { major, minor, patch };
    if (segments.value.major > major) {
      limit.minor = 0;
      limit.patch = 0;
    } else if (segments.value.minor > minor) {
      limit.patch = 0;
    }
    return limit;
  });

  const isValid = computed(() => {
    let [major, minor, patch] = versionList.value;
    if (segments.value.major < major) {
      return false;
    }
    if (segments.value.minor < minor) {
      return false;
    }
    if (segments.value.patch < patch) {
      return false;
    }
    return version.value !== base.value;
  });

  const version = computed({
    get: () => `${segments.value.major}.${segments.value.minor}.${segments.value.patch}`,
    set: (value) => updateSegments(value),
  });

  const updateSegments = (base: string) => {
    const [major, minor, patch] = base.split('.');
    segments.value.major = parseInt(major);
    segments.value.minor = parseInt(minor);
    segments.value.patch = parseInt(patch);
  };

  const update = () => (base.value = version.value);

  updateSegments(base.value);

  return {
    isValid,
    limit,
    segments,
    version,
    update,
  };
};
