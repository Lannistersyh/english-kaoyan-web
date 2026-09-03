/**
 * DeepSeek API Key 混淆存储
 * key 不以明文出现在源码中，运行时还原
 * 注意：前端混淆不等于安全，仅防止被人 Ctrl+F 直接搜到
 */

// Base64 编码后反转，再分片存储
const _k = ['=YTO0MjYlNDOy', 'ITNmJmYyIWMih', 'DNkhTM4cTM0Aj', 'Y5YGMts2c']

/** 还原 API Key */
export function getApiKey(): string {
  try {
    const b64 = _k.join('').split('').reverse().join('')
    return atob(b64)
  } catch {
    return ''
  }
}
