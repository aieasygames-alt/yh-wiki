const fs = require('fs');
const path = '/Users/robert/Documents/Website/异环/yh-wiki/data/characters.json';
const chars = JSON.parse(fs.readFileSync(path, 'utf8'));

// CV data from Bahamut forum + additional research
const cvMap = {
  'zero':      { cvZh: '马洋/曹彤', cvJp: '内田雄马/内田真礼', cvJpEn: 'Yuma Uchida/Maaya Uchida' },
  'baicang':   { cvZh: '桑毓泽', cvJp: '中村悠一', cvJpEn: 'Yuichi Nakamura' },
  'edgar':     { cvZh: '四白', cvJp: '三瓶由布子', cvJpEn: 'Yuko Sanpei' },
  'skia':      { cvZh: '刘雨轩', cvJp: '杉田智和', cvJpEn: 'Tomokazu Sugita' },
  'adler':     { cvZh: '王宇航', cvJp: '森川智之', cvJpEn: 'Tomoyuki Morikawa' },
  'mint':      { cvZh: '陈雨', cvJp: '鬼头明里', cvJpEn: 'Akari Kito' },
  'hathor':    { cvZh: '洪海天', cvJp: '市之濑加那', cvJpEn: 'Kana Ichinose' },
  'nanally':   { cvZh: '宋媛媛', cvJp: '竹达彩奈', cvJpEn: 'Ayana Taketatsu' },
  'xiaozhi':   { cvZh: '则灵', cvJp: '小原好美', cvJpEn: 'Konomi Kohara' },
  'lacrimosa': { cvZh: '宴宁', cvJp: '长绳麻理亚', cvJpEn: 'Maria Naganawa' },
  'haniel':    { cvZh: '苏子芜', cvJp: '石见舞菜香', cvJpEn: 'Maaya Sakamoto' },
  'daffodil':  { cvZh: '陈彦亦', cvJp: '大原沙耶香', cvJpEn: 'Sayaka Ohara' },
  'jiuyuan':   { cvZh: '张安琪', cvJp: '田中理惠', cvJpEn: 'Rie Tanaka' },
  'fadia':     { cvZh: '裴致莹', cvJp: '真藤圭', cvJpEn: 'Kei Shindo' },
  // Additional confirmed CVs
  'hotori':    { cvZh: '陶典', cvJp: '石川由依', cvJpEn: 'Yui Ishikawa' },
  'sakiri':    { cvZh: '小连杀', cvJp: '日高里菜', cvJpEn: 'Rina Hidaka' },
  'alphard':   { cvZh: '刘琮', cvJp: '子安武人', cvJpEn: 'Takehito Koyasu' },
  'taygedo':   { cvZh: '王肖兵', cvJp: '置鲇龙太郎', cvJpEn: 'Ryotaro Okiayu' },
  'miyan':     { cvZh: '沐霏', cvJp: '悠木碧', cvJpEn: 'Aoi Yuki' },
};

let updated = 0;
chars.forEach(c => {
  const cv = cvMap[c.id];
  if (cv) {
    c.cvZh = cv.cvZh;
    c.cvJp = cv.cvJp;
    c.cvJpEn = cv.cvJpEn;
    updated++;
  }
});

fs.writeFileSync(path, JSON.stringify(chars, null, 2), 'utf8');
console.log(`Updated ${updated} characters with CV data out of ${chars.length} total.`);
console.log(`Missing CV data: ${chars.filter(c => !c.cvZh).map(c => c.id + '(' + c.name + ')').join(', ')}`);
