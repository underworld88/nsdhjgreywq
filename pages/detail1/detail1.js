//所设置的各项日程的【详情】
import Data from '../../common/data';
import {
  getDateStr
} from '../../common/util';
import {
  LEVEL
} from '../../common/constant';

Page({
  data: {
    item: '',
    levelSelectData: [LEVEL.normal, LEVEL.warning, LEVEL.danger],
  },
//显示具体的储存信息
  onLoad(option) {
    const {
      id
    } = option;
    Data.findOneById(id).then((item) => {
      item['addDate'] = getDateStr(new Date(item['addDate']));
      this.setData({
        item: item
      });
    }).catch(() => {
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  }
});