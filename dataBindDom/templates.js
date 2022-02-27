export function userInfoTpl(info) {
  return `
    <h2>姓名：<span class="__username">${info.username || '未录入'}</span></h2>
    <h2>年龄：<span class="__age">${info.age || '未录入'}</span></h2>
    <h2>邮箱：<span class="__email">${info.email || '未录入'}</span></h2>
    <h2>电话号码：<span class="__tel">${info.tel || '未录入'}</span></h2>
  `;
}