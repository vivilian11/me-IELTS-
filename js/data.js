const STORAGE_KEY = 'ielts-data';

const defaultData = {
  words: [
    {
      id: 1, word: 'ambiguous', phonetic: '/æmˈbɪɡjuəs/',
      meaning: '模棱两可的',
      sentence: 'The instructions were ambiguous and confusing.',
      memory: '就像我对学雅思的态度 😂',
      status: 'new'
    },
    {
      id: 2, word: 'meticulous', phonetic: '/məˈtɪkjələs/',
      meaning: '一丝不苟的，极其细心的',
      sentence: 'She was meticulous in her preparation for the exam.',
      memory: 'me + tick（打勾）+ ulous = 每一项都打勾✓',
      status: 'shaky'
    },
    {
      id: 3, word: 'prevalent', phonetic: '/ˈprevələnt/',
      meaning: '普遍的，盛行的',
      sentence: 'The use of smartphones is prevalent among young people.',
      memory: 'pre（之前）+ val（价值）+ ent → 之前就很有分量，说明很普遍',
      status: 'new'
    },
  ],
  grammar: [
    {
      id: 1,
      title: '主谓一致',
      wrong: 'The number of students are increasing.',
      right: 'The number of students is increasing.',
      note: '"The number of" 后面接单数动词！',
      rule: 'The number of + 名词 → 单数'
    },
  ],
  logs: [],
  streak: 0,
  lastLogDate: null,
};

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(defaultData);
  } catch {
    return structuredClone(defaultData);
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
